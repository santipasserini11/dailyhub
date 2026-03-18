'use client';

import { useApp } from '@/lib/context';
import { CalendarNav } from './calendar-nav';
import { FilterChips } from './filter-chips';
import { DayView } from './day-view';
import { WeekView } from './week-view';
import { MonthView } from './month-view';

export function Calendar() {
  const { calendarView } = useApp();

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#F5F6FA]">
      <div className="p-4 space-y-3 bg-white border-b border-gray-100">
        <CalendarNav />
        <FilterChips />
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {calendarView === 'dia' && <DayView />}
        {calendarView === 'semana' && <WeekView />}
        {calendarView === 'mes' && <MonthView />}
      </div>
    </div>
  );
}
