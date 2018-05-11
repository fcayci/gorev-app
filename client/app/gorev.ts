import { OE } from './oe';

export interface Gorev {
  _id?: string;
  title: string;
  type: string;
  customType: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  peopleCount: number;
  choosenPeople: Array<OE>;
  status: string;
  createdAt?: Date;
  updatedAt?: Date
}