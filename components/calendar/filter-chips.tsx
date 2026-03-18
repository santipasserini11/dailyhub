'use client';

import { useApp } from '@/lib/context';
import { categoryColors, categoryLabels, categoryIcons } from '@/lib/data';
import { cn } from '@/lib/utils';

const filterCategories = [
  'birthday', 'holiday', 'vacation', 'company-event', 'performance', 
  'survey', 'training', 'onboarding', 'task', 'videocall', 'communication', 'reminder'
];

export function FilterChips() {
  const { activeFilters, toggleFilter } = useApp();

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
      {filterCategories.map((category) => {
        const isActive = activeFilters.has(category) || activeFilters.has('anniversary');
        const color = categoryColors[category];
        const label = category === 'birthday' 
          ? 'Cumpleaños' 
          : categoryLabels[category];
        const icon = categoryIcons[category];

        return (
          <button
            key={category}
            onClick={() => {
              toggleFilter(category);
              if (category === 'birthday') {
                toggleFilter('anniversary');
              }
              if (category === 'vacation') {
                toggleFilter('medical-leave');
              }
            }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0',
              isActive 
                ? 'bg-white shadow-sm' 
                : 'bg-gray-200 text-gray-400'
            )}
          >
            <span 
              className={cn(
                'w-2 h-2 rounded-full',
                !isActive && 'opacity-40'
              )}
              style={{ backgroundColor: color }}
            />
            <span className={isActive ? 'text-gray-700' : 'text-gray-400'}>
              {icon} {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
