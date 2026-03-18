'use client';

import { currentUser } from '@/lib/data';
import { getGreeting, getGreetingEmoji, formatDate, TODAY } from '@/lib/utils';
import { Sparkles, Flame } from 'lucide-react';

export function HeaderSection() {
  const greeting = getGreeting();
  const emoji = getGreetingEmoji();
  const firstName = currentUser.name.split(' ')[0];
  
  return (
    <section className="space-y-3">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-2xl font-bold flex items-center gap-2"
            style={{ color: '#182E7B' }}
          >
            {greeting}, {firstName} {emoji}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5 capitalize">
            {formatDate(TODAY, "EEEE, d 'de' MMMM 'de' yyyy")}
          </p>
        </div>
        {/* Streak badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 rounded-full">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-600">12 días</span>
        </div>
      </div>

      {/* AI Brief Card */}
      <div 
        className="p-4 rounded-xl border-l-4"
        style={{ backgroundColor: '#EEF2FF', borderLeftColor: '#496BE3' }}
      >
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" style={{ color: '#496BE3' }} />
          <p className="text-sm text-gray-700 leading-relaxed">
            Tenés 4 tareas para hoy y tu standup arranca a las 9:00.
            La encuesta de clima cierra hoy — ¡no te olvides de completarla! 💬
          </p>
        </div>
      </div>
    </section>
  );
}
