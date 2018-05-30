import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Faculty } from '../faculty';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'SUPERSECRET'
  })
};

const kadroUrl = '/api/kadro';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getKadro(): Observable<Faculty[]> {
    let url = kadroUrl;
    return this.http.get<Faculty[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // FIXME: Check if username is valid (and all other parameters)
  getKisi(username: string): Observable<Faculty> {
    let url = kadroUrl + '/' + username;
    return this.http.get<Faculty>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateKisi(kisi: Faculty): Observable<Faculty> {
    let url = kadroUrl + '/' + kisi.username;
    return this.http.put<Faculty>(url, kisi, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addKisi(kisi: Faculty): Observable<Faculty> {
    let url = kadroUrl;
    return this.http.post<Faculty>(url, JSON.stringify(kisi), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteKisi(kisi: Faculty): Observable<{}> {
    let url = kadroUrl + '/' + kisi.username;
    return this.http.delete(url)
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