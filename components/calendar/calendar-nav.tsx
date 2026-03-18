'use client';

import { useApp } from '@/lib/context';
import { ViewToggle } from '@/components/ui/view-toggle';
import { TODAY, formatDate, cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  startOfWeek, endOfWeek, addWeeks, subWeeks,
  startOfMonth, endOfMonth, addMonths, subMonths,
  addDays, subDays, isSameMonth
} from 'date-fns';
import { CalendarViewMode } from '@/lib/types';

export function CalendarNav() {
  const { calendarView, setCalendarView, selectedDate, setSelectedDate } = useApp();

  const goToToday = () => setSelectedDate(TODAY);

  const goPrev = () => {
    switch (calendarView) {
      case 'dia':
        setSelectedDate(subDays(selectedDate, 1));
        break;
      case 'semana':
        setSelectedDate(subWeeks(selectedDate, 1));
        break;
      case 'mes':
        setSelectedDate(subMonths(selectedDate, 1));
        break;
    }
  };

  const goNext = () => {
    switch (calendarView) {
      case 'dia':
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case 'semana':
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
      case 'mes':
        setSelectedDate(addMonths(selectedDate, 1));
        break;
    }
  };

  const getDateRangeLabel = () => {
    switch (calendarView) {
      case 'dia':
        return formatDate(selectedDate, "EEEE d 'de' MMMM");
      case 'semana': {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        if (isSameMonth(start, end)) {
          return `${start.getDate()} – ${formatDate(end, "d 'de' MMMM")}`;
        }
        return `${formatDate(start, "d MMM")} – ${formatDate(end, "d MMM")}`;
      }
      case 'mes':
        return formatDate(selectedDate, "MMMM yyyy");
    }
  };

  return (
    <div className="space-y-3">
      {/* View toggle */}
      <div className="flex justify-center">
        <ViewToggle />
      </div>

      {/* Calendar view mode toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-full">
          {(['dia', 'semana', 'mes'] as CalendarViewMode[]).map((view) => (
            <button
              key={view}
              onClick={() => setCalendarView(view)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-all capitalize',
                calendarView === view
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Date navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goNext}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: '#496BE3' }}
          >
            Hoy
          </button>
        </div>
        <span className="text-sm font-medium text-gray-700 capitalize">
          {getDateRangeLabel()}
        </span>
      </div>
    </div>
  );
}
