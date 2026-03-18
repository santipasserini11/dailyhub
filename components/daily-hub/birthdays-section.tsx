'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { Avatar } from '@/components/ui/avatar';
import { isTodayDate } from '@/lib/utils';
import { Cake, Gift } from 'lucide-react';

export function BirthdaysSection() {
  const { events } = useApp();

  // Only get birthdays and anniversaries for TODAY
  const todayCelebrations = useMemo(() => {
    return events.filter(e => 
      (e.category === 'birthday' || e.category === 'anniversary') &&
      isTodayDate(e.startDate)
    );
  }, [events]);

  if (todayCelebrations.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Cumpleanos y aniversarios</h2>
      
      <div className="space-y-2">
        {todayCelebrations.map((event) => {
          const isBirthday = event.category === 'birthday';
          
          return (
            <div key={event.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <Avatar 
                name={event.person?.name || 'Usuario'} 
                initials={event.person?.avatar}
                size="lg" 
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{event.person?.name}</p>
                <span 
                  className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: isBirthday ? '#FDF2F8' : '#FEF3C7',
                    color: isBirthday ? '#EC4899' : '#D97706'
                  }}
                >
                  {isBirthday 
                    ? <><Cake className="w-3 h-3" /> Cumpleanos</>
                    : <><Gift className="w-3 h-3" /> {event.yearsInCompany} anos en la empresa</>
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
          );
        })}
      </div>
    </section>
  );
}
