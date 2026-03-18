'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { categoryColors, categoryIcons, getShiftForDate, isHoliday, events as allEventsData } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { Clock, Sun, Calendar } from 'lucide-react';

interface DayEventsSheetProps {
  date: Date;
}

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

      {/* Events list */}
      {dayEvents.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Eventos del dia</h3>
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
                  {event.isAllDay ? 'Todo el dia' : `${event.startTime} - ${event.endTime}`}
                </p>
              </div>
            </button>
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
