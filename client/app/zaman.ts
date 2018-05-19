export interface ZamanDB {
  _id?: string;
  title: string;
  owner_id: string;
  startDate: string;
  endDate: string;
  recur: number
}

export interface Zaman extends ZamanDB {
  startTime?: string;
  endTime?: string
}

export const REPEATS = ["Tekrar Etmez", "Günlük", "Her Hafta"];
