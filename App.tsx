import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import ProcessingScreen from './components/ProcessingScreen';
import ComparisonScreen from './components/ComparisonScreen';
import ResultScreen from './components/ResultScreen';
import { AppScreen } from './constants';
import { RestorationOptions } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | undefined>(undefined);
  
  // Default options
  const [restorationOptions, setRestorationOptions] = useState<RestorationOptions>({
    basic: true,
    advanced: false,
    colorize: false,
    hd: false
  });

  const handleImageSelect = (file: File | null, options: RestorationOptions) => {
    setRestorationOptions(options); // Save the selected options
    
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setSelectedFile(file);
    } else {
      setSelectedImage(undefined); // Use demo image
      setSelectedFile(null);
    }
    setResultImage(undefined); // Reset result
    setCurrentScreen(AppScreen.PROCESSING);
  };

  const handleProcessingComplete = (processedImageUrl?: string) => {
    if (processedImageUrl) {
      setResultImage(processedImageUrl);
    }
    setCurrentScreen(AppScreen.COMPARISON);
  };

  const handleProcessingCancel = () => {
    setCurrentScreen(AppScreen.HOME);
    setSelectedImage(undefined);
    setSelectedFile(null);
    setResultImage(undefined);
  };

  const handleComparisonNext = () => {
    setCurrentScreen(AppScreen.RESULT);
  };

  const handleComparisonBack = () => {
    setCurrentScreen(AppScreen.HOME); 
  };

  const handleResultBack = () => {
    setCurrentScreen(AppScreen.COMPARISON);
  };

  const handleResultHome = () => {
    setCurrentScreen(AppScreen.HOME);
    setSelectedImage(undefined);
    setSelectedFile(null);
    setResultImage(undefined);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto min-h-screen bg-black shadow-2xl overflow-hidden relative">
      {currentScreen === AppScreen.HOME && (
        <HomeScreen onImageSelect={handleImageSelect} />
      )}
      
      {currentScreen === AppScreen.PROCESSING && (
        <ProcessingScreen 
          onComplete={handleProcessingComplete} 
          onCancel={handleProcessingCancel}
          imageSrc={selectedImage}
          file={selectedFile}
          options={restorationOptions}
        />
      )}

      {currentScreen === AppScreen.COMPARISON && (
        <ComparisonScreen 
          onBack={handleComparisonBack}
          onNext={handleComparisonNext}
          originalImage={selectedImage}
          processedImage={resultImage}
        />
      )}

      {currentScreen === AppScreen.RESULT && (
        <ResultScreen 
          onBack={handleResultBack}
          onHome={handleResultHome}
          processedImage={resultImage}
        />
      )}
    </div>
  );
};

export default App;