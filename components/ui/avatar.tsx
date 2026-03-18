'use client';

import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

const colors = [
  'bg-pink-100 text-pink-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
  'bg-indigo-100 text-indigo-700',
  'bg-rose-100 text-rose-700',
];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name, initials, size = 'md', className }: AvatarProps) {
  const displayInitials = initials || name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colorClass = getColorForName(name);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium shrink-0',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {displayInitials}
    </div>
  );
}
