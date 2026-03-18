'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/context';
import { categoryColors } from '@/lib/data';
import { TODAY } from '@/lib/utils';
import { ChevronRight, Video } from 'lucide-react';
import { CalendarEvent } from '@/lib/types';
import { CategoryIcon } from '@/components/ui/category-icon';

// Categories to include in "Proximos eventos" section
const INCLUDED_CATEGORIES = new Set([
  'videocall',
  'onboarding',
  'performance',
  'survey',
  'company-event',
  'training',
]);

export function EventsSection() {
  const { events, openBottomSheet } = useApp();
  const [showAll, setShowAll] = useState(false);

  const todayEvents = useMemo(() => {
    return events.filter(event => {
      // Only include specific categories
      if (!INCLUDED_CATEGORIES.has(event.category)) {
        return false;
      }
      
      const eventDate = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;
      
      // Check if TODAY falls within the event range
      const todayTime = TODAY.getTime();
      const startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
      const endTime = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate()).getTime();
      
      return todayTime >= startTime && todayTime <= endTime;
    }).sort((a, b) => {
      // Timed events first (by time), then all-day events
      if (!a.isAllDay && b.isAllDay) return -1;
      if (a.isAllDay && !b.isAllDay) return 1;
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
  }, [events]);

  const displayedEvents = showAll ? todayEvents : todayEvents.slice(0, 6);
  const hasMore = todayEvents.length > 6;

  if (todayEvents.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Proximos eventos</h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="text-gray-500">Tu agenda esta libre por ahora</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Proximos eventos</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        {displayedEvents.map((event) => (
          <EventRow 
            key={event.id} 
            event={event} 
            onClick={() => openBottomSheet({ type: 'event', event })} 
            onJoin={() => openBottomSheet({ type: 'videocall', event })}
          />
        ))}
      </div>
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center gap-1 text-sm font-medium mt-2 hover:underline"
          style={{ color: '#496BE3' }}
        >
          Ver todos ({todayEvents.length - 6} mas)
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </section>
  );
}

function EventRow({ event, onClick, onJoin }: { event: CalendarEvent; onClick: () => void; onJoin: () => void }) {
  const color = categoryColors[event.category] || '#6B7280';
  const isVideocall = event.category === 'videocall';
  
  return (
    <div className="flex items-center gap-3 p-3">
      <button
        onClick={onClick}
        className="flex-1 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left rounded-lg -m-1 p-1"
      >
        <div 
          className="w-1 h-10 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <CategoryIcon category={event.category} size={20} className="text-gray-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
          <p className="text-xs text-gray-500">
            {event.isAllDay ? 'Todo el dia' : `${event.startTime} - ${event.endTime}`}
          </p>
        </div>
      </button>
      
      {isVideocall && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onJoin();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg shrink-0 transition-colors hover:opacity-90"
          style={{ backgroundColor: '#3B82F6', color: 'white' }}
        >
          <Video className="w-4 h-4" />
          Unirse
        </button>
      )}
    </div>
  );
}
