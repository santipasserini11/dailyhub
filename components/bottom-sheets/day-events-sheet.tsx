'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { categoryColors, categoryIcons } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { CalendarEvent } from '@/lib/types';

interface DayEventsSheetProps {
  date: Date;
}

export function DayEventsSheet({ date }: DayEventsSheetProps) {
  const { events, activeFilters, openBottomSheet } = useApp();

  const dayEvents = useMemo(() => {
    return events
      .filter(e => activeFilters.has(e.category))
      .filter(event => {
        const eventDate = new Date(event.startDate);
        const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;
        
        const dayTime = date.getTime();
        const startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
        const endTime = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate()).getTime();
        
        return dayTime >= startTime && dayTime <= endTime;
      })
      .sort((a, b) => {
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        return 0;
      });
  }, [events, activeFilters, date]);

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 capitalize mb-3">
        {formatDate(date, "EEEE d 'de' MMMM")}
      </p>
      
      {dayEvents.map((event) => (
        <button
          key={event.id}
          onClick={() => openBottomSheet({ type: 'event', event })}
          className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
        >
          <div 
            className="w-1 h-10 rounded-full shrink-0"
            style={{ backgroundColor: categoryColors[event.category] }}
          />
          <span className="text-lg">{categoryIcons[event.category]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
            <p className="text-xs text-gray-500">
              {event.isAllDay ? 'Todo el día' : `${event.startTime} – ${event.endTime}`}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
