'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { Avatar } from '@/components/ui/avatar';
import { TODAY, isTodayDate, formatDate } from '@/lib/utils';
import { differenceInDays, addDays } from 'date-fns';

export function BirthdaysSection() {
  const { events } = useApp();

  const { todayBirthdays, upcomingBirthdays, nextBirthday, daysUntilNext } = useMemo(() => {
    const birthdays = events.filter(e => 
      e.category === 'birthday' || e.category === 'anniversary'
    );
    
    const today = birthdays.filter(e => isTodayDate(e.startDate));
    
    // Get birthdays in the next 3 days (not including today)
    const threeDaysFromNow = addDays(TODAY, 3);
    const upcoming = birthdays
      .filter(e => {
        const eventDate = e.startDate;
        return eventDate > TODAY && eventDate <= threeDaysFromNow;
      })
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    // Find next birthday if none today or in next 3 days
    const future = birthdays
      .filter(e => e.startDate > threeDaysFromNow)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    const next = future[0] || null;
    const daysUntil = next ? differenceInDays(next.startDate, TODAY) : 0;
    
    return {
      todayBirthdays: today,
      upcomingBirthdays: upcoming,
      nextBirthday: next,
      daysUntilNext: daysUntil,
    };
  }, [events]);

  const allBirthdays = [...todayBirthdays, ...upcomingBirthdays];

  if (allBirthdays.length === 0 && !nextBirthday) {
    return null;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Cumpleanos y aniversarios</h2>
      
      {allBirthdays.length > 0 ? (
        <div className="space-y-2">
          {allBirthdays.map((event) => {
            const isToday = isTodayDate(event.startDate);
            const daysUntil = differenceInDays(event.startDate, TODAY);
            
            return (
              <div key={event.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <Avatar 
                  name={event.person?.name || 'Usuario'} 
                  initials={event.person?.avatar}
                  size="lg" 
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{event.person?.name}</p>
                  <p className="text-sm text-gray-500">{event.person?.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="inline-block text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#FDF2F8', color: '#EC4899' }}
                    >
                      {event.category === 'anniversary' 
                        ? `${event.yearsInCompany} anos en la empresa`
                        : 'Cumpleanos'
                      }
                    </span>
                    {!isToday && (
                      <span className="text-xs text-gray-400">
                        en {daysUntil} {daysUntil === 1 ? 'dia' : 'dias'}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: '#EEF2FF', color: '#496BE3' }}
                >
                  Felicitar
                </button>
              </div>
            );
          })}
        </div>
      ) : nextBirthday && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-500">
            <span className="text-gray-400">Proximamente:</span>{' '}
            <span className="font-medium text-gray-600">{nextBirthday.person?.name}</span>{' '}
            <span className="text-gray-400">
              el {formatDate(nextBirthday.startDate, "d 'de' MMMM")} (en {daysUntilNext} dias)
            </span>
          </p>
        </div>
      )}
    </section>
  );
}
