export interface GorevDB {
  _id?: string;
  title: string;
  type: number;
  startDate: string;
  endDate: string;
  duration?: number;
  peopleCount: number;
  choosenPeople: Array<string>;
  status: number
}

export interface Gorev extends GorevDB {
  startTime?: string;
  endTime?: string;
}

export const GSTATES = ['Açık', 'Bitmiş', 'Kapalı'];

export const TYPES = ['Gözetmenlik','Sekreterlik','Kalite/Müdek/Tanıtım','Lab Asistanlığı','Diğer'];
