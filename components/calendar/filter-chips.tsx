'use client';

import { useApp } from '@/lib/context';
import { categoryColors, categoryLabels } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CategoryIcon } from '@/components/ui/category-icon';

const filterCategories = [
  'birthday', 'holiday', 'vacation', 'company-event', 'performance', 
  'survey', 'training', 'onboarding', 'task', 'videocall', 'communication'
];

export function FilterChips() {
  const { activeFilters, toggleFilter } = useApp();

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
      {filterCategories.map((category) => {
        const isActive = activeFilters.has(category) || activeFilters.has('anniversary');
        const color = categoryColors[category];
        const label = category === 'birthday' 
          ? 'Cumpleanos' 
          : categoryLabels[category];

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
            <CategoryIcon category={category} size={12} className={isActive ? 'text-gray-600' : 'text-gray-400'} />
            <span className={isActive ? 'text-gray-700' : 'text-gray-400'}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
