import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Gorev } from '../gorev';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'SUPERSECRET'
  })
};

const angaryaUrl = 'http://localhost:4200/api/angarya';

@Injectable({
  providedIn: 'root',
})
export class TaskDataService {

  constructor(private http:HttpClient) {
    console.log('[taskdata.service.ts] Task Data service initialized...');
  }

  // get all angarya in the db
  getAllTasks(): Observable<Gorev[]>{
    return this.http.get<Gorev[]>(angaryaUrl)
      .pipe(
        tap(_ => console.log(`[task service] fetched all tasks ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }

  // get a single task by passing username as an argument
  getTaskById(id): Observable<Gorev>{
    return this.http.get<Gorev>(angaryaUrl + '/' + id)
      .pipe(
        tap(_ => console.log(`[user service] fetched task by id ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }


  // get a single task by passing username as an argument
  getTasksByOwnerId(id): Observable<Gorev[]>{
    return this.http.get<Gorev[]>(angaryaUrl + '/' + id)
      .pipe(
        tap(_ => console.log(`[user service] fetched tasks by owner id ${JSON.stringify(_)}`)),
        catchError(this.handleError)
      );
  }

  addTask(task): Observable<Gorev>{
    return this.http.post<Gorev>(angaryaUrl, JSON.stringify(task), httpOptions)
      .pipe(
        tap(_ => console.log(`[user service] added kisi`)),
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