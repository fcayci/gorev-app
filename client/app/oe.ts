export interface OEDB {
  _id?: string;
  fullname: string;
  email: string;
  position: string;
  office: string;
  phone: string;
  mobile?: string;
  username?: string;
  // password?: string;
  load: number;
  tempLoad?: number;
  busy?: Array<string>;
  vacation: boolean;
  // createdAt?: string;
  // updatedAt?: string;
}

export interface OE extends OEDB {
  isAvailable?: string;
}

export const POSITIONS = ['Dr','Öğretim Görevlisi','Araştırma Görevlisi','Uzman', 'Memur', 'Diğer'];
