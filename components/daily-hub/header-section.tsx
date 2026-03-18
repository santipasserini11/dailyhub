'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/context';
import { currentUser } from '@/lib/data';
import { getGreeting, formatDate, TODAY, isTodayDate } from '@/lib/utils';
import { Sparkles, Flame } from 'lucide-react';

export function HeaderSection() {
  const greeting = getGreeting();
  const firstName = currentUser.name.split(' ')[0];
  const [showStreakTooltip, setShowStreakTooltip] = useState(false);
  const { tasks, events } = useApp();
  
  // Get first videocall of the day
  const firstVideocall = useMemo(() => {
    return events
      .filter(e => e.category === 'videocall' && isTodayDate(e.startDate) && !e.isAllDay && e.startTime)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))[0];
  }, [events]);
  
  // Count pending tasks for today
  const pendingTasksCount = useMemo(() => {
    return tasks.filter(t => !t.completed).length;
  }, [tasks]);
  
  // Check if survey closes today
  const surveyClosesToday = useMemo(() => {
    return events.some(e => 
      e.category === 'survey' && 
      isTodayDate(e.startDate) && 
      e.title.toLowerCase().includes('cierra')
    );
  }, [events]);
  
  return (
    <section className="space-y-3">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-2xl font-bold"
            style={{ color: '#182E7B' }}
          >
            {greeting}, {firstName}
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
            <span className="text-sm font-medium text-orange-600">12 dias</span>
          </div>
          {showStreakTooltip && (
            <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
              12 dias seguidos cumpliendo tus tareas
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
              <span>Tenes <strong>{pendingTasksCount} tareas</strong> pendientes</span>
            </li>
            {firstVideocall && (
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span><strong>{firstVideocall.title}</strong> arranca a las <strong>{firstVideocall.startTime}</strong></span>
              </li>
            )}
            {surveyClosesToday && (
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>La encuesta de clima <strong>cierra hoy</strong> — no te olvides de completarla</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
