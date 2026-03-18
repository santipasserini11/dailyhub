'use client';

import { useState, useRef } from 'react';
import { ViewToggle } from '@/components/ui/view-toggle';
import { HeaderSection } from './header-section';
import { ShiftBanner } from './shift-banner';
import { EventsSection } from './events-section';
import { TasksSection } from './tasks-section';
import { BirthdaysSection } from './birthdays-section';
import { AbsentSection } from './absent-section';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

export function DailyHub() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      setPullDistance(Math.min(diff * 0.5, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      setIsRefreshing(true);
      // Simulate refresh
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 800);
    } else {
      setPullDistance(0);
    }
    isPullingRef.current = false;
  };

  if (isRefreshing) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#F5F6FA]">
        <div className="p-4 space-y-6">
          <div className="flex justify-center">
            <ViewToggle />
          </div>
          
          {/* Skeleton loaders */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          
          <Skeleton className="h-16 w-full rounded-xl" />
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-[#F5F6FA] relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="absolute left-0 right-0 flex justify-center items-center transition-transform"
          style={{ 
            height: pullDistance,
            transform: `translateY(${pullDistance > 60 ? -10 : 0}px)`,
          }}
        >
          <RefreshCw 
            className={`w-5 h-5 text-gray-400 transition-transform ${pullDistance > 60 ? 'animate-spin' : ''}`}
            style={{ transform: `rotate(${pullDistance * 3}deg)` }}
          />
        </div>
      )}
      
      <div 
        className="p-4 space-y-6 transition-transform"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {/* View toggle */}
        <div className="flex justify-center">
          <ViewToggle />
        </div>

        {/* Header with greeting and AI brief */}
        <HeaderSection />

        {/* Shift banner */}
        <ShiftBanner />

        {/* Events today */}
        <EventsSection />

        {/* Tasks */}
        <TasksSection />

        {/* Birthdays & anniversaries */}
        <BirthdaysSection />

        {/* Absent people */}
        <AbsentSection />

        {/* Bottom padding for FAB */}
        <div className="h-16" />
      </div>
    </div>
  );
}
