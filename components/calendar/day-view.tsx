'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { categoryColors, categoryIcons, isHoliday } from '@/lib/data';
import { isPastDate, isTodayDate, cn, formatDate } from '@/lib/utils';
import { CalendarEvent } from '@/lib/types';

export function DayView() {
  const { selectedDate, events, activeFilters, openBottomSheet } = useApp();
  
  const isPast = isPastDate(selectedDate) && !isTodayDate(selectedDate);
  const holiday = isHoliday(selectedDate);

  const filteredEvents = useMemo(() => {
    return events.filter(e => activeFilters.has(e.category));
  }, [events, activeFilters]);

  const dayEvents = useMemo(() => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;
      
      const dayTime = selectedDate.getTime();
      const startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
      const endTime = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate()).getTime();
      
      return dayTime >= startTime && dayTime <= endTime;
    }).sort((a, b) => {
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
  }, [filteredEvents, selectedDate]);

  if (activeFilters.size === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-500 text-center">
          No hay eventos. Activá los filtros para ver tu agenda.
        </p>
      </div>
    );
  }

  if (holiday && dayEvents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <span className="text-4xl">🏛️</span>
          <p className="text-gray-700 font-medium mt-2">Hoy es feriado nacional</p>
          <p className="text-gray-500 mt-1">¡Descansá! 🎉</p>
        </div>
      </div>
    );
  }

  if (dayEvents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-500 text-center">
          No hay eventos para este día.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex-1 overflow-auto', isPast && 'opacity-50')}>
      <div className="p-4 space-y-2">
        {dayEvents.map((event) => (
          <EventCard key={event.id} event={event} onClick={() => openBottomSheet({ type: 'event', event })} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const color = categoryColors[event.category];
  const icon = categoryIcons[event.category];

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-4 shadow-sm flex items-start gap-3 text-left hover:shadow-md transition-shadow"
    >
      <div 
        className="w-1 h-full min-h-[40px] rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span 
            className="text-xs px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {event.category === 'birthday' ? 'Cumpleaños' : 
             event.category === 'anniversary' ? 'Aniversario' :
             event.category === 'videocall' ? 'Videollamada' :
             event.category === 'company-event' ? 'Evento' :
             event.category === 'survey' ? 'Encuesta' :
             event.category === 'communication' ? 'Comunicación' :
             event.category === 'onboarding' ? 'Onboarding' :
             event.category === 'holiday' ? 'Feriado' :
             event.category === 'vacation' ? 'Vacaciones' :
             event.category}
          </span>
        </div>
        <p className="font-medium text-gray-800 mt-1">{event.title}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {event.isAllDay ? 'Todo el día' : `${event.startTime} – ${event.endTime}`}
        </p>
        {event.organizer && (
          <p className="text-xs text-gray-400 mt-1">
            Organizado por {event.organizer.name}
          </p>
        )}
      </div>
    </button>
  );
}
