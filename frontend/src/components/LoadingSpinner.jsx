import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="relative">
          {/* Animated circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-8 border-gray-200 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-8 border-transparent border-t-[#6A38C2] border-r-[#F83002] rounded-full animate-spin"></div>
          </div>
          
          {/* Center logo/icon */}
          <div className="relative flex items-center justify-center w-32 h-32">
            <Loader2 className="w-12 h-12 text-[#6A38C2] animate-spin" />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">
            Loading...
          </h2>
          <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your content</p>
        </div>
        
        {/* Pulsing dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-[#6A38C2] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#F83002] rounded-full animate-pulse delay-100" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[#6A38C2] rounded-full animate-pulse delay-200" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
