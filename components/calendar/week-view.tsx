'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { getShiftForDate, isHoliday, categoryColors, categoryIcons } from '@/lib/data';
import { TODAY, isPastDate, isTodayDate, cn, formatDate } from '@/lib/utils';
import { startOfWeek, addDays, isSameDay } from 'date-fns';


const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00
const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function WeekView() {
  const { selectedDate, events, activeFilters, openBottomSheet } = useApp();
  
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredEvents = useMemo(() => {
    return events.filter(e => activeFilters.has(e.category));
  }, [events, activeFilters]);

  const getEventsForDay = (day: Date, allDay: boolean) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;
      
      const dayTime = day.getTime();
      const startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
      const endTime = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate()).getTime();
      
      const isInRange = dayTime >= startTime && dayTime <= endTime;
      return isInRange && event.isAllDay === allDay;
    });
  };

  if (activeFilters.size === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-500 text-center">
          No hay eventos. Activá los filtros para ver tu agenda.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header row */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-px">
          <div className="p-1" />
          {weekDays.map((day, i) => {
            const isPast = isPastDate(day);
            const isToday = isTodayDate(day);
            return (
              <div 
                key={i}
                className={cn(
                  'p-1 text-center',
                  isPast && !isToday && 'opacity-40'
                )}
              >
                <div className="text-[10px] text-gray-500">{DAY_LABELS[i]}</div>
                <div 
                  className={cn(
                    'text-sm font-medium',
                    isToday && 'w-6 h-6 rounded-full flex items-center justify-center mx-auto text-white'
                  )}
                  style={{ backgroundColor: isToday ? '#496BE3' : undefined }}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Shift strips */}
        <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-px border-t border-gray-50">
          <div className="p-1" />
          {weekDays.map((day, i) => {
            const shift = getShiftForDate(day);
            const holiday = isHoliday(day);
            const isPast = isPastDate(day);
            
            return (
              <button
                key={i}
                onClick={() => openBottomSheet({ type: 'shift', date: day })}
                className={cn(
                  'p-1 text-[9px] text-gray-500 text-center rounded transition-colors',
                  isPast && !isTodayDate(day) && 'opacity-40'
                )}
                style={{ backgroundColor: 'rgba(73, 107, 227, 0.1)' }}
              >
                {shift ? (
                  <span className="flex items-center justify-center gap-0.5">
                    {holiday && '🏛️ '}
                    {shift.startTime.replace(':00', '')}-{shift.endTime.replace(':00', '')}
                  </span>
                ) : (
                  <span>😴</span>
                )}
              </button>
            );
          })}
        </div>

        {/* All-day events */}
        <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-px border-t border-gray-50">
          <div className="p-1 text-[9px] text-gray-400">Todo el día</div>
          {weekDays.map((day, i) => {
            const dayEvents = getEventsForDay(day, true);
            const isPast = isPastDate(day);
            const displayEvents = dayEvents.slice(0, 3);
            const moreCount = dayEvents.length - 3;

            return (
              <div 
                key={i} 
                className={cn(
                  'p-0.5 min-h-[40px]',
                  isPast && !isTodayDate(day) && 'opacity-40 grayscale'
                )}
              >
                {displayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => openBottomSheet({ type: 'event', event })}
                    className="w-full text-[8px] px-1 py-0.5 rounded mb-0.5 text-white truncate text-left"
                    style={{ backgroundColor: categoryColors[event.category] }}
                  >
                    {categoryIcons[event.category]}
                  </button>
                ))}
                {moreCount > 0 && (
                  <button
                    onClick={() => openBottomSheet({ type: 'day-events', date: day })}
                    className="text-[8px] text-accent font-medium"
                    style={{ color: '#496BE3' }}
                  >
                    +{moreCount}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-px">
        {HOURS.map((hour) => (
          <div key={hour} className="contents">
            <div className="p-1 text-[9px] text-gray-400 text-right pr-2">
              {hour}:00
            </div>
            {weekDays.map((day, dayIndex) => {
              const timedEvents = getEventsForDay(day, false).filter(e => {
                if (!e.startTime) return false;
                const eventHour = parseInt(e.startTime.split(':')[0]);
                return eventHour === hour;
              });
              const isPast = isPastDate(day);

              return (
                <div 
                  key={dayIndex}
                  className={cn(
                    'border-t border-gray-50 min-h-[32px] p-0.5',
                    isPast && !isTodayDate(day) && 'opacity-40 grayscale'
                  )}
                >
                  {timedEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => openBottomSheet({ type: 'event', event })}
                      className="w-full text-[8px] px-1 py-0.5 rounded text-white truncate text-left"
                      style={{ backgroundColor: categoryColors[event.category] }}
                    >
                      {event.startTime?.replace(':00', ':00').slice(0, 5)}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
