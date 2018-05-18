export interface ZamanDB {
  _id?: string;
  title: string;
  owner_id: string;
  startDate: string;
  endDate: string;
  recur: number}
  // createdAt?: string;
  // updatedAt?: string;
}

export interface Zaman extends ZamanDB {
  startTime?: string;
  endTime?: string;
}

export const REPEATS = ["Tekrar Etmez", "Her Gün", "Her Hafta"];

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