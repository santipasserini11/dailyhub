export type EventCategory = 
  | 'birthday'
  | 'anniversary'
  | 'holiday'
  | 'vacation'
  | 'company-event'
  | 'performance'
  | 'survey'
  | 'training'
  | 'onboarding'
  | 'task'
  | 'videocall'
  | 'communication'
  | 'reminder'
  | 'medical-leave';

export interface Person {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  startDate: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  description?: string;
  organizer?: Person;
  person?: Person;
  yearsInCompany?: number;
}

export interface Task {
  id: string;
  title: string;
  tag: string;
  assignedBy?: Person;
  createdByMe: boolean;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
  dependsOn?: string;
}

export interface Shift {
  name: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  workedHours?: number;
  balance?: number;
}

export interface AbsentPerson extends Person {
  leaveType: 'vacation' | 'medical-leave' | 'personal';
  startDate: Date;
  endDate: Date;
  leader: Person;
}

export type ViewMode = 'inicio' | 'calendario';
export type CalendarViewMode = 'semana' | 'mes';
