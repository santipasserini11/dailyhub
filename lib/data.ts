import { CalendarEvent, Task, Person, AbsentPerson, Shift } from './types';

// Current user
export const currentUser: Person = {
  id: 'santiago',
  name: 'Santiago Passerini',
  role: 'Ingeniero de Software',
  avatar: 'SP',
};

// People
export const people: Record<string, Person> = {
  valentina: { id: 'valentina', name: 'Valentina Ríos', role: 'Team Lead', avatar: 'VR' },
  carlos: { id: 'carlos', name: 'Carlos López', role: 'Product Manager', avatar: 'CL' },
  sofia: { id: 'sofia', name: 'Sofía Herrera', role: 'Designer', avatar: 'SH' },
  martin: { id: 'martin', name: 'Martín Sosa', role: 'Engineering Manager', avatar: 'MS' },
  luis: { id: 'luis', name: 'Luis Fernández', role: 'Backend Developer', avatar: 'LF' },
  ana: { id: 'ana', name: 'Ana Morales', role: 'QA Engineer', avatar: 'AM' },
  pedro: { id: 'pedro', name: 'Pedro Ibáñez', role: 'DevOps', avatar: 'PI' },
  camila: { id: 'camila', name: 'Camila Torres', role: 'Frontend Developer', avatar: 'CT' },
  maria: { id: 'maria', name: 'María García', role: 'HR Specialist', avatar: 'MG' },
  juan: { id: 'juan', name: 'Juan Pérez', role: 'Senior Developer', avatar: 'JP' },
  lara: { id: 'lara', name: 'Lara Rodríguez', role: 'Data Analyst', avatar: 'LR' },
  roberto: { id: 'roberto', name: 'Roberto Méndez', role: 'Architect', avatar: 'RM' },
  diego: { id: 'diego', name: 'Diego Suárez', role: 'Mobile Developer', avatar: 'DS' },
  rrhh: { id: 'rrhh', name: 'RRHH', role: 'Recursos Humanos', avatar: 'RH' },
  humand: { id: 'humand', name: 'Humand', role: 'Sistema', avatar: 'HU' },
  bienestar: { id: 'bienestar', name: 'Bienestar', role: 'Equipo de Bienestar', avatar: 'BI' },
  sustentabilidad: { id: 'sustentabilidad', name: 'Sustentabilidad', role: 'Equipo de Sustentabilidad', avatar: 'SU' },
};

// Helper to create dates in March/April 2026
const date = (month: number, day: number, year = 2026) => new Date(year, month - 1, day);

// March 2026 Events
export const events: CalendarEvent[] = [
  // Past events - March
  { id: 'e1', title: 'Capacitación "Comunicación Efectiva"', category: 'training', startDate: date(3, 1), endDate: date(3, 5), isAllDay: true },
  { id: 'e2', title: 'Cumpleaños María García', category: 'birthday', startDate: date(3, 3), isAllDay: true, person: people.maria },
  { id: 'e3', title: 'Evaluación de desempeño — ABRE', category: 'performance', startDate: date(3, 5), isAllDay: true },
  { id: 'e4', title: 'Team Building: Escape Room', category: 'company-event', startDate: date(3, 7), isAllDay: true },
  { id: 'e5', title: 'Q1 Business Review', category: 'company-event', startDate: date(3, 10), isAllDay: true },
  { id: 'e5b', title: 'Q1 Business Review', category: 'company-event', startDate: date(3, 10), isAllDay: false, startTime: '10:00', endTime: '11:30' },
  { id: 'e6', title: 'Encuesta de clima — ABRE', category: 'survey', startDate: date(3, 13), isAllDay: true },
  { id: 'e7', title: '¡Cerramos Q1 con récord!', category: 'communication', startDate: date(3, 14), isAllDay: true, organizer: currentUser, description: 'Gracias a todos por el esfuerzo de este trimestre. ¡Lo logramos!' },
  { id: 'e8', title: '3 años en Humand', category: 'anniversary', startDate: date(3, 15), isAllDay: true, person: people.juan, yearsInCompany: 3 },
  { id: 'e9', title: 'Cumpleaños Sofía Herrera', category: 'birthday', startDate: date(3, 17), isAllDay: true, person: people.sofia },
  
  // Vacations/Leave
  { id: 'v1', title: 'Luis Fernández — Vacaciones', category: 'vacation', startDate: date(3, 10), endDate: date(3, 22), isAllDay: true, person: people.luis },
  { id: 'v2', title: 'Ana Morales — Vacaciones', category: 'vacation', startDate: date(3, 15), endDate: date(3, 22), isAllDay: true, person: people.ana },
  { id: 'v3', title: 'Camila Torres — Vacaciones', category: 'vacation', startDate: date(3, 17), endDate: date(3, 21), isAllDay: true, person: people.camila },
  { id: 'v4', title: 'Pedro Ibáñez — Licencia médica', category: 'medical-leave', startDate: date(3, 18), endDate: date(3, 25), isAllDay: true, person: people.pedro },
  
  // TODAY - March 19
  { id: 't1', title: 'Weekly: Dragon Squad', category: 'videocall', startDate: date(3, 19), isAllDay: false, startTime: '09:00', endTime: '09:30', organizer: people.valentina },
  { id: 't2', title: '1:1 con Valentina Ríos', category: 'videocall', startDate: date(3, 19), isAllDay: false, startTime: '11:00', endTime: '11:30', organizer: people.valentina },
  { id: 't3', title: 'Recordatorio: completá la encuesta hoy', category: 'communication', startDate: date(3, 19), isAllDay: true, organizer: people.rrhh, description: 'La encuesta de clima cierra hoy. Tu opinión es muy importante para nosotros.' },
  { id: 't4', title: 'Encuesta de clima — CIERRA', category: 'survey', startDate: date(3, 19), isAllDay: true, description: 'Última oportunidad para completar la encuesta de clima organizacional.' },
  { id: 't5', title: 'Meet Your Buddy', category: 'onboarding', startDate: date(3, 19), isAllDay: true, description: 'Sesión de bienvenida con tu buddy asignado.' },
  { id: 't5b', title: 'Firma de declaración jurada de domicilio', category: 'onboarding', startDate: date(3, 19), isAllDay: false, startTime: '15:00', endTime: '15:30', organizer: people.valentina },
  
  // Future - March
  { id: 'f1', title: 'All Hands Meeting', category: 'company-event', startDate: date(3, 20), isAllDay: true },
  { id: 'f1b', title: 'All Hands Meeting', category: 'company-event', startDate: date(3, 20), isAllDay: false, startTime: '10:00', endTime: '11:30' },
  { id: 'f2', title: 'Nuevo beneficio: viernes cortos en julio', category: 'communication', startDate: date(3, 21), isAllDay: true, organizer: people.rrhh, description: 'A partir de julio, todos los viernes saldremos a las 15:00.' },
  { id: 'f3', title: 'Cumpleaños Carlos López', category: 'birthday', startDate: date(3, 22), isAllDay: true, person: people.carlos },
  { id: 'f4', title: 'Día de la Memoria', category: 'holiday', startDate: date(3, 24), isAllDay: true, description: 'Feriado nacional — Día de la Memoria por la Verdad y la Justicia' },
  { id: 'f5', title: 'Cumpleaños Lara Rodríguez', category: 'birthday', startDate: date(3, 25), isAllDay: true, person: people.lara },
  { id: 'f6', title: 'Retrospectiva fin de Q1', category: 'company-event', startDate: date(3, 27), isAllDay: true },
  { id: 'f6b', title: 'Retrospectiva Q1', category: 'company-event', startDate: date(3, 27), isAllDay: false, startTime: '15:00', endTime: '16:00' },
  { id: 'f7', title: 'Evaluación de desempeño — CIERRA', category: 'performance', startDate: date(3, 31), isAllDay: true },
  
  // Timed events - past March
  { id: 'st1', title: 'Standup de ingeniería', category: 'videocall', startDate: date(3, 2), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'st2', title: 'Standup de ingeniería', category: 'videocall', startDate: date(3, 9), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'st3', title: '1:1 con Valentina Ríos', category: 'videocall', startDate: date(3, 9), isAllDay: false, startTime: '11:00', endTime: '12:00', organizer: people.valentina },
  { id: 'st4', title: 'Standup de ingeniería', category: 'videocall', startDate: date(3, 16), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  
  // Timed events - future March
  { id: 'st5', title: 'Standup de ingeniería', category: 'videocall', startDate: date(3, 23), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'st6', title: 'Standup de ingeniería', category: 'videocall', startDate: date(3, 26), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'st7', title: '1:1 con Valentina Ríos', category: 'videocall', startDate: date(3, 26), isAllDay: false, startTime: '11:00', endTime: '11:30', organizer: people.valentina },
  { id: 'st8', title: 'Standup de ingeniería', category: 'videocall', startDate: date(3, 30), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  
  // April 2026
  { id: 'a1', title: 'Martín Sosa — Vacaciones', category: 'vacation', startDate: date(4, 1), endDate: date(4, 5), isAllDay: true, person: people.martin },
  { id: 'a2', title: 'Día del Veterano de Malvinas', category: 'holiday', startDate: date(4, 2), isAllDay: true, description: 'Feriado nacional — Día del Veterano y de los Caídos en la Guerra de Malvinas' },
  { id: 'a3', title: 'Viernes Santo', category: 'holiday', startDate: date(4, 3), isAllDay: true, description: 'Feriado nacional — Viernes Santo' },
  { id: 'a4', title: 'Día de la salud: actividades de hoy', category: 'communication', startDate: date(4, 7), isAllDay: true, organizer: people.bienestar },
  { id: 'a5', title: 'Wellness Day — Día Mundial de la Salud', category: 'company-event', startDate: date(4, 7), isAllDay: true },
  { id: 'a5b', title: 'Kickoff Wellness Day', category: 'company-event', startDate: date(4, 7), isAllDay: false, startTime: '10:00', endTime: '11:00' },
  { id: 'a6', title: 'Cumpleaños Roberto Méndez', category: 'birthday', startDate: date(4, 9), isAllDay: true, person: people.roberto },
  { id: 'a7', title: 'Evaluación de desempeño — CIERRA', category: 'performance', startDate: date(4, 10), isAllDay: true },
  { id: 'a8', title: 'Encuesta Q2 Pulse — ABRE', category: 'survey', startDate: date(4, 14), isAllDay: true },
  { id: 'a9', title: 'Capacitación "Agile para equipos"', category: 'training', startDate: date(4, 15), endDate: date(4, 25), isAllDay: true },
  { id: 'a10', title: '5 años en Humand', category: 'anniversary', startDate: date(4, 17), isAllDay: true, person: people.valentina, yearsInCompany: 5 },
  { id: 'a11', title: 'Celebramos el Día de la Tierra', category: 'communication', startDate: date(4, 22), isAllDay: true, organizer: people.sustentabilidad },
  { id: 'a12', title: 'Evento Día de la Tierra', category: 'company-event', startDate: date(4, 22), isAllDay: true },
  { id: 'a12b', title: 'Workshop Día de la Tierra', category: 'company-event', startDate: date(4, 22), isAllDay: false, startTime: '15:00', endTime: '16:00' },
  { id: 'a13', title: 'Cumpleaños Diego Suárez', category: 'birthday', startDate: date(4, 23), isAllDay: true, person: people.diego },
  { id: 'a14', title: 'Encuesta Q2 Pulse — CIERRA', category: 'survey', startDate: date(4, 28), isAllDay: true },
  { id: 'a15', title: 'All Hands Mensual', category: 'company-event', startDate: date(4, 30), isAllDay: true },
  { id: 'a15b', title: 'All Hands Mensual', category: 'company-event', startDate: date(4, 30), isAllDay: false, startTime: '10:00', endTime: '11:30' },
  
  // April timed events - standups Mon/Thu, 1:1s Wed
  { id: 'ast1', title: 'Standup de ingenieria', category: 'videocall', startDate: date(4, 6), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'ast2', title: '1:1 con Valentina Rios', category: 'videocall', startDate: date(4, 8), isAllDay: false, startTime: '11:00', endTime: '11:30', organizer: people.valentina },
  { id: 'ast3', title: 'Standup de ingenieria', category: 'videocall', startDate: date(4, 9), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'ast4', title: 'Standup de ingenieria', category: 'videocall', startDate: date(4, 13), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'ast5', title: '1:1 con Valentina Rios', category: 'videocall', startDate: date(4, 15), isAllDay: false, startTime: '11:00', endTime: '11:30', organizer: people.valentina },
  { id: 'ast6', title: 'Standup de ingenieria', category: 'videocall', startDate: date(4, 16), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'ast6b', title: 'Q2 Kickoff All Hands', category: 'company-event', startDate: date(4, 16), isAllDay: false, startTime: '10:00', endTime: '11:30' },
  { id: 'ast7', title: 'Standup de ingenieria', category: 'videocall', startDate: date(4, 20), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'ast8', title: '1:1 con Valentina Rios', category: 'videocall', startDate: date(4, 22), isAllDay: false, startTime: '11:00', endTime: '11:30', organizer: people.valentina },
  { id: 'ast9', title: 'Standup de ingenieria', category: 'videocall', startDate: date(4, 23), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'ast10', title: 'Standup de ingenieria', category: 'videocall', startDate: date(4, 27), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  { id: 'ast11', title: '1:1 con Valentina Rios', category: 'videocall', startDate: date(4, 29), isAllDay: false, startTime: '11:00', endTime: '11:30', organizer: people.valentina },
  { id: 'ast12', title: 'Standup de ingenieria', category: 'videocall', startDate: date(4, 30), isAllDay: false, startTime: '09:00', endTime: '09:30' },
  
  // Additional videocalls variety
  { id: 'vc1', title: 'Sprint Planning', category: 'videocall', startDate: date(3, 19), isAllDay: false, startTime: '14:00', endTime: '15:00', organizer: people.carlos },
  { id: 'vc2', title: 'Design Review', category: 'videocall', startDate: date(3, 20), isAllDay: false, startTime: '10:00', endTime: '10:30', organizer: people.sofia },
  { id: 'vc3', title: 'Tech Debt Discussion', category: 'videocall', startDate: date(3, 23), isAllDay: false, startTime: '15:00', endTime: '16:00', organizer: people.roberto },
  { id: 'vc4', title: 'Code Review Session', category: 'videocall', startDate: date(3, 25), isAllDay: false, startTime: '14:00', endTime: '14:30', organizer: people.juan },
  { id: 'vc5', title: 'Product Sync', category: 'videocall', startDate: date(3, 26), isAllDay: false, startTime: '16:00', endTime: '16:30', organizer: people.carlos },
  { id: 'vc6', title: 'Demo Friday', category: 'videocall', startDate: date(3, 28), isAllDay: false, startTime: '17:00', endTime: '18:00', organizer: people.valentina },
  { id: 'vc7', title: 'Architecture Review', category: 'videocall', startDate: date(4, 8), isAllDay: false, startTime: '14:00', endTime: '15:00', organizer: people.roberto },
  { id: 'vc8', title: 'Sprint Retro', category: 'videocall', startDate: date(4, 10), isAllDay: false, startTime: '16:00', endTime: '17:00', organizer: people.valentina },
  { id: 'vc9', title: 'Demo Friday', category: 'videocall', startDate: date(4, 11), isAllDay: false, startTime: '17:00', endTime: '18:00', organizer: people.valentina },
  { id: 'vc10', title: 'Product Roadmap Review', category: 'videocall', startDate: date(4, 17), isAllDay: false, startTime: '10:00', endTime: '11:00', organizer: people.carlos },
  { id: 'vc11', title: 'Demo Friday', category: 'videocall', startDate: date(4, 25), isAllDay: false, startTime: '17:00', endTime: '18:00', organizer: people.valentina },
  
  // More onboarding tasks for today
  { id: 'onb1', title: 'Configurar accesos VPN', category: 'onboarding', startDate: date(3, 19), isAllDay: true, description: 'Configurar acceso remoto a la red corporativa.' },
  { id: 'onb2', title: 'Capacitacion herramientas internas', category: 'onboarding', startDate: date(3, 20), isAllDay: false, startTime: '10:00', endTime: '11:00' },
];

// Tasks
export const initialTasks: Task[] = [
  { id: 'task1', title: 'Completar Benefits Enrollment', tag: 'General', assignedBy: people.valentina, createdByMe: false, dueDate: date(3, 18), completed: false },
  { id: 'task2', title: 'Completar encuesta de clima', tag: 'Encuesta', assignedBy: people.humand, createdByMe: false, dueDate: date(3, 19), completed: false },
  { id: 'task3', title: 'Meet Your Buddy', tag: 'Onboarding', assignedBy: people.valentina, createdByMe: false, dueDate: date(3, 19), completed: false },
  { id: 'task4', title: 'Autoevaluación Q1', tag: 'Desempeño', createdByMe: true, dueDate: date(3, 21), completed: false },
  { id: 'task5', title: 'Leer manual del empleado', tag: 'Onboarding', assignedBy: people.valentina, createdByMe: false, dueDate: date(3, 15), completed: true, completedDate: date(3, 15) },
  { id: 'task6', title: 'Completar objetivos Q2', tag: 'Desempeño', createdByMe: true, dueDate: date(4, 30), completed: false },
];

// Absent people today (March 19)
export const absentToday: AbsentPerson[] = [
  { ...people.luis, leaveType: 'vacation', startDate: date(3, 10), endDate: date(3, 22), leader: people.valentina },
  { ...people.ana, leaveType: 'vacation', startDate: date(3, 15), endDate: date(3, 22), leader: people.valentina },
  { ...people.pedro, leaveType: 'medical-leave', startDate: date(3, 18), endDate: date(3, 25), leader: people.martin },
  { ...people.camila, leaveType: 'vacation', startDate: date(3, 17), endDate: date(3, 21), leader: people.valentina },
];

// Shift data
export const getShiftForDate = (date: Date): Shift | null => {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  if (day === 0 || day === 6) {
    return null; // Weekend - rest day
  }
  
  if (day === 1 || day === 3 || day === 5) { // Mon, Wed, Fri
    return { name: 'Turno Depósito', startTime: '9:00', endTime: '18:00', totalHours: 8 };
  } else { // Tue, Thu
    return { name: 'Turno Depósito', startTime: '7:00', endTime: '17:00', totalHours: 8 };
  }
};

// Past shift worked hours
export const pastShiftData: Record<string, { workedHours: number; balance: number }> = {
  '2026-03-02': { workedHours: 8.5, balance: 0.5 },
  '2026-03-03': { workedHours: 7.5, balance: -0.5 },
  '2026-03-04': { workedHours: 8.0, balance: 0 },
  '2026-03-05': { workedHours: 8.5, balance: 0.5 },
  '2026-03-06': { workedHours: 7.0, balance: -1.0 },
  '2026-03-09': { workedHours: 8.0, balance: 0 },
  '2026-03-10': { workedHours: 9.0, balance: 1.0 },
  '2026-03-11': { workedHours: 8.0, balance: 0 },
  '2026-03-12': { workedHours: 7.5, balance: -0.5 },
  '2026-03-13': { workedHours: 8.0, balance: 0 },
  '2026-03-16': { workedHours: 8.5, balance: 0.5 },
  '2026-03-17': { workedHours: 8.0, balance: 0 },
  '2026-03-18': { workedHours: 8.0, balance: 0 },
};

// Holidays
export const holidays = [
  date(3, 24), // Día de la Memoria
  date(4, 2),  // Día del Veterano de Malvinas
  date(4, 3),  // Viernes Santo
];

export const isHoliday = (checkDate: Date): boolean => {
  return holidays.some(h => 
    h.getFullYear() === checkDate.getFullYear() &&
    h.getMonth() === checkDate.getMonth() &&
    h.getDate() === checkDate.getDate()
  );
};

// Category color mapping
export const categoryColors: Record<string, string> = {
  'birthday': '#EC4899',
  'anniversary': '#EC4899',
  'holiday': '#6B7280',
  'vacation': '#14B8A6',
  'medical-leave': '#14B8A6',
  'company-event': '#8B5CF6',
  'performance': '#F97316',
  'survey': '#EAB308',
  'training': '#6366F1',
  'onboarding': '#22C55E',
  'task': '#EF4444',
  'videocall': '#3B82F6',
  'communication': '#F43F5E',
  'reminder': '#A855F7',
};

// Category icons
export const categoryIcons: Record<string, string> = {
  'birthday': '🎂',
  'anniversary': '🎉',
  'holiday': '🏛️',
  'vacation': '🌴',
  'medical-leave': '🏥',
  'company-event': '🎤',
  'performance': '📊',
  'survey': '💬',
  'training': '🎓',
  'onboarding': '✅',
  'task': '📋',
  'videocall': '📞',
  'communication': '📢',
  'reminder': '🔔',
};

// Category labels in Spanish
export const categoryLabels: Record<string, string> = {
  'birthday': 'Cumpleaños',
  'anniversary': 'Aniversarios',
  'holiday': 'Feriados',
  'vacation': 'Vacaciones',
  'medical-leave': 'Licencia médica',
  'company-event': 'Eventos de empresa',
  'performance': 'Desempeño',
  'survey': 'Encuestas',
  'training': 'Capacitaciones',
  'onboarding': 'Onboarding',
  'task': 'Tareas',
  'videocall': 'Videollamadas',
  'communication': 'Comunicaciones',
  'reminder': 'Recordatorios',
};
