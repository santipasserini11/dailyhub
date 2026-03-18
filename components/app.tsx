'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { PhoneFrame } from './layout/phone-frame';
import { TopBar } from './layout/top-bar';
import { BottomNav } from './layout/bottom-nav';
import { DailyHub } from './daily-hub';
import { Calendar } from './calendar';
import { FAB } from './fab';
import { BottomSheetManager } from './bottom-sheets';
import { SkeletonCard } from './ui/skeleton';

export function App() {
  const { viewMode } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PhoneFrame>
      {/* Main app wrapper - flex column to fill the phone screen */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        
        {isLoading ? (
          <div className="flex-1 overflow-y-auto bg-[#F5F6FA] p-4 space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            {viewMode === 'inicio' ? <DailyHub /> : <Calendar />}
          </>
        )}
        
        <BottomNav />
      </div>
      
      {/* These are positioned absolute within the phone screen */}
      <FAB />
      <BottomSheetManager />
    </PhoneFrame>
  );
}
