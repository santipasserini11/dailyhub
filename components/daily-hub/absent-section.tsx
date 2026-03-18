'use client';

import { useApp } from '@/lib/context';
import { absentToday } from '@/lib/data';
import { Avatar } from '@/components/ui/avatar';

export function AbsentSection() {
  const { openBottomSheet } = useApp();
  
  if (absentToday.length === 0) {
    return null;
  }

  const displayedPeople = absentToday.slice(0, 3);
  const remainingCount = absentToday.length - 3;

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Ausentes hoy</h2>
      <div className="flex flex-wrap gap-2">
        {displayedPeople.map((person) => (
          <div
            key={person.id}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm"
          >
            <Avatar name={person.name} initials={person.avatar} size="sm" />
            <span className="text-sm text-gray-700">{person.name.split(' ')[0]}</span>
          </div>
        ))}
        {remainingCount > 0 && (
          <button
            onClick={() => openBottomSheet({ type: 'whos-out' })}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm text-gray-600">+{remainingCount} más</span>
          </button>
        )}
      </div>
    </section>
  );
}
