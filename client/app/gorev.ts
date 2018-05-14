export interface GorevDB {
  _id?: string;
  title: string;
  type: string;
//  customType?: string;
  startDate: string;
  endDate: string;
  duration?: number;
  peopleCount: number;
  choosenPeople: Array<string>;
  status: string;
  // createdAt?: string;
  // updatedAt?: string
}

export interface Gorev extends GorevDB {
  startTime?: string;
  endTime?: string;
}

export const GSTATES = ['Open', 'Completed', 'Closed'];

export const TYPES = ['Gözetmenlik','Sekreterlik','Kalite/Müdek/Tanıtım','Lab Asistanlığı','Diğer'];
