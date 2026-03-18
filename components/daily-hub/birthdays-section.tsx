'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { Avatar } from '@/components/ui/avatar';
import { TODAY, isTodayDate, formatDate } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

export function BirthdaysSection() {
  const { events } = useApp();

  const { todayBirthdays, nextBirthday, daysUntilNext } = useMemo(() => {
    const birthdays = events.filter(e => 
      e.category === 'birthday' || e.category === 'anniversary'
    );
    
    const today = birthdays.filter(e => isTodayDate(e.startDate));
    
    // Find next upcoming birthday if none today
    const future = birthdays
      .filter(e => e.startDate > TODAY)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    const next = future[0] || null;
    const daysUntil = next ? differenceInDays(next.startDate, TODAY) : 0;
    
    return {
      todayBirthdays: today,
      nextBirthday: next,
      daysUntilNext: daysUntil,
    };
  }, [events]);

  if (todayBirthdays.length === 0 && !nextBirthday) {
    return null;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Cumpleaños y aniversarios</h2>
      
      {todayBirthdays.length > 0 ? (
        <div className="space-y-2">
          {todayBirthdays.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <Avatar 
                name={event.person?.name || 'Usuario'} 
                initials={event.person?.avatar}
                size="lg" 
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{event.person?.name}</p>
                <p className="text-sm text-gray-500">{event.person?.role}</p>
                <span 
                  className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#FDF2F8', color: '#EC4899' }}
                >
                  {event.category === 'anniversary' 
                    ? `${event.yearsInCompany} años en la empresa`
                    : 'Cumpleaños'
                  }
                </span>
              </div>
              <button
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ backgroundColor: '#EEF2FF', color: '#496BE3' }}
              >
                Felicitar
              </button>
            </div>
          ))}
        </div>
      ) : nextBirthday && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-500">
            <span className="text-gray-400">Próximamente:</span>{' '}
            <span className="font-medium text-gray-600">{nextBirthday.person?.name}</span>{' '}
            <span className="text-gray-400">
              — en {daysUntilNext} {daysUntilNext === 1 ? 'día' : 'días'}
            </span>
          </p>
        </div>
      )}
    </section>
  );
}
