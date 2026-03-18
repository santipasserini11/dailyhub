'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Plus, X, ClipboardList, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const { openBottomSheet } = useApp();

  const handleAction = (action: 'task' | 'event') => {
    setIsOpen(false);
    if (action === 'task') {
      openBottomSheet({ type: 'new-task' });
    }
    // 'event' does nothing as per spec
  };

  return (
    <div className="absolute bottom-20 right-4 z-40">
      {/* Menu items */}
      <div className={cn(
        'absolute bottom-14 right-0 flex flex-col items-end gap-2 transition-all duration-200',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        <button
          onClick={() => handleAction('event')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Calendar className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Nuevo Evento</span>
        </button>
        
        <button
          onClick={() => handleAction('task')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <ClipboardList className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-gray-700">Nueva Tarea</span>
        </button>
      </div>

      {/* FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl',
          isOpen && 'rotate-45'
        )}
        style={{ backgroundColor: '#496BE3' }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
