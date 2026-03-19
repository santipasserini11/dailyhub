'use client';

import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

// iPhone 17 Pro Max dimensions: 440 x 956 points (similar to iPhone 15/16 Pro Max)
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 md:p-6">
      {/* Phone mockup container - iPhone 17 Pro Max aspect ratio */}
      <div className="relative w-full max-w-[440px]">
        {/* Phone bezel - titanium frame style */}
        <div className="relative bg-[#1c1c1e] rounded-[3.5rem] p-[3px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(0,0,0,0.6)]">
          {/* Inner bezel highlight */}
          <div className="relative bg-[#2c2c2e] rounded-[3.4rem] p-[2px]">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-20 flex items-center justify-center">
              {/* Camera and sensors */}
              <div className="w-3 h-3 rounded-full bg-[#1a1a2e] mr-2 ring-1 ring-[#2a2a3e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a]" />
            </div>
            
            {/* Screen - this is the container for all app content including modals */}
            <div 
              id="phone-screen" 
              className="relative bg-white rounded-[3.2rem] overflow-hidden flex flex-col"
              style={{ height: 'min(932px, 90vh)' }}
            >
              {/* Status bar - iOS 18+ style */}
              <div className="flex items-center justify-between px-8 pt-4 pb-2 bg-white relative z-10 shrink-0">
                <span className="text-sm font-semibold tracking-tight">9:41</span>
                <div className="flex items-center gap-1.5">
                  {/* Cellular */}
                  <svg className="w-[18px] h-[12px]" viewBox="0 0 18 12" fill="currentColor">
                    <rect x="0" y="7" width="3" height="5" rx="0.5" fillOpacity="0.3"/>
                    <rect x="4" y="5" width="3" height="7" rx="0.5" fillOpacity="0.3"/>
                    <rect x="8" y="3" width="3" height="9" rx="0.5"/>
                    <rect x="12" y="0" width="3" height="12" rx="0.5"/>
                  </svg>
                  {/* WiFi */}
                  <svg className="w-[17px] h-[12px]" viewBox="0 0 17 12" fill="currentColor">
                    <path d="M8.5 2.5C11.5 2.5 14.2 3.7 16 5.8L14.5 7.5C13.1 5.9 11 5 8.5 5C6 5 3.9 5.9 2.5 7.5L1 5.8C2.8 3.7 5.5 2.5 8.5 2.5Z" fillOpacity="0.3"/>
                    <path d="M8.5 6C10.3 6 12 6.7 13.2 8L11.7 9.7C10.9 8.8 9.7 8.2 8.5 8.2C7.3 8.2 6.1 8.8 5.3 9.7L3.8 8C5 6.7 6.7 6 8.5 6Z"/>
                    <circle cx="8.5" cy="11" r="1.5"/>
                  </svg>
                  {/* Battery */}
                  <div className="flex items-center gap-0.5">
                    <div className="w-[25px] h-[12px] border-[1.5px] border-current rounded-[3px] relative">
                      <div className="absolute inset-[2px] bg-current rounded-[1px]" style={{ width: '75%' }} />
                    </div>
                    <div className="w-[1.5px] h-[5px] bg-current rounded-r-sm" />
                  </div>
                </div>
              </div>
              
              {/* App content - children includes all app components */}
              {children}
            </div>
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}
