import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

// import models
import { Faculty } from '../models/FacultyModel';
import { Task } from '../models/TaskModel';

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

	// local cache copies of Faculty
	cache_kisi: Faculty;
	cache_kadro: Faculty[] = [];

	constructor(private http: HttpClient) {}

	// get full kadro
	getKadro(): Observable<Faculty[]> {
		const url = kadroUrl;
		return this.http.get<Faculty[]>(url)
		.pipe(
			retry(3), // retry a failed request up to 3 times
			catchError(this.handleError),
			tap( // cache result
				Faculty => this.cache_kadro = Faculty
			)
		);
	}

	// add a person to kadro
	addKisi(kisi: Faculty): Observable<Faculty> {
		const url = kadroUrl;
		return this.http.post<Faculty>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError),
			tap( // update cache when someone is added
				Faculty => this.cache_kadro.push(Faculty)
			)
		);
	}

	// get the given person (request with id)
	getKisi(kisi: Faculty): Observable<Faculty> {
		const url = kadroUrl + '/' + kisi._id;
		return this.http.get<Faculty>(url)
		.pipe(
			catchError(this.handleError)
		);
	}

	// get given id person
	getKisibyId(id: string): Observable<Faculty> {
		const url = kadroUrl + '/' + id;
		return this.http.get<Faculty>(url)
		.pipe(
			catchError(this.handleError)
		);
	}

	// update kisi properties
	updateKisi(kisi: Faculty): Observable<Faculty> {
		const url = kadroUrl + '/' + kisi._id;
		return this.http.put<Faculty>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// add task to kisi and add load to pending load
	addTaskToKisi(kisi: Faculty, task: Task): Observable<Faculty> {
		const url = kadroUrl + '/' + kisi._id;
		// check and add task if it is not there already
		const index: number = kisi.task.indexOf(task._id);
		if (index === -1) {
			kisi.task.push(task._id);
			kisi.pendingload += task.load;
		}
		return this.http.put<Faculty>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// delete task from kisi and delete pending load
	deleteTaskFromKisi(kisi: Faculty, task: Task): Observable<Faculty> {
		const url = kadroUrl + '/' + kisi._id;
		// find and remove task from kisi if task exists
		const index: number = kisi.task.indexOf(task._id);
		if (index !== -1) {
			kisi.task.splice(index, 1);
			kisi.pendingload -= task.load;
		}
		return this.http.put<Faculty>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// complete task, add load, remove pending load
	completeTaskOfKisi(kisi: Faculty, task: Task): Observable<Faculty> {
		const url = kadroUrl + '/' + kisi._id;
		// find and remove task from kisi if task exists
		const index: number = kisi.task.indexOf(task._id);
		if (index !== -1) {
			kisi.task.splice(index, 1);
			kisi.pendingload -= task.load;
			kisi.load += task.load;
		}
		return this.http.put<Faculty>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// FIXME: make it sudo
	// FIXME: add cache
	deleteKisi(kisi: Faculty): Observable<{}> {
		const url = kadroUrl + '/' + kisi._id;
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
				`body was: ${error.error}`
			);
		}
		// return an observable with a user-facing error message
		// return throwError('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
		return throwError(error.error);
	}
}
