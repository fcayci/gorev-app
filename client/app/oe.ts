import { Zaman } from './zaman';

export interface OE {
  _id?: string;
  fullname: string;
  email: string;
  position: "Dr" | "Öğretim Görevlisi"| "Araştırma Görevlisi" | "Uzman" | "Memur";
  office: string;
  phone: string;
  mobile?: string;
  username?: string;
  password?: string;
  load: number;
  busy?: Array<string>;
  vacation: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
