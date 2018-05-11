import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OE } from '../oe';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'SUPERSECRET'
  })
};

const busyUrl = 'http://localhost:4200/api/busy';


@Injectable({
  providedIn: 'root',
})
export class BusyDataService {

  constructor(private http:HttpClient) {
    console.log('[busydata.service.ts] Busy Data service initialized...');
  }

  // get busy times for everybody
  getBusyAll(){
    return this.http.get(busyUrl)
      .pipe(
        tap(_ => console.log(`[busy service] fetched busies ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }

  // get busy times for the given Owner ID
  getBusyByOwnerId(owner_id){
    return this.http.get(busyUrl + '/' + owner_id)
      .pipe(
        //tap(_ => console.log(`[busy service] fetched busy by owner id ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }

  // delete busy time for given Time ID
  delBusyByTimeId(busy){
    return this.http.delete(busyUrl + '/' + 'busy._id')
      .pipe(
        //tap(_ => console.log(`[busy service] removed busy by id ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }


  // set busy times for the given Owner ID
  setBusyByOwnerId(timeframe){
    return this.http.post(busyUrl + '/' + timeframe.owner_id, JSON.stringify(timeframe), httpOptions)
      .pipe(
        tap(_ => console.log(`[busy service] fetched busy by owner id ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }

 private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}