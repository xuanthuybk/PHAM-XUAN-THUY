import React from 'react';
import { ChevronLeft, Wand2, Download, Share2, Crown, PenTool } from 'lucide-react';
import { DEMO_AFTER_IMAGE } from '../constants';

interface ResultScreenProps {
  onBack: () => void;
  onHome: () => void;
  processedImage?: string;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ onBack, onHome, processedImage }) => {
  const finalImage = processedImage || DEMO_AFTER_IMAGE;

  // --- DOWNLOAD LOGIC ---
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = `phuc-che-thanh-xuan-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ROBUST SHARE LOGIC ---
  const handleShare = async () => {
    try {
      // 1. Convert Base64/URL to a proper File object
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const file = new File([blob], "anh-phuc-che.png", { type: "image/png" });

      // 2. Prepare Share Data
      const shareData = {
        title: 'Phục Chế Ảnh Thanh Xuân',
        text: 'Ảnh đã được phục chế cực nét!',
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
        <h1 className="text-lg font-bold">Kết quả tuyệt vời!</h1>
        <div className="size-10"></div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center px-6 pt-4 pb-8 overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Kỷ niệm của bạn đã sẵn sàng!</h2>
          <p className="text-white/60 text-sm">Ảnh đã được tối ưu hóa độ nét và màu sắc tự nhiên.</p>
        </div>

        {/* Image Card */}
        <div className="relative w-full max-w-sm aspect-[3/4] mb-8 group">
           {/* Glow Effect */}
           <div className="absolute -inset-1 bg-gradient-to-tr from-primary/40 to-transparent rounded-2xl blur-md opacity-60"></div>
           
           <div className="relative h-full bg-zinc-800 p-2 rounded-xl shadow-2xl border border-white/10">
              <img 
                src={finalImage} 
                alt="Restored Result" 
                className="w-full h-full object-cover rounded-lg"
              />
              
              <div className="absolute top-5 left-5 bg-primary text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <Wand2 className="size-3" />
                <span>Đã phục hồi</span>
              </div>
           </div>
        </div>

        {/* Premium Banner */}
        <div className="w-full max-w-sm bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
             <div className="p-2 bg-primary/20 rounded-full text-primary">
                <Crown className="size-5" />
             </div>
             <div>
               <h3 className="font-bold text-sm">In ảnh chất lượng cao</h3>
               <p className="text-xs text-primary/80 mt-0.5">Nâng cấp để in khổ lớn và xóa logo mờ.</p>
             </div>
          </div>
          <button className="bg-primary text-black text-xs font-bold py-2 px-4 rounded-full whitespace-nowrap hover:bg-primary-dark transition-colors">
            Nâng cấp Premium
          </button>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <footer className="p-6 pt-4 bg-bg-dark border-t border-white/5 safe-area-bottom">
        <div className="flex gap-3 max-w-md mx-auto mb-4">
          <button 
            onClick={handleDownload}
            className="flex-1 bg-primary text-black font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
             <Download className="size-5" />
             <span>Tải ảnh về</span>
          </button>
          <button 
            onClick={handleShare}
            className="size-14 bg-zinc-800 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-zinc-700 active:scale-95 transition-transform"
          >
             <Share2 className="size-6" />
          </button>
        </div>
        
        <button 
          onClick={onHome} // Using onHome just to have an action, logically this might open an editor
          className="w-full flex items-center justify-center gap-2 text-sm text-white/50 hover:text-white transition-colors py-2"
        >
           <PenTool className="size-3" />
           <span>Chỉnh sửa thêm thủ công</span>
        </button>
      </footer>
    </div>
  );
};

export default ResultScreen;