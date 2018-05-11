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

const kadroUrl = 'http://localhost:4200/api/kadro';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {
    console.log('[userdata.service.ts] User Data service initialized...');
  }

  getKadro(): Observable<OE[]> {
    return this.http.get<OE[]>(kadroUrl)
      .pipe(
        tap(_ => console.log(`[user service] fetched kadro ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }

  getKisi(username){
    return this.http.get<OE>(kadroUrl + '/' + username)
      .pipe(
        tap(_ => console.log(`[user service] fetched kisi ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }

  updateKisi(kisi){
    return this.http.put<OE>(kadroUrl + '/' + kisi.username,
      kisi, httpOptions)
      .pipe(
        tap(_ => console.log(`[user service] updated kisi ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }

  addKisi(kisi: OE): Observable<OE> {
    //console.log('[user service] creating', kisi);
    return this.http.post<OE>('http://localhost:4200/api/kadro', JSON.stringify(kisi), httpOptions)
      .pipe(
        tap(_ => console.log(`[user service] added kisi`)),
        catchError(this.handleError)
      );
  }

  // delete a kisi by passing the kisi
  deleteKisi(kisi){
    return this.http.delete('http://localhost:4200/api/kadro/' + kisi.username)
 //     .map(res => res.json());
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