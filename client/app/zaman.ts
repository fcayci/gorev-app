export interface ZamanDB {
  _id?: string;
  owner_id: string;
  startDate: string;
  endDate: string;
  recur: boolean;
  tor: number;  // type of recur
  // createdAt?: string;
  // updatedAt?: string;
}

export interface Zaman extends ZamanDB {
  startTime?: string;
  endTime?: string;
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