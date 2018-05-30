import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Busy } from '../busy';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'SUPERSECRET'
  })
};

const busyUrl = '/api/busy';

@Injectable({
  providedIn: 'root',
})
export class BusyService {

  constructor(private http:HttpClient) {
  }

  getBusyAll(): Observable<Busy[]>{
    let url = busyUrl;
    return this.http.get<Busy[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBusyByOwnerId(owner_id: string): Observable<Busy[]>{
    let url = busyUrl + '/' + owner_id;
    return this.http.get<Busy[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // FIXME: Change name to delBusy / deleteBusy
  delBusyByTime(busy: Busy): Observable<{}>{
    let url = busyUrl + '/' + busy._id;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  setBusyByOwnerId(busy: Busy): Observable<Busy>{
    let url = busyUrl + '/' + busy.owner_id;
    return this.http.post<Busy>(url, JSON.stringify(busy), httpOptions)
      .pipe(
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