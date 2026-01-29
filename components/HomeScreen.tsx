import React, { useState } from 'react';
import { Camera, Settings, User, Image as ImageIcon, Home, CheckSquare } from 'lucide-react';
import { SAMPLE_BACKGROUND_IMAGE } from '../constants';
import { RestorationOptions } from '../types';

interface HomeScreenProps {
  onImageSelect: (file: File | null, options: RestorationOptions) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onImageSelect }) => {
  const [options, setOptions] = useState<RestorationOptions>({
    basic: true,
    advanced: false,
    colorize: false,
    hd: false
  });

  const toggleOption = (key: keyof RestorationOptions) => {
    setOptions(prev => {
      // Logic: If Advanced is selected, Basic should be unselected, and vice versa (optional UX choice, but logical)
      const newOptions = { ...prev, [key]: !prev[key] };
      if (key === 'basic' && newOptions.basic) newOptions.advanced = false;
      if (key === 'advanced' && newOptions.advanced) newOptions.basic = false;
      return newOptions;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0], options);
    }
  };

  // Demo trigger wrapper
  const triggerDemo = () => {
    onImageSelect(null, options);
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-light text-slate-900 relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 z-10 bg-bg-light/80 backdrop-blur-sm">
        <div className="size-10 flex items-center justify-center rounded-full bg-slate-100">
          <User className="size-6 text-slate-600" />
        </div>
        <h1 className="text-lg font-bold">Phục chế ảnh</h1>
        <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <Settings className="size-6 text-slate-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 pt-4 pb-20 overflow-y-auto z-10">
        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold mb-2 text-slate-800">Trở Về Thanh Xuân</h2>
          <p className="text-slate-500 max-w-xs mx-auto">
            Hãy chọn một tấm ảnh cũ để bắt đầu hành trình tìm lại ký ức.
          </p>
        </div>

        {/* Upload Box */}
        <label 
          htmlFor="file-upload"
          className="bg-white rounded-2xl border-2 border-dashed border-primary/30 p-8 flex flex-col items-center justify-center gap-6 shadow-sm mb-4 cursor-pointer active:scale-95 transition-transform w-full"
        >
          <div className="size-20 rounded-full bg-green-50 flex items-center justify-center">
            <Camera className="size-10 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Chạm để chọn ảnh</h3>
            <p className="text-slate-400 text-sm">Hỗ trợ định dạng JPG, PNG</p>
          </div>
          
          <div className="relative">
            <span className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 inline-block">
              Tải ảnh lên
            </span>
          </div>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {/* Explicit Demo Trigger */}
        <div className="mb-8 flex justify-center">
            <button 
                onClick={triggerDemo}
                className="text-sm text-slate-500 font-medium hover:text-primary underline decoration-slate-300 hover:decoration-primary underline-offset-4 transition-all"
            >
                Hoặc thử với ảnh mẫu có sẵn
            </button>
        </div>

        {/* Options */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">Tùy chọn phục chế</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'basic', label: 'Cơ bản' },
              { id: 'advanced', label: 'Nâng cao' },
              { id: 'colorize', label: 'Tô màu' },
              { id: 'hd', label: 'Chất lượng HD' }
            ].map((opt) => (
              <div 
                key={opt.id}
                onClick={() => toggleOption(opt.id as keyof RestorationOptions)}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
              >
                <span className="font-semibold text-sm">{opt.label}</span>
                <div className={`size-5 rounded border flex items-center justify-center transition-colors ${options[opt.id as keyof RestorationOptions] ? 'bg-primary border-primary' : 'border-slate-300'}`}>
                  {options[opt.id as keyof RestorationOptions] && <CheckSquare className="size-3 text-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Decorative Background Image */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 pointer-events-none opacity-5 z-0">
        <img src={SAMPLE_BACKGROUND_IMAGE} alt="" className="w-full h-full object-cover grayscale opacity-50" />
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 flex justify-around py-3 pb-6 z-20">
        <button className="flex flex-col items-center gap-1 text-primary">
          <Home className="size-6" />
          <span className="text-[10px] font-bold">Trang chủ</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <ImageIcon className="size-6" />
          <span className="text-[10px] font-medium">Thư viện</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <User className="size-6" />
          <span className="text-[10px] font-medium">Cá nhân</span>
        </button>
      </nav>
    </div>
  );
};

export default HomeScreen;