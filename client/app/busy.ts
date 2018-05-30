export interface BusyDB {
  _id?: string;
  title: string;
  owner_id: string;
  startDate: string;
  endDate: string;
  recur: number
}

export interface Busy extends BusyDB {
  startTime?: string;
  endTime?: string
}

export const REPEATS = ["Tekrar Etmez", "Günlük", "Her Hafta"];
