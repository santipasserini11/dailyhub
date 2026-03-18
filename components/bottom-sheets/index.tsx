'use client';

import { useApp } from '@/lib/context';
import { BottomSheet } from './bottom-sheet';
import { EventDetailSheet } from './event-detail-sheet';
import { VideocallSheet } from './videocall-sheet';
import { ShiftSheet } from './shift-sheet';
import { WhosOutSheet } from './whos-out-sheet';
import { NewTaskSheet } from './new-task-sheet';
import { DayEventsSheet } from './day-events-sheet';
import { formatDate } from '@/lib/utils';

export function BottomSheetManager() {
  const { bottomSheet, closeBottomSheet } = useApp();

  if (!bottomSheet) return null;

  const getTitle = () => {
    switch (bottomSheet.type) {
      case 'event':
        return undefined;
      case 'videocall':
        return undefined;
      case 'shift':
        return 'Mi turno';
      case 'whos-out':
        return 'Ausentes hoy';
      case 'new-task':
        return 'Nueva tarea';
      case 'day-events':
        return `Eventos del ${formatDate(bottomSheet.date, "d 'de' MMMM")}`;
    }
  };

  const getContent = () => {
    switch (bottomSheet.type) {
      case 'event':
        return <EventDetailSheet event={bottomSheet.event} />;
      case 'videocall':
        return <VideocallSheet event={bottomSheet.event} onClose={closeBottomSheet} />;
      case 'shift':
        return <ShiftSheet date={bottomSheet.date} />;
      case 'whos-out':
        return <WhosOutSheet />;
      case 'new-task':
        return <NewTaskSheet />;
      case 'day-events':
        return <DayEventsSheet date={bottomSheet.date} />;
    }
  };

  return (
    <BottomSheet isOpen={true} onClose={closeBottomSheet} title={getTitle()}>
      {getContent()}
    </BottomSheet>
  );
}
