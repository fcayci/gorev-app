import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

// import models
import { User, Busy } from '../models/User';
import { Task } from '../models/Task';

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

	// local cache copies of Users
	user: User;
	users: User[]];

	constructor(
		private http: HttpClient
	) {}

	// get all the users
	// used by /kadro to get all users
	getUsers(): Observable<User[]> {
		const url = kadroUrl;
		return this.http.get<User[]>(url)
		.pipe(
			retry(3), // retry a failed request up to 3 times
			catchError(this.handleError),
			tap(User => this.users = User)
		);
	}

	// add a user to the users
	// used by assignment-add component
	addUser(kisi: User): Observable<User> {
		const url = kadroUrl;
		return this.http.post<User>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError),
			tap( User => this.kadro.push(User))
		);
	}

	// get the given person
	// used by XXX
	getUser(kisi: User): Observable<User> {
		console.log('getUser():', kisi);
		const url = kadroUrl + '/' + kisi._id;
		return this.http.get<User>(url)
		.pipe(
			catchError(this.handleError)
		);
	}

	// get given id person
	getUserById(id: string): Observable<User> {
		const url = kadroUrl + '/' + id;
		return this.http.get<User>(url)
		.pipe(
			catchError(this.handleError)
		);
	}

	// update kisi properties
	updateUser(kisi: User): Observable<User> {
		const url = kadroUrl + '/' + kisi._id;
		return this.http.put<User>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// add task to kisi and add load to pending load
	addTaskToUser(kisi: User, task: Task): Observable<User> {
		const url = kadroUrl + '/' + kisi._id;
		// check and add task if it is not there already
		const index: number = kisi.task.indexOf(task._id);
		if (index === -1) {
			kisi.task.push(task._id);
			kisi.pendingload += task.load;
		}
		return this.http.put<User>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// delete task from user and delete pending load
	deleteTaskFromUser(kisi: User, task: Task): Observable<User> {
		const url = kadroUrl + '/' + kisi._id;
		// find and remove task from kisi if task exists
		const index: number = kisi.task.indexOf(task._id);
		if (index !== -1) {
			kisi.task.splice(index, 1);
			kisi.pendingload -= task.load;
		}
		return this.http.put<User>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// delete task from user and add new load to user
	completeTaskOfUser(kisi: User, task: Task): Observable<User> {
		const url = kadroUrl + '/' + kisi._id;
		// find and remove task from kisi if task exists
		const o = task.owners.filter(p => p.id === kisi._id);
		const index: number = kisi.task.indexOf(task._id);
		if (index !== -1) {
			kisi.task.splice(index, 1);
			kisi.pendingload -= task.load;
			kisi.load += o[0].newload;
		}
		return this.http.put<User>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// add busy to kisi
	addBusyToUser(kisi: User, b: Busy): Observable<User> {
		const url = kadroUrl + '/' + kisi._id;
		kisi.busy.push(b);
		return this.http.put<User>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// delete busy from kisi
	deleteBusyFromUser(kisi: User, b: Busy): Observable<User> {
		const url = kadroUrl + '/' + kisi._id;
		// find and remove task from kisi if task exists
		const index: number = kisi.busy.findIndex(m => m._id === b._id);
		if (index !== -1) {
			kisi.busy.splice(index, 1);
		} else {
			// return ; //FIXME add error message
		}
		return this.http.put<User>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// // complete task, add load, remove pending load
	// completeTaskOfKisi(kisi: User, task: Task): Observable<User> {
	// 	const url = kadroUrl + '/' + kisi._id;
	// 	// find and remove task from kisi if task exists
	// 	const index: number = kisi.task.indexOf(task._id);
	// 	if (index !== -1) {
	// 		kisi.task.splice(index, 1);
	// 		kisi.pendingload -= task.load;
	// 		kisi.load += task.load;
	// 	}
	// 	return this.http.put<User>(url, JSON.stringify(kisi), httpOptions)
	// 	.pipe(
	// 		catchError(this.handleError)
	// 	);
	// }

	// FIXME: make it sudo
	// FIXME: add cache
	deleteUser(kisi: User): Observable<{}> {
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
