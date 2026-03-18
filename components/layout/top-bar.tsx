'use client';

import { Bell } from 'lucide-react';

export function TopBar() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <span 
        className="text-xl font-semibold tracking-tight"
        style={{ fontFamily: 'var(--font-comfortaa), Comfortaa, cursive', color: '#182E7B' }}
      >
        humand
      </span>
      <button 
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5 text-gray-600" />
      </button>
    </header>
  );
}
