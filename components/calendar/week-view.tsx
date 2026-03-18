'use client';

import { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { useCalendarDensity } from '@/lib/hooks';
import { getShiftForDate, isHoliday, categoryColors, categoryIcons } from '@/lib/data';
import { TODAY, isPastDate, isTodayDate, cn } from '@/lib/utils';
import { startOfWeek, addDays } from 'date-fns';
import { CalendarEvent } from '@/lib/types';

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00
const DAY_LABELS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

export function WeekView() {
  const { selectedDate, events, activeFilters, openBottomSheet } = useApp();
  const { density, eventMinHeight, showFullName, maxAllDayRows, nameMaxChars } = useCalendarDensity(activeFilters.size);
  
  // Current time indicator
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

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

  // Group similar all-day events (vacations, birthdays)
  const groupAllDayEvents = (dayEvents: CalendarEvent[]) => {
    const grouped: { events: CalendarEvent[]; label: string; color: string; icon: string }[] = [];
    const vacations = dayEvents.filter(e => e.category === 'vacation' || e.category === 'medical-leave');
    const birthdays = dayEvents.filter(e => e.category === 'birthday');
    const others = dayEvents.filter(e => 
      e.category !== 'vacation' && e.category !== 'medical-leave' && e.category !== 'birthday'
    );

    if (vacations.length > 1) {
      grouped.push({
        events: vacations,
        label: `Vacaciones +${vacations.length}`,
        color: categoryColors['vacation'],
        icon: categoryIcons['vacation'],
      });
    } else {
      vacations.forEach(e => grouped.push({
        events: [e],
        label: e.person?.name.split(' ')[0] || e.title,
        color: categoryColors[e.category],
        icon: categoryIcons[e.category],
      }));
    }

    if (birthdays.length > 1) {
      grouped.push({
        events: birthdays,
        label: `Cumpleanos +${birthdays.length}`,
        color: categoryColors['birthday'],
        icon: categoryIcons['birthday'],
      });
    } else {
      birthdays.forEach(e => grouped.push({
        events: [e],
        label: e.person?.name.split(' ')[0] || e.title,
        color: categoryColors[e.category],
        icon: categoryIcons[e.category],
      }));
    }

    others.forEach(e => grouped.push({
      events: [e],
      label: e.title.slice(0, nameMaxChars) + (e.title.length > nameMaxChars ? '...' : ''),
      color: categoryColors[e.category],
      icon: categoryIcons[e.category],
    }));

    return grouped;
  };

  // Calculate current time indicator position
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const isCurrentWeek = weekDays.some(d => isTodayDate(d));
  const todayIndex = weekDays.findIndex(d => isTodayDate(d));
  const timeIndicatorTop = currentHour >= 7 && currentHour <= 20 
    ? (currentHour - 7) * 40 + (currentMinute / 60) * 40 
    : -1;

  if (activeFilters.size === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-500 text-center">
          No hay eventos. Activa los filtros para ver tu agenda.
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
                    {holiday && '(F) '}
                    {shift.startTime.replace(':00', '')}-{shift.endTime.replace(':00', '')}
                  </span>
                ) : (
                  <span>Descanso</span>
                )}
              </button>
            );
          })}
        </div>

        {/* All-day events */}
        <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-px border-t border-gray-50">
          <div className="p-1 text-[9px] text-gray-400">Todo el dia</div>
          {weekDays.map((day, i) => {
            const dayEvents = getEventsForDay(day, true);
            const grouped = groupAllDayEvents(dayEvents);
            const isPast = isPastDate(day);
            const displayGroups = grouped.slice(0, maxAllDayRows);
            const moreCount = grouped.length - maxAllDayRows;

            return (
              <div 
                key={i} 
                className={cn(
                  'p-0.5 min-h-[40px]',
                  isPast && !isTodayDate(day) && 'opacity-40 grayscale'
                )}
              >
                {displayGroups.map((group, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (group.events.length === 1) {
                        openBottomSheet({ type: 'event', event: group.events[0] });
                      } else {
                        openBottomSheet({ type: 'day-events', date: day });
                      }
                    }}
                    className="w-full text-[8px] px-1 py-0.5 rounded mb-0.5 text-white truncate text-left flex items-center gap-0.5"
                    style={{ backgroundColor: group.color }}
                  >
                    <span>{group.icon}</span>
                    {showFullName && <span className="truncate">{group.label}</span>}
                  </button>
                ))}
                {moreCount > 0 && (
                  <button
                    onClick={() => openBottomSheet({ type: 'day-events', date: day })}
                    className="text-[8px] font-medium"
                    style={{ color: '#496BE3' }}
                  >
                    +{moreCount} mas
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-px relative">
        {/* Current time indicator */}
        {isCurrentWeek && todayIndex >= 0 && timeIndicatorTop >= 0 && (
          <div 
            className="absolute z-20 flex items-center pointer-events-none"
            style={{ 
              top: timeIndicatorTop,
              left: `calc(40px + ${todayIndex} * ((100% - 40px) / 7))`,
              width: `calc((100% - 40px) / 7)`,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
            <div className="flex-1 h-0.5 bg-red-500" />
          </div>
        )}

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
                    'border-t border-gray-200 p-0.5 relative bg-gray-50',
                    isPast && !isTodayDate(day) && 'opacity-40 grayscale'
                  )}
                  style={{ minHeight: eventMinHeight }}
                >
                  {timedEvents.map((event) => {
                    const displayName = showFullName 
                      ? event.title.slice(0, nameMaxChars) + (event.title.length > nameMaxChars ? '...' : '')
                      : '';
                    return (
                      <button
                        key={event.id}
                        onClick={() => openBottomSheet({ type: 'event', event })}
                        className="w-full text-[8px] px-1 py-1 rounded text-white text-left flex flex-col"
                        style={{ 
                          backgroundColor: categoryColors[event.category],
                          minHeight: eventMinHeight - 8,
                        }}
                      >
                        <span className="font-medium">{event.startTime}</span>
                        {displayName && <span className="truncate">{displayName}</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
