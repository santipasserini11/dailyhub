'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { categoryColors, isHoliday, getHolidayName } from '@/lib/data';
import { isPastDate, isTodayDate, cn } from '@/lib/utils';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  addDays, isSameMonth, isWeekend
} from 'date-fns';

const DAY_LABELS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

// Categories to show in month view (same as all-day row)
const CALENDAR_CATEGORIES = new Set([
  'holiday', 'vacation', 'medical-leave', 
  'performance', 'survey', 'onboarding', 'videocall',
  'birthday', 'anniversary', 'company-event', 'training'
]);

export function MonthView() {
  const { selectedDate, events, activeFilters, openBottomSheet } = useApp();
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const filteredEvents = useMemo(() => {
    return events.filter(e => 
      activeFilters.has(e.category) && CALENDAR_CATEGORIES.has(e.category)
    );
  }, [events, activeFilters]);

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    let current = calendarStart;
    
    while (current <= calendarEnd) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(current);
        current = addDays(current, 1);
      }
      result.push(week);
    }
    return result;
  }, [calendarStart, calendarEnd]);

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;
      
      const dayTime = day.getTime();
      const startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
      const endTime = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate()).getTime();
      
      return dayTime >= startTime && dayTime <= endTime;
    });
  };

  const handleDayClick = (day: Date) => {
    openBottomSheet({ type: 'day-events', date: day });
  };

  // Get cell background color - more distinct colors
  const getCellBg = (day: Date, isPast: boolean) => {
    const holiday = isHoliday(day);
    if (holiday) return isPast ? '#FEF9C3' : '#FDE047'; // Yellow - brighter for holidays, muted for past
    if (isWeekend(day)) return isPast ? '#E0E7FF' : '#C7D2FE'; // Indigo/blue for weekends
    return isPast ? '#F3F4F6' : '#FFFFFF'; // White for workdays, gray for past
  };

  const hasEvents = weeks.some(week => 
    week.some(day => isSameMonth(day, selectedDate) && getEventsForDay(day).length > 0)
  );

  if (activeFilters.size === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-500 text-center">
          No hay eventos. Activa los filtros para ver tu agenda.
        </p>
      </div>
    );
  }

  if (!hasEvents && selectedDate.getMonth() >= 4) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden shadow-sm">
          {DAY_LABELS.map((label) => (
            <div key={label} className="p-2 text-center text-xs text-gray-500 font-medium bg-gray-100">
              {label}
            </div>
          ))}
          
          {weeks.flat().map((day, i) => {
            const prevDay = i > 0 ? weeks.flat()[i - 1] : null;
            const isMonthBoundary = prevDay && !isSameMonth(day, prevDay);
            const isInSameRowAsBoundary = isMonthBoundary && (i % 7 !== 0);
            
            return (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                className={cn(
                  'p-2 min-h-[48px] text-center transition-colors hover:bg-gray-100',
                  isInSameRowAsBoundary && 'border-l-2 border-gray-300'
                )}
                style={{ backgroundColor: getCellBg(day, isPastDate(day)) }}
              >
                <span className="text-sm text-gray-600">{day.getDate()}</span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 text-center py-8 bg-white rounded-xl shadow-sm">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-gray-700 font-medium">Mes libre</p>
          <p className="text-sm text-gray-500 mt-1">No hay eventos programados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden shadow-sm">
        {DAY_LABELS.map((label) => (
          <div key={label} className="p-2 text-center text-xs text-gray-500 font-medium bg-gray-100">
            {label}
          </div>
        ))}
        
        {weeks.flat().map((day, i) => {
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isPast = isPastDate(day);
          const isToday = isTodayDate(day);
          const dayEvents = getEventsForDay(day);
          const holiday = isHoliday(day);
          const holidayName = getHolidayName(day);
          const uniqueCategories = [...new Set(dayEvents.map(e => e.category))];
          const displayDots = uniqueCategories.slice(0, 3);
          const moreCount = uniqueCategories.length - 3;
          
          // Check if this day is the first of a different month (needs left border)
          const prevDay = i > 0 ? weeks.flat()[i - 1] : null;
          const isMonthBoundary = prevDay && !isSameMonth(day, prevDay);
          const isInSameRowAsBoundary = isMonthBoundary && (i % 7 !== 0);

          return (
            <button
              key={i}
              onClick={() => handleDayClick(day)}
              className={cn(
                'p-1 min-h-[48px] flex flex-col items-center transition-colors hover:opacity-80 relative',
                isInSameRowAsBoundary && 'border-l-2 border-gray-300'
              )}
              style={{ backgroundColor: getCellBg(day, isPast && !isToday) }}
              title={holidayName || undefined}
            >
              <div className="flex items-center gap-0.5">
                {holiday && <span className="text-[10px]">🏛️</span>}
                <span 
                  className={cn(
                    'text-sm w-6 h-6 flex items-center justify-center rounded-full font-medium',
                    isToday && 'text-white',
                    isPast && !isToday && 'text-gray-400',
                    !isPast && !isToday && 'text-gray-800'
                  )}
                  style={{ backgroundColor: isToday ? '#496BE3' : undefined }}
                >
                  {day.getDate()}
                </span>
              </div>
              {dayEvents.length > 0 && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  {displayDots.map((cat, j) => (
                    <span 
                      key={j}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: categoryColors[cat] }}
                    />
                  ))}
                  {moreCount > 0 && (
                    <span className="text-[8px] text-gray-500">+{moreCount}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
