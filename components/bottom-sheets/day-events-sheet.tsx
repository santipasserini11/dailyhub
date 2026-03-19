'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { categoryColors, getShiftForDate, isHoliday, events as allEventsData } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { Clock, Sun, Calendar, Cake, Gift, Video } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/category-icon';
import { Avatar } from '@/components/ui/avatar';
import { CalendarEvent } from '@/lib/types';

interface DayEventsSheetProps {
  date: Date;
}

// Category groups in order of priority (same as DailyHub)
const CATEGORY_GROUPS = [
  {
    key: 'celebrations',
    label: 'Cumpleanos y aniversarios',
    categories: ['birthday', 'anniversary'],
  },
  {
    key: 'meetings',
    label: 'Reuniones y llamadas',
    categories: ['videocall'],
  },
  {
    key: 'events',
    label: 'Eventos',
    categories: ['company-event', 'training', 'performance', 'survey'],
  },
  {
    key: 'tasks',
    label: 'Tareas',
    categories: ['task'],
  },
  {
    key: 'onboarding',
    label: 'Onboarding',
    categories: ['onboarding'],
  },
  {
    key: 'communications',
    label: 'Comunicaciones',
    categories: ['communication'],
  },
  {
    key: 'absences',
    label: 'Ausencias',
    categories: ['vacation', 'medical-leave'],
  },
];

export function DayEventsSheet({ date }: DayEventsSheetProps) {
  const { events, activeFilters, openBottomSheet } = useApp();

  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const holiday = isHoliday(date);
  const shift = getShiftForDate(date);

  // Get holiday name if applicable
  const holidayEvent = useMemo(() => {
    return allEventsData.find(e => 
      e.category === 'holiday' &&
      e.startDate.getFullYear() === date.getFullYear() &&
      e.startDate.getMonth() === date.getMonth() &&
      e.startDate.getDate() === date.getDate()
    );
  }, [date]);

  // Get all events for this day
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
      });
  }, [events, activeFilters, date]);

  // Group events by category
  const groupedEvents = useMemo(() => {
    const groups: { key: string; label: string; events: CalendarEvent[] }[] = [];
    
    CATEGORY_GROUPS.forEach(group => {
      const groupEvents = dayEvents
        .filter(e => group.categories.includes(e.category))
        .sort((a, b) => {
          // Sort by time if available, then alphabetically
          if (a.startTime && b.startTime) {
            return a.startTime.localeCompare(b.startTime);
          }
          if (a.startTime && !b.startTime) return -1;
          if (!a.startTime && b.startTime) return 1;
          return a.title.localeCompare(b.title);
        });
      
      if (groupEvents.length > 0) {
        groups.push({
          key: group.key,
          label: group.label,
          events: groupEvents,
        });
      }
    });
    
    return groups;
  }, [dayEvents]);

  const hasEvents = groupedEvents.length > 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 capitalize">
        {formatDate(date, "EEEE d 'de' MMMM")}
      </p>

      {/* Shift or Rest day info */}
      {isWeekend ? (
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
          <Sun className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-700">Descanso</p>
            <p className="text-sm text-gray-500">Fin de semana</p>
          </div>
        </div>
      ) : holiday ? (
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-700">Feriado nacional</p>
            <p className="text-sm text-gray-500">{holidayEvent?.description || holidayEvent?.title || 'Feriado'}</p>
          </div>
        </div>
      ) : shift && (
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{shift.name}</p>
              <p className="text-sm text-gray-600">
                {shift.startTime} - {shift.endTime}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">{shift.totalHours}hs</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
      )}

      {/* Grouped events */}
      {hasEvents ? (
        <div className="space-y-4">
          {groupedEvents.map((group) => (
            <section key={group.key}>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{group.label}</h3>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-50">
                {group.events.map((event) => (
                  <EventRow 
                    key={event.id} 
                    event={event}
                    groupKey={group.key}
                    onEventClick={() => openBottomSheet({ type: 'event', event })}
                    onJoinClick={() => openBottomSheet({ type: 'videocall', event })}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : !isWeekend && !holiday && (
        <div className="text-center py-6">
          <p className="text-gray-500">Dia libre</p>
          <p className="text-sm text-gray-400">No hay eventos programados</p>
        </div>
      )}
    </div>
  );
}

interface EventRowProps {
  event: CalendarEvent;
  groupKey: string;
  onEventClick: () => void;
  onJoinClick: () => void;
}

function EventRow({ event, groupKey, onEventClick, onJoinClick }: EventRowProps) {
  const color = categoryColors[event.category] || '#6B7280';
  const isVideocall = event.category === 'videocall';
  const isCelebration = groupKey === 'celebrations';
  const isBirthday = event.category === 'birthday';

  // Special rendering for celebrations (birthdays/anniversaries)
  if (isCelebration && event.person) {
    return (
      <div className="flex items-center gap-3 p-3">
        <Avatar 
          name={event.person.name} 
          initials={event.person.avatar}
          size="md" 
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{event.person.name}</p>
          <span 
            className="inline-flex items-center gap-1 mt-0.5 text-xs px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: isBirthday ? '#FDF2F8' : '#FEF3C7',
              color: isBirthday ? '#EC4899' : '#D97706'
            }}
          >
            {isBirthday 
              ? <><Cake className="w-3 h-3" /> Cumpleanos</>
              : <><Gift className="w-3 h-3" /> {event.yearsInCompany} anos</>
            }
          </span>
        </div>
        <button
          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
          style={{ backgroundColor: '#EEF2FF', color: '#496BE3' }}
        >
          Felicitar
        </button>
      </div>
    );
  }

  // Standard event rendering
  return (
    <div className="flex items-center gap-3 p-3">
      <button
        onClick={onEventClick}
        className="flex-1 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left rounded-lg -m-1 p-1"
      >
        <div 
          className="w-1 h-10 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <CategoryIcon category={event.category} size={20} style={{ color }} />
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
            onJoinClick();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shrink-0 transition-colors hover:opacity-90"
          style={{ backgroundColor: '#3B82F6', color: 'white' }}
        >
          <Video className="w-3 h-3" />
          Unirse
        </button>
      )}
    </div>
  );
}
