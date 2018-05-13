import { OE } from './oe';

export interface Gorev {
  _id?: string;
  title: string;
  type: string;
  customType?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  peopleCount: number;
  choosenPeople: Array<string>;
  status: string;
  createdAt?: string;
  updatedAt?: string
}

export const GSTATES = ['Open', 'Completed', 'Closed'];

export const POSITIONS = ['Gözetmenlik','Sekreterlik','Kalite/Müdek/Tanıtım','Lab Asistanlığı','Diğer'];
