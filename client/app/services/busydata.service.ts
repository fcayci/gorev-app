import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class BusyDataService {

  constructor(private http:Http) {
    console.log('[busydata.service.ts] Busy Data service initialized...');
  }

  // get busy times for the given Owner ID
  getBusyByOwnerId(owner_id){
    return this.http.get('http://localhost:4200/api/busy/' + owner_id)
      .map(res => res.json());
  }

  // delete busy time for given Time ID
  delBusyByTimeId(timeframe_id){
    return this.http.delete('http://localhost:4200/api/busy/' + timeframe_id)
      .map(res => res.json());
  }


  // set busy times for the given Owner ID
  setBusyByOwnerId(owner_id, timeframe){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    //console.log('[userdata.service]. ', owner_id, timeframe);
    return this.http.post('http://localhost:4200/api/busy/' + owner_id, JSON.stringify(timeframe) {headers: headers})
      .map(res => res.json());
  }

}