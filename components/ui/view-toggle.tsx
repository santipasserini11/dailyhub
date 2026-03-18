'use client';

import { useApp } from '@/lib/context';
import { cn } from '@/lib/utils';
import { Home, Calendar } from 'lucide-react';

export function ViewToggle() {
  const { viewMode, setViewMode } = useApp();

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-full">
      <button
        onClick={() => setViewMode('inicio')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
          viewMode === 'inicio' 
            ? 'bg-white text-primary shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        )}
        style={{ color: viewMode === 'inicio' ? '#182E7B' : undefined }}
      >
        <Home className="w-4 h-4" />
        <span>DailyHub</span>
      </button>
      <button
        onClick={() => setViewMode('calendario')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
          viewMode === 'calendario' 
            ? 'bg-white text-primary shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        )}
        style={{ color: viewMode === 'calendario' ? '#182E7B' : undefined }}
      >
        <Calendar className="w-4 h-4" />
        <span>Calendario</span>
      </button>
    </div>
  );
}
