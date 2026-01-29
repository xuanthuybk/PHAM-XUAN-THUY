import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { DEMO_BEFORE_IMAGE, DEMO_AFTER_IMAGE } from '../constants';
import { RESTORATION_CONFIG } from '../restorationConfig';
import { RestorationOptions } from '../types';

interface ProcessingScreenProps {
  onComplete: (resultUrl?: string) => void;
  onCancel: () => void;
  imageSrc?: string;
  file?: File | null;
  options?: RestorationOptions;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onComplete, onCancel, imageSrc, file, options }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const processingRef = useRef(false);

  // Helper to convert blob to base64
  const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: file.type,
          },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Helper to build the dynamic prompt based on checkbox options
  const buildDynamicPrompt = (baseConfig: typeof RESTORATION_CONFIG, userOptions?: RestorationOptions) => {
    // Create a deep copy to modify
    const config = JSON.parse(JSON.stringify(baseConfig));
    const opts = userOptions || { basic: true, advanced: false, colorize: false, hd: false };

    // 1. Logic for "Colorize" (Tô màu)
    if (opts.colorize) {
      config.task = "image_colorization_and_restoration";
      config.caption = config.caption.replace("giữ background gốc", "giữ background gốc, tô màu sống động");
    } else {
      // If NOT colorizing, remove the specific colorization block or neutralize it
      // We want to restore quality but keep original colors (e.g. B&W stays B&W)
      config.colorization = null; // Remove the instruction to colorize
      config.caption = config.caption.replace("ảnh màu hiện đại", "giữ tông màu gốc của ảnh");
      config.notes += " Do not colorize if the image is black and white. Preserve original color tone.";
      
      // Reduce saturation request in color_tone
      if (config.color_tone) {
        config.color_tone.saturation = "natural, preserve original";
        config.color_tone.vibrance = 0.0;
        config.color_tone.recolorize_consistently = false;
      }
    }

    // 2. Logic for "Advanced" vs "Basic"
    if (opts.advanced) {
      // Advanced: Increase strengths, use 'strict' everywhere
      config.controls.restoration_strength = 1.0;
      config.controls.face_identity_lock = 0.98;
      config.clean_up.reconstruct_missing_parts = "museum-grade highly detailed";
    } else {
      // Basic: Slightly lower strength to avoid AI hallucinations
      config.controls.restoration_strength = 0.85;
      // Change some "strict" to "moderate" for basic mode
      config.clean_up.remove_scratches = "moderate";
      config.clean_up.remove_dust = "moderate";
    }

    // 3. Logic for "HD Quality"
    if (opts.hd) {
      config.output.resolution = "MAXIMUM_AVAILABLE"; // Hint for max res
      config.detail_sharpness.amount = 0.6; // Higher sharpening
      config.camera_emulation.look += ", ultra-high resolution, 8k clarity";
      config.notes += " Output must be extremely high resolution and sharp.";
    } else {
      config.output.resolution = "standard"; 
    }

    return config;
  };

  useEffect(() => {
    // Prevent double execution in React strict mode
    if (processingRef.current) return;
    processingRef.current = true;

    let apiResultUrl: string | undefined = undefined;
    let isApiFinished = false;

    // 1. Visual Animation Logic
    const duration = 4000; 
    const intervalTime = 40;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const maxProgress = isApiFinished ? 100 : 90;
      const calculatedProgress = Math.min(Math.round((currentStep / steps) * 100), maxProgress);
      setProgress(calculatedProgress);

      if (isApiFinished && calculatedProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => onComplete(apiResultUrl), 500);
      }
    }, intervalTime);

    // 2. Real API Logic
    const performRestoration = async () => {
      if (!file) {
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 3000));
        apiResultUrl = DEMO_AFTER_IMAGE;
        isApiFinished = true;
        return;
      }

      try {
        console.log("Initializing Gemini API...");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Prepare image
        const imagePart = await fileToGenerativePart(file);

        // Build Dynamic Config
        const specificPrompt = buildDynamicPrompt(RESTORATION_CONFIG, options);
        // Inject filename for tracking context
        specificPrompt.input_image = "attached_image_file";

        const promptString = JSON.stringify(specificPrompt);

        console.log("Sending request to Gemini with options:", options);
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              imagePart,
              { text: promptString }
            ]
          }
        });

        console.log("Response received.");
        
        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64EncodeString = part.inlineData.data;
              const mimeType = part.inlineData.mimeType || 'image/png';
              apiResultUrl = `data:${mimeType};base64,${base64EncodeString}`;
              break;
            }
          }
        }

        if (!apiResultUrl) {
            console.warn("No image in response.");
            const textPart = response.text;
            if (textPart) {
                console.log("Text response:", textPart);
                setError("Model trả về văn bản. Thử lại với ảnh khác.");
            } else {
                setError("Không nhận được dữ liệu ảnh.");
            }
        }

        isApiFinished = true;

      } catch (err: any) {
        console.error("API Error:", err);
        setError("Lỗi kết nối API. Vui lòng kiểm tra lại.");
        isApiFinished = true;
      }
    };

    performRestoration();

    return () => clearInterval(timer);
  }, [onComplete, file, options]);

  // Circle progress calculation
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const displayImage = imageSrc || DEMO_BEFORE_IMAGE;

  if (error) {
     return (
        <div className="flex flex-col min-h-screen bg-bg-dark text-white items-center justify-center p-6">
            <AlertCircle className="size-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2 text-center">Đã có lỗi xảy ra</h2>
            <p className="text-white/60 text-center mb-8">{error}</p>
            <button 
                onClick={onCancel}
                className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90"
            >
                Quay lại
            </button>
        </div>
     )
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark text-white relative overflow-hidden transition-colors duration-500">
      {/* Header */}
      <header className="flex items-center p-4 sticky top-0 z-20">
        <button onClick={onCancel} className="size-10 flex items-center justify-center text-white/80 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft className="size-6" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">Đang phục chế</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* Image Container with Scanning Effect */}
        <div className="relative w-full max-w-[320px] aspect-[3/4] mb-12">
          <div className="absolute inset-0 rounded-2xl overflow-hidden bg-black/20 shadow-2xl border border-white/5">
             {/* Blurred Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-[2px] opacity-70 scale-105"
              style={{ backgroundImage: `url(${displayImage})` }}
            />
            
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent via-primary/40 to-transparent animate-[scan_2s_linear_infinite]" />

            {/* Center Progress Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative size-24 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-full">
                <svg className="size-full -rotate-90 transform">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-white/10"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-100 ease-linear"
                  />
                </svg>
                <span className="absolute text-lg font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Ảnh đang được phục chế</h2>
            <div className="flex flex-wrap justify-center gap-2">
                {options?.colorize && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">Tô màu</span>}
                {options?.hd && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">HD</span>}
                {options?.advanced && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Nâng cao</span>}
            </div>
            <p className="text-primary/80 italic text-sm mt-1">"Đang áp dụng công nghệ AI..."</p>
          </div>

          {/* Linear Progress Bar */}
          <div className="space-y-2">
             <div className="flex justify-between text-xs px-1">
                <span className="text-white/70">Xử lý chi tiết & màu sắc...</span>
                <span className="font-bold text-primary">{progress}%</span>
             </div>
             <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-100 ease-linear" 
                  style={{ width: `${progress}%` }}
                />
             </div>
          </div>

          <p className="text-xs text-white/50 leading-relaxed px-4">
            Quá trình có thể mất 10-20 giây.<br/>
            Vui lòng giữ kết nối mạng.
          </p>
        </div>
      </main>

      <div className="p-8 pb-12 flex justify-center">
        <button 
          onClick={onCancel}
          className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/20 transition-colors"
        >
          Hủy quá trình
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -20%; }
          100% { top: 120%; }
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;