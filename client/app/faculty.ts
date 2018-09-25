export interface FacultyDB {
  _id?: string;
  fullname: string;
  email: string;
  username?: string;
  password?: string;
  position: string;
  rank: number;
  office: string;
  phone: string;
  mobile?: string;
  load: number;
  tempLoad?: number;
  busy?: Array<string>;
  tasks?: Array<string>;
  vacation: boolean;
}

export interface Faculty extends FacultyDB {
  isAvailable?: string;
}

export const POSITIONS = ['Dr.', 'Öğretim Görevlisi', 'Araştırma Görevlisi', 'Uzman', 'Memur', 'Diğer'];
