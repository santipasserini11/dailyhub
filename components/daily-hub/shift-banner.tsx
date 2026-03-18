'use client';

import { useApp } from '@/lib/context';
import { getShiftForDate } from '@/lib/data';
import { TODAY } from '@/lib/utils';
import { Clock } from 'lucide-react';

export function ShiftBanner() {
  const { openBottomSheet } = useApp();
  const shift = getShiftForDate(TODAY);

  if (!shift) {
    return (
      <button
        onClick={() => openBottomSheet({ type: 'shift', date: TODAY })}
        className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-blue-100"
        style={{ backgroundColor: '#EEF2FF' }}
      >
        <span className="text-lg">😴</span>
        <div className="flex-1 text-left">
          <p className="text-sm text-gray-600">Hoy es tu día de descanso</p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => openBottomSheet({ type: 'shift', date: TODAY })}
      className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-blue-100"
      style={{ backgroundColor: '#EEF2FF' }}
    >
      <Clock className="w-5 h-5 text-accent" style={{ color: '#496BE3' }} />
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">{shift.name}</span>
          <span className="text-gray-400">·</span>
          <span>{shift.startTime} – {shift.endTime}</span>
          <span className="text-gray-400">·</span>
          <span>{shift.totalHours}hs</span>
        </div>
      </div>
    </button>
  );
}
