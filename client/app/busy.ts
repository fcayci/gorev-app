export interface Busy {
  _id?: string;
  title: string;
  owner_id: string;
  task_id?: string;
  when: Time;
}

export class TimeDB {
  startDate: string;
  endDate: string;
  duration?: number; // Only exists in Task
  recur?: number; // 0, 1, 7 are the values. Only exists in Busy
}

// This stuff does not show up in the DB
export class Time extends TimeDB {
  gDate?: string;
  startTime?: string;
  endTime?: string;
}

export const REPEATS = ['Tekrar Etmez', 'Günlük', 'Her Hafta'];
