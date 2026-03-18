'use client';

import { useState } from 'react';
import { currentUser } from '@/lib/data';
import { getGreeting, getGreetingEmoji, formatDate, TODAY } from '@/lib/utils';
import { Sparkles, Flame } from 'lucide-react';

export function HeaderSection() {
  const greeting = getGreeting();
  const emoji = getGreetingEmoji();
  const firstName = currentUser.name.split(' ')[0];
  const [showStreakTooltip, setShowStreakTooltip] = useState(false);
  
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
        {/* Streak badge with tooltip */}
        <div 
          className="relative"
          onMouseEnter={() => setShowStreakTooltip(true)}
          onMouseLeave={() => setShowStreakTooltip(false)}
        >
          <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 rounded-full cursor-help">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">12 días</span>
          </div>
          {showStreakTooltip && (
            <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
              12 días seguidos cumpliendo tus tareas
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 rotate-45" />
            </div>
          )}
        </div>
      </div>

      {/* AI Brief Card - Bullet points */}
      <div 
        className="p-4 rounded-xl border-l-4"
        style={{ backgroundColor: '#EEF2FF', borderLeftColor: '#496BE3' }}
      >
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" style={{ color: '#496BE3' }} />
          <ul className="text-sm text-gray-700 space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Tenés <strong>4 tareas</strong> para hoy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Tu standup arranca a las <strong>9:00</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>La encuesta de clima <strong>cierra hoy</strong> — no te olvides de completarla</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
