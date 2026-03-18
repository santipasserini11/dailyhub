import { useMemo } from 'react';

export type CalendarDensity = 'compact' | 'normal' | 'expanded';

export function useCalendarDensity(activeFiltersCount: number): {
  density: CalendarDensity;
  eventMinHeight: number;
  showFullName: boolean;
  maxAllDayRows: number;
  nameMaxChars: number;
} {
  return useMemo(() => {
    if (activeFiltersCount <= 1) {
      // Ultra-expanded: single filter
      return {
        density: 'expanded' as CalendarDensity,
        eventMinHeight: 48,
        showFullName: true,
        maxAllDayRows: 10,
        nameMaxChars: 100,
      };
    } else if (activeFiltersCount <= 3) {
      // Normal: few filters
      return {
        density: 'normal' as CalendarDensity,
        eventMinHeight: 40,
        showFullName: true,
        maxAllDayRows: 5,
        nameMaxChars: 40,
      };
    } else {
      // Compact: many filters
      return {
        density: 'compact' as CalendarDensity,
        eventMinHeight: 36,
        showFullName: false,
        maxAllDayRows: 2,
        nameMaxChars: 20,
      };
    }
  }, [activeFiltersCount]);
}
