import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Task } from '../models/Task';

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

	task: Task; // local cache copy
	tasks: Task[]; // local cache copy
	constructor(
		private http: HttpClient
	) {}

	// used by /angarya to get all the tasks
	// FIXME: see if we want to do just open / open & closed
	// authorization level: members
	getTasks(): Observable<Task[]> {
		const url = angaryaUrl;
		return this.http.get<Task[]>(url)
		.pipe(
			catchError(this.handleError),
			tap(Task => this.tasks = Task)
		);
	}

	// used by /angarya to add a task
	// authorization level: managers
	addTask(task: Task): Observable<Task> {
		const url = angaryaUrl;
		return this.http.post<Task>(url, JSON.stringify(task), httpOptions)
		.pipe(
			catchError(this.handleError),
			tap(Task => this.tasks.push(Task))
		);
	}

	// used by user/gorevler to get the tasks of the user
	// user schema has a list of tasks, and we get them comma separated
	// authorization level: members
	getTasksByIds(ids: Array<string>): Observable<Task[]> {
		// If the ids is empty return an empty array to prevent from
		// getting all the tasks (/angarya)
		if (ids.length === 0) {
			return of([]);
		} else {
			const url = angaryaUrl + '/' + ids;
			return this.http.get<Task[]>(url)
				.pipe(
					catchError(this.handleError)
			);
		}
	}

	// update task properties
	// this is a broad function that a lot of functions call
	// currently no checks, just puts the request
	// authority level: varies by field
	// FIXME: check authority level based on field
	//  - users can use it to update owners field of their own to
	//      change the status and newload values
	//      they should only be able to write to their own owners field
	//  - managers can use it to complete the task and change its
	//      status to completed
	updateTask(task: Task): Observable<Task> {
		const url = angaryaUrl + '/' + task._id;
		return this.http.put<Task>(url, JSON.stringify(task), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// deletes the given task from database
	// if the task updated the pendingload value, it will just stay
	// authority level: managers
	deleteTask(task: Task): Observable<{}> {
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
