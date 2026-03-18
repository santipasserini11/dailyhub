'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/context';
import { categoryColors, categoryIcons } from '@/lib/data';
import { TODAY, isTodayDate, cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { CalendarEvent } from '@/lib/types';

export function EventsSection() {
  const { events, openBottomSheet } = useApp();
  const [showAll, setShowAll] = useState(false);

  const todayEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;
      
      // Check if TODAY falls within the event range
      const todayTime = TODAY.getTime();
      const startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
      const endTime = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate()).getTime();
      
      return todayTime >= startTime && todayTime <= endTime;
    }).sort((a, b) => {
      // All-day events first, then by time
      if (a.isAllDay && !b.isAllDay) return 1;
      if (!a.isAllDay && b.isAllDay) return -1;
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
  }, [events]);

  const displayedEvents = showAll ? todayEvents : todayEvents.slice(0, 5);
  const hasMore = todayEvents.length > 5;

  if (todayEvents.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Próximos eventos</h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="text-gray-500">Tu agenda está libre por ahora ✨</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Próximos eventos</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        {displayedEvents.map((event) => (
          <EventRow key={event.id} event={event} onClick={() => openBottomSheet({ type: 'event', event })} />
        ))}
      </div>
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center gap-1 text-sm font-medium mt-2 hover:underline"
          style={{ color: '#496BE3' }}
        >
          Ver todos
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </section>
  );
}

function EventRow({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const color = categoryColors[event.category] || '#6B7280';
  const icon = categoryIcons[event.category] || '📅';
  
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
    >
      <div 
        className="w-1 h-10 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
        <p className="text-xs text-gray-500">
          {event.isAllDay ? 'Todo el día' : `${event.startTime} – ${event.endTime}`}
        </p>
      </div>
    </button>
  );
}
