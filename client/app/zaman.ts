import { OE } from './oe';

export interface Zaman {
  _id?: string;
  owner_id: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  recur: boolean;
  tor: number;  // type of recur
  createdAt?: string;
  updatedAt?: string;
}

// interface User {
//    username: string;
//    password: string;
//    somethingElse: string;
// }

// export interface UserJSON extends User {
//    _id : string
// }

// export interface UserDB extends User {
//    _id : mongodb.ObjectId
// }