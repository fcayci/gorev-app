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

const usersURL = '/api/kadro';

@Injectable({
	providedIn: 'root',
})
export class UserService {

	// local cache copies of Users
	user: User;
	users: User[];

	constructor(
		private http: HttpClient
	) {}

	// get all the users
	// used by /kadro to get all users
	getUsers(): Observable<User[]> {
		const url = usersURL;
		return this.http.get<User[]>(url)
		.pipe(
			retry(3),
			catchError(this.handleError),
			tap(User => this.users = User)
		);
	}

	// add a user to the users
	// used by assignment-add component
	addUser(user: User): Observable<User> {
		const url = usersURL;
		return this.http.post<User>(url, JSON.stringify(user), httpOptions)
		.pipe(
			catchError(this.handleError),
			tap( User => this.users.push(User))
		);
	}

	// get the given person
	// used by XXX
	getUser(user: User): Observable<User> {
		console.log('getUser():', user);
		const url = usersURL + '/' + user._id;
		return this.http.get<User>(url)
		.pipe(
			retry(3),
			catchError(this.handleError)
		);
	}

	// get given id person
	getUserById(id: string): Observable<User> {
		const url = usersURL + '/' + id;
		return this.http.get<User>(url)
		.pipe(
			retry(3),
			catchError(this.handleError)
		);
	}

	// update user properties
	updateUser(user: User): Observable<User> {
		const url = usersURL + '/' + user._id;
		return this.http.put<User>(url, JSON.stringify(user), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// add task to user and add load to pending load
	addTaskToUser(user: User, task: Task): Observable<User> {
		const url = usersURL + '/' + user._id;
		// check and add task if it is not there already
		const index: number = user.task.indexOf(task._id);
		if (index === -1) {
			user.task.push(task._id);
			user.pendingload += task.load;
		}
		return this.http.put<User>(url, JSON.stringify(user), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// delete task from user and delete pending load
	deleteTaskFromUser(user: User, task: Task): Observable<User> {
		const url = usersURL + '/' + user._id;
		// find and remove task from user if task exists
		const index: number = user.task.indexOf(task._id);
		if (index !== -1) {
			user.task.splice(index, 1);
			user.pendingload -= task.load;
		}
		return this.http.put<User>(url, JSON.stringify(user), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// delete task from user and add new load to user
	completeTaskOfUser(user: User, task: Task): Observable<User> {
		const url = usersURL + '/' + user._id;
		// find and remove task from user if task exists
		const o = task.owners.filter(p => p.id === user._id);
		const index: number = user.task.indexOf(task._id);
		if (index !== -1) {
			user.task.splice(index, 1);
			user.pendingload -= task.load;
			user.load += o[0].newload;
		}
		return this.http.put<User>(url, JSON.stringify(user), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// add busy to user
	addBusyToUser(user: User, b: Busy): Observable<User> {
		const url = usersURL + '/' + user._id;
		user.busy.push(b);
		return this.http.put<User>(url, JSON.stringify(user), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// delete busy from user
	deleteBusyFromUser(user: User, b: Busy): Observable<User> {
		const url = usersURL + '/' + user._id;
		// find and remove task from user if task exists
		const index: number = user.busy.findIndex(m => m._id === b._id);
		if (index !== -1) {
			user.busy.splice(index, 1);
		} else {
			// return ; //FIXME add error message
		}
		return this.http.put<User>(url, JSON.stringify(user), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// // complete task, add load, remove pending load
	// completeTaskOfuser(user: User, task: Task): Observable<User> {
	// 	const url = usersURL + '/' + user._id;
	// 	// find and remove task from user if task exists
	// 	const index: number = user.task.indexOf(task._id);
	// 	if (index !== -1) {
	// 		user.task.splice(index, 1);
	// 		user.pendingload -= task.load;
	// 		user.load += task.load;
	// 	}
	// 	return this.http.put<User>(url, JSON.stringify(user), httpOptions)
	// 	.pipe(
	// 		catchError(this.handleError)
	// 	);
	// }

	// FIXME: make it sudo
	// FIXME: add cache
	deleteUser(user: User): Observable<{}> {
		const url = usersURL + '/' + user._id;
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
