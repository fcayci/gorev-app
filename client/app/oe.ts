import { Zaman } from './zaman';

export interface OE {
  _id?: string;
  fullname: string;
  email: string;
  position: string;
  office: string;
  phone: string;
  mobile?: string;
  username?: string;
  password?: string;
  load: number;
  busy?: Array<Zaman>;
  vacation: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
