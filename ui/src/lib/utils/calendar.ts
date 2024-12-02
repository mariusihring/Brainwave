import { addDays, parseISO, startOfWeek } from 'date-fns';

export function generateWeekDays(date: Date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 5 }, (_, i) => addDays(start, i));
}

export function generateTimeSlots() {
  return Array.from({ length: 15 }, (_, i) => {
    const hour = i + 6; // Start from 6 AM
    return `${hour}:00`;
  });
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}


