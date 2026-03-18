'use client';

import { getShiftForDate, pastShiftData, isHoliday } from '@/lib/data';
import { formatDate, isPastDate, isTodayDate, cn } from '@/lib/utils';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ShiftSheetProps {
  date: Date;
}

export function ShiftSheet({ date }: ShiftSheetProps) {
  const shift = getShiftForDate(date);
  const isPast = isPastDate(date) && !isTodayDate(date);
  const holiday = isHoliday(date);
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const pastData = pastShiftData[dateKey];

  // Weekend - rest day
  if (!shift) {
    return (
      <div className="space-y-4 text-center py-6">
        <span className="text-5xl">😴</span>
        <div>
          <p className="text-lg font-medium text-gray-800">Día de descanso</p>
          <p className="text-gray-500 capitalize">
            {formatDate(date, "EEEE d 'de' MMMM")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Date header */}
      <p className="text-sm text-gray-500 capitalize">
        {formatDate(date, "EEEE d 'de' MMMM 'de' yyyy")}
      </p>

      {/* Shift info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Nombre</span>
          <span className="font-medium text-gray-800">{shift.name}</span>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-gray-600">Horario</span>
          <span className="font-medium text-gray-800">{shift.startTime} – {shift.endTime}</span>
        </div>

        {holiday && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <span className="text-lg">🏛️</span>
            <span className="text-sm text-gray-600">Este día es feriado nacional</span>
          </div>
        )}

        {isPast && pastData ? (
          <>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Horas programadas</span>
              <span className="font-medium text-gray-800">{shift.totalHours}hs</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Horas trabajadas</span>
              <span className="font-medium text-gray-800">{pastData.workedHours}hs</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600">Balance</span>
              <span className={cn(
                'font-medium flex items-center gap-1',
                pastData.balance >= 0 ? 'text-green-600' : 'text-orange-600'
              )}>
                {pastData.balance > 0 ? '+' : ''}{pastData.balance}hs
                {pastData.balance >= 0 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600">Total horas a cumplir</span>
            <span className="font-medium text-gray-800">{shift.totalHours}hs</span>
          </div>
        )}
      </div>
    </div>
  );
}
