import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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

  kisicache: Faculty;

  constructor(private http: HttpClient) {
  }

  getKadro(): Observable<Faculty[]> {
    const url = kadroUrl;
    return this.http.get<Faculty[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getKisi(username: string): Observable<Faculty> {
    const url = kadroUrl + '/' + username;
    return this.http.get<Faculty>(url)
      .pipe(
        catchError(this.handleError),
        tap(kisi => this.kisicache = kisi)
      );
  }


  addTaskToKisi(kisi: Faculty, taskid: string): Observable<Faculty> {
    const url = kadroUrl + '/' + kisi.username + '/addtask';
    return this.http.put<Faculty>(url, JSON.stringify({ tasks : taskid }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTaskFromKisi(kisi: Faculty, taskid: string): Observable<Faculty> {
    const url = kadroUrl + '/' + kisi.username + '/deltask';
    return this.http.put<Faculty>(url, JSON.stringify({ tasks : taskid }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateKisi(kisi: Faculty): Observable<Faculty> {
    const url = kadroUrl + '/' + kisi.username;

    if (this.kisicache.username === kisi.username) {
      var diff = this.compareJSON(this.kisicache, kisi);
    }

    // Append _id so that we can find who to update in the backend
    diff['_id'] = this.kisicache._id;

    return this.http.put<Faculty>(url, diff, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addKisi(kisi: Faculty): Observable<Faculty> {
    const url = kadroUrl;
    return this.http.post<Faculty>(url, JSON.stringify(kisi), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteKisi(kisi: Faculty): Observable<{}> {
    const url = kadroUrl + '/' + kisi.username;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private compareJSON = function(obj1, obj2) {
    const ret = {};
    for (const i in obj2) {
      if (!i.startsWith('__')) {
        if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
          ret[i] = obj2[i];
        }
      }
    }
    return ret;
  };


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
  }
}
