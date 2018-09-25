import { Time } from './busy';

export interface Task {
  _id?: string;
  title: string;
  type: string;
  when: Time;
  weight: number;
  load: number;
  peopleCount: number;
  choosenPeople: Array<string>;
  status: number;
}

export const GSTATES = ['Açık', 'Kapalı'];

export const TYPES = ['Gözetmenlik', 'Sekreterlik', 'Kalite/Müdek/Tanıtım', 'Ders Asistanlığı', 'Lab Asistanlığı', 'Kurul', 'Diğer'];
