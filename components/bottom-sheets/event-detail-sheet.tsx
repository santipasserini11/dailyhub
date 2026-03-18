'use client';

import { CalendarEvent } from '@/lib/types';
import { categoryColors, categoryLabels } from '@/lib/data';
import { formatDate, formatDateRange } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Video, ExternalLink, CheckSquare, Building2 } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/category-icon';

interface EventDetailSheetProps {
  event: CalendarEvent;
}

export function EventDetailSheet({ event }: EventDetailSheetProps) {
  const color = categoryColors[event.category];
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
            Ir a la evaluacion
          </button>
        );
      case 'onboarding':
        return (
          <button
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#22C55E' }}
          >
            <CheckSquare className="w-5 h-5" />
            Ir a la tarea en onboarding
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
            <Building2 className="w-8 h-8 text-gray-500 mx-auto" />
            <p className="text-gray-600 mt-2">Feriado nacional — Descansa!</p>
          </div>
        );
      case 'training':
        return (
          <button
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#6366F1' }}
          >
            <ExternalLink className="w-5 h-5" />
            Ver capacitacion
          </button>
        );
      case 'communication':
        return (
          <button
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: '#496BE3' }}
          >
            <ExternalLink className="w-5 h-5" />
            Ver mas
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
          className="text-sm px-3 py-1 rounded-full text-white flex items-center gap-1.5"
          style={{ backgroundColor: color }}
        >
          <CategoryIcon category={event.category} size={14} className="text-white" />
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
          <p className="text-sm text-gray-500">Todo el dia</p>
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
