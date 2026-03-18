'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { CalendarNav } from './calendar-nav';
import { FilterChips } from './filter-chips';
import { WeekView } from './week-view';
import { MonthView } from './month-view';

export function Calendar() {
  const { calendarView } = useApp();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayView, setDisplayView] = useState(calendarView);

  // Handle view transitions
  useEffect(() => {
    if (calendarView !== displayView) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayView(calendarView);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [calendarView, displayView]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#F5F6FA]">
      <div className="p-4 space-y-3 bg-white border-b border-gray-100">
        <CalendarNav />
        <FilterChips />
      </div>
      
      <div 
        className="flex-1 overflow-auto p-4 transition-opacity duration-150"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        {displayView === 'semana' && <WeekView />}
        {displayView === 'mes' && <MonthView />}
      </div>
    </div>
  );
}
