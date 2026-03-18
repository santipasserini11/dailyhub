'use client';

import { ViewToggle } from '@/components/ui/view-toggle';
import { HeaderSection } from './header-section';
import { ShiftBanner } from './shift-banner';
import { EventsSection } from './events-section';
import { TasksSection } from './tasks-section';
import { BirthdaysSection } from './birthdays-section';
import { AbsentSection } from './absent-section';

export function DailyHub() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F6FA]">
      <div className="p-4 space-y-6">
        {/* View toggle */}
        <div className="flex justify-center">
          <ViewToggle />
        </div>

        {/* Header with greeting and AI brief */}
        <HeaderSection />

        {/* Shift banner */}
        <ShiftBanner />

        {/* Events today */}
        <EventsSection />

        {/* Tasks */}
        <TasksSection />

        {/* Birthdays & anniversaries */}
        <BirthdaysSection />

        {/* Absent people */}
        <AbsentSection />

        {/* Bottom padding for FAB */}
        <div className="h-16" />
      </div>
    </div>
  );
}
