import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Download, Share2, ImagePlus, ChevronsLeftRight } from 'lucide-react';
import { DEMO_BEFORE_IMAGE, DEMO_AFTER_IMAGE } from '../constants';

interface ComparisonScreenProps {
  onBack: () => void;
  onNext: () => void;
  originalImage?: string;
  processedImage?: string;
}

const ComparisonScreen: React.FC<ComparisonScreenProps> = ({ onBack, onNext, originalImage, processedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => { isDragging.current = false; };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const beforeSrc = originalImage || DEMO_BEFORE_IMAGE;
  const afterSrc = processedImage || DEMO_AFTER_IMAGE;

  // --- DOWNLOAD LOGIC ---
  const handleDownload = () => {
    if (!afterSrc) return;
    
    const link = document.createElement('a');
    link.href = afterSrc;
    link.download = `phuc-che-thanh-xuan-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ROBUST SHARE LOGIC ---
  const handleShare = async () => {
    if (!afterSrc) return;

    try {
      // 1. Convert Base64/URL to a proper File object
      const response = await fetch(afterSrc);
      const blob = await response.blob();
      const file = new File([blob], "anh-phuc-che.png", { type: "image/png" });

      // 2. Prepare Share Data
      const shareData = {
        title: 'Phục Chế Ảnh Thanh Xuân',
        text: 'Mình vừa phục chế lại bức ảnh này, mọi người xem có nét không nhé!',
        files: [file],
      };

      // 3. Check & Execute Native Share
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        throw new Error("Native sharing not supported");
      }
    } catch (error) {
      console.warn("Share failed, falling back to download:", error);
      
      // Fallback: Download the image first
      handleDownload();
      
      // Notify user
      setTimeout(() => {
        alert("Thiết bị không hỗ trợ chia sẻ trực tiếp. Ảnh đã được lưu về máy!\n\nBạn hãy mở Zalo hoặc Facebook để đăng tấm ảnh vừa tải về nhé.");
      }, 500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 z-20 bg-bg-dark/80 backdrop-blur-sm">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="size-6" />
        </button>
        <h1 className="text-lg font-bold">So sánh Kết quả</h1>
        <div className="size-10"></div>
      </header>

      {/* Main Comparison Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2">
        
        <div 
          ref={containerRef}
          className="relative w-full max-w-[400px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-black touch-none select-none cursor-ew-resize group"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Before Image (Background) */}
          <img 
            src={beforeSrc} 
            alt="Original" 
            className="absolute inset-0 w-full h-full object-cover filter grayscale-[50%] blur-[0.5px]"
            draggable={false}
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white z-10">
            Trước
          </div>

          {/* After Image (Foreground clipped) */}
          <div 
            className="absolute inset-0 h-full overflow-hidden border-r-2 border-primary"
            style={{ width: `${sliderPosition}%` }}
          >
            <img 
              src={afterSrc} 
              alt="Restored" 
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: containerRef.current?.getBoundingClientRect().width || '100%' }} // Keep image same size as container
              draggable={false}
            />
          </div>
          <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black z-10">
            Sau
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="size-8 bg-primary rounded-full shadow-lg flex items-center justify-center border-2 border-white">
              <ChevronsLeftRight className="size-4 text-white" />
            </div>
          </div>
        </div>

        <p className="mt-6 text-white/70 font-medium">Kéo để so sánh sự khác biệt</p>

        {/* Mini Slider Indicator */}
        <div className="mt-4 w-full max-w-[200px] flex flex-col gap-2">
           <input 
             type="range" 
             min="0" 
             max="100" 
             value={sliderPosition}
             onChange={(e) => setSliderPosition(Number(e.target.value))}
             className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
           />
           <div className="flex justify-between text-[10px] font-bold uppercase text-white/40">
              <span>Gốc</span>
              <span className="text-primary">Hoàn thiện</span>
           </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="p-6 bg-bg-dark border-t border-white/5 space-y-3">
        <button 
          onClick={handleDownload}
          className="w-full bg-primary hover:bg-primary-dark text-black font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Download className="size-5" />
          <span>Lưu vào máy</span>
        </button>

        <div className="flex gap-3">
          <button 
            onClick={handleShare}
            className="flex-1 bg-white/10 hover:bg-white/20 h-12 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-colors"
          >
            <Share2 className="size-4" />
            <span>Chia sẻ</span>
          </button>
          <button 
             onClick={onBack}
             className="flex-1 bg-white/10 hover:bg-white/20 h-12 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-colors"
          >
            <ImagePlus className="size-4" />
            <span>Ảnh mới</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ComparisonScreen;