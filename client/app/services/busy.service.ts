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

  getBusyById(type: string, id: string): Observable<Busy[]>{
    let url = busyUrl + '/' + type + '/' + id;
    return this.http.get<Busy[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // FIXME: Owner / Task ID search should be done by the service
  // getBusyByOwnerId(oid: string): Observable<Busy>{
  //   let busies : Busy[];
  //   this.getBusyAll()
  //     .subscribe((res) => {
  //        busies = res;
  //   });

  //   return busies.filter(i=>i.owner_id === oid)
  // }

  deleteBusy(busy: Busy): Observable<{}>{
    let url = busyUrl + '/' + busy._id;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  setBusy(busy: Busy): Observable<Busy>{
    let url = busyUrl
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