import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../task';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'SUPERSECRET'
  })
};

const angaryaUrl = '/api/angarya';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  constructor(private http: HttpClient) {
  }

  getAllTasks(): Observable<Task[]> {
    const url = angaryaUrl;
    return this.http.get<Task[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTaskById(id: string): Observable<Task> {
    const url = angaryaUrl + '/' + id;
    return this.http.get<Task>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTasksByIds(ids: Array<string>): Observable<Task[]> {
    const url = angaryaUrl + '/' + ids;
    return this.http.get<Task[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // FIXME: Seems wrong
  getTasksByOwnerId(id: string): Observable<Task[]> {
    const url = angaryaUrl + '/' + id;
    return this.http.get<Task[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  addTask(task: Task): Observable<Task> {
    const url = angaryaUrl;
    return this.http.post<Task>(url, JSON.stringify(task), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  delTaskById(task: Task): Observable<{}> {
    const url = angaryaUrl + '/' + task._id;
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