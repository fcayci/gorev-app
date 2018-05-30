export interface FacultyDB {
  _id?: string;
  fullname: string;
  email: string;
  username?: string;
  password?: string;
  position: string;
  office: string;
  phone: string;
  mobile?: string;
  load: number;
  tempLoad?: number;
  busy?: Array<string>;
  vacation: boolean
}

export interface Faculty extends FacultyDB {
  isAvailable?: string
}

export const POSITIONS = ['Dr.', 'Öğretim Görevlisi', 'Araştırma Görevlisi', 'Uzman', 'Memur', 'Diğer'];
