import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'SUPERSECRET'
  })
};

@Injectable({
  providedIn: 'root',
})
export class BusyDataService {

  constructor(private http:HttpClient) {
    console.log('[busydata.service.ts] Busy Data service initialized...');
  }

  // get busy times for everybody
  getBusyAll(){
    return this.http.get('http://localhost:4200/api/busy')
//      .map(res => res.json());
  }

  // get busy times for the given Owner ID
  getBusyByOwnerId(owner_id){
    return this.http.get('http://localhost:4200/api/busy/' + owner_id)
 //     .map(res => res.json());
  }

  // delete busy time for given Time ID
  delBusyByTimeId(timeframe_id){
    return this.http.delete('http://localhost:4200/api/busy/' + timeframe_id)
//      .map(res => res.json());
  }


  // set busy times for the given Owner ID
  setBusyByOwnerId(timeframe){
    //console.log('[userdata.service]. ', owner_id, timeframe);
    return this.http.post('http://localhost:4200/api/busy/' + timeframe.owner_id, JSON.stringify(timeframe), httpOptions)
 //     .map(res => res.json());
  }

}