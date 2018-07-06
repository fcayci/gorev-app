export interface TaskDB {
  _id?: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  duration?: number;
  weight?: number;
  load?: number;
  peopleCount: number;
  choosenPeople: Array<string>;
  status: number
}

export interface Task extends TaskDB {
  startTime?: string;
  endTime?: string;
  gDate?: string;
}

export const GSTATES = ['Açık', 'Bitmiş', 'Kapalı'];

export const TYPES = ['Gözetmenlik','Sekreterlik','Kalite/Müdek/Tanıtım','Lab Asistanlığı','Diğer'];
