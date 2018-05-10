export class OE {
  _id: string;
  // password: string;
  fullname: string;
  email: string;
  //position: string;
  office: string;
  phone: string;
  mobile: string;
  username: string;
  // load: number;
  // busy: null;
  // vacation: boolean
}

export class Zaman {
  owner_id : string;
  startDate : string;
  endDate : string;
  startTime : string;
  endTime : string;
  recur : boolean;
  tor : number;  // type of recur
}


export class Gorev {
  title: string;
  type: string;
  customType: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  //choosenPeople: [];
  status: string;
}