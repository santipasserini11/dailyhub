import { format, isToday, isBefore, isSameDay, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const TODAY = new Date(2026, 2, 19); // March 19, 2026

export function formatDate(date: Date, formatStr: string): string {
  return format(date, formatStr, { locale: es });
}

export function isPastDate(date: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(TODAY));
}

export function isTodayDate(date: Date): boolean {
  return isSameDay(date, TODAY);
}

export function isOverdue(date: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(TODAY));
}

export function isDueToday(date: Date): boolean {
  return isSameDay(date, TODAY);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function formatDateRange(start: Date, end?: Date): string {
  if (!end || isSameDay(start, end)) {
    return formatDate(start, "d 'de' MMMM");
  }
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${formatDate(end, "d 'de' MMMM")}`;
  }
  return `${formatDate(start, "d 'de' MMM")} – ${formatDate(end, "d 'de' MMM")}`;
}

export function getLeaveTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'vacation': 'Vacaciones',
    'medical-leave': 'Licencia médica',
    'personal': 'Licencia personal',
  };
  return labels[type] || type;
}
