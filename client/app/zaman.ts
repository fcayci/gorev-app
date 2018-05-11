import { OE } from './oe';

export interface Zaman {
  _id?: string;
  owner_id: OE;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  recur: boolean;
  tor: number;  // type of recur
  createdAt?: Date;
  updatedAt?: Date;
}