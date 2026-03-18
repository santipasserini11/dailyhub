'use client';

import { CalendarEvent } from '@/lib/types';
import { categoryColors, categoryIcons, categoryLabels } from '@/lib/data';
import { formatDate, formatDateRange } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Video, ExternalLink } from 'lucide-react';

interface EventDetailSheetProps {
  event: CalendarEvent;
}

export function EventDetailSheet({ event }: EventDetailSheetProps) {
  const color = categoryColors[event.category];
  const icon = categoryIcons[event.category];
  const label = categoryLabels[event.category];

  const getActionButton = () => {
    switch (event.category) {
      case 'videocall':
        return (
          <button
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#496BE3' }}
          >
            <Video className="w-5 h-5" />
            Unirse a la llamada
          </button>
        );
      case 'survey':
        return (
          <button
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#496BE3' }}
          >
            <ExternalLink className="w-5 h-5" />
            Ir a la encuesta
          </button>
        );
      case 'performance':
        return (
          <button
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#496BE3' }}
          >
            <ExternalLink className="w-5 h-5" />
            Ir a la evaluación
          </button>
        );
      case 'birthday':
      case 'anniversary':
        return (
          <button
            className="w-full py-3 rounded-xl text-white font-medium"
            style={{ backgroundColor: '#EC4899' }}
          >
            Felicitar
          </button>
        );
      case 'holiday':
        return (
          <div className="text-center py-4">
            <span className="text-2xl">🏛️</span>
            <p className="text-gray-600 mt-2">Feriado nacional — ¡Descansá!</p>
          </div>
        );
      case 'communication':
        return (
          <button
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#496BE3' }}
          >
            <ExternalLink className="w-5 h-5" />
            Ver más
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Category badge */}
      <div className="flex items-center gap-2">
        <span 
          className="text-sm px-3 py-1 rounded-full text-white flex items-center gap-1"
          style={{ backgroundColor: color }}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>

      {/* Date/time */}
      <div className="text-gray-600">
        {event.endDate ? (
          <p>{formatDateRange(event.startDate, event.endDate)}</p>
        ) : (
          <p className="capitalize">{formatDate(event.startDate, "EEEE d 'de' MMMM 'de' yyyy")}</p>
        )}
        {!event.isAllDay && event.startTime && (
          <p className="text-sm text-gray-500">{event.startTime} – {event.endTime}</p>
        )}
        {event.isAllDay && (
          <p className="text-sm text-gray-500">Todo el día</p>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-gray-600 leading-relaxed">{event.description}</p>
      )}

      {/* Person (for birthdays/anniversaries) */}
      {event.person && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Avatar name={event.person.name} initials={event.person.avatar} size="lg" />
          <div>
            <p className="font-medium text-gray-800">{event.person.name}</p>
            <p className="text-sm text-gray-500">{event.person.role}</p>
          </div>
        </div>
      )}

      {/* Organizer */}
      {event.organizer && !event.person && (
        <div className="flex items-center gap-3">
          <Avatar name={event.organizer.name} initials={event.organizer.avatar} size="md" />
          <div>
            <p className="text-sm text-gray-500">Organizado por</p>
            <p className="font-medium text-gray-800">{event.organizer.name}</p>
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="pt-2">
        {getActionButton()}
      </div>
    </div>
  );
}
