'use client';

import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center p-4 md:p-8">
      {/* Phone mockup container */}
      <div className="relative w-full max-w-[390px] lg:max-w-[430px]">
        {/* Phone bezel */}
        <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
          
          {/* Screen - this is the container for all app content including modals */}
          <div 
            id="phone-screen" 
            className="relative bg-white rounded-[2rem] overflow-hidden min-h-[700px] max-h-[85vh] flex flex-col"
          >
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 py-2 bg-white relative z-10 shrink-0">
              <span className="text-xs font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" opacity="0.3"/>
                  <path d="M12 5c3.86 0 7 3.14 7 7s-3.14 7-7 7"/>
                </svg>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                </svg>
                <div className="flex items-center">
                  <div className="w-6 h-3 border border-current rounded-sm relative">
                    <div className="absolute inset-0.5 bg-current rounded-xs" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* App content - children includes all app components */}
            {children}
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}
