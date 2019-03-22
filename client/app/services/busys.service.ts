import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Busy } from '../models/BusyModel';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type':  'application/json',
		'Authorization': 'SUPERSECRET'
	})
};

const busyUrl = '/api/mesgul';

@Injectable({
	providedIn: 'root',
})
export class BusyService {

	cahce_busies:Busy[];
	constructor(private http:HttpClient) {}

	getBusyAll(): Observable<Busy[]>{
		let url = busyUrl;
		return this.http.get<Busy[]>(url)
		.pipe(
			catchError(this.handleError)
		);
	}

	// get buys object by given id
	getBusy(id: string): Observable<Busy>{
		let url = busyUrl + '/' + id;
		return this.http.get<Busy>(url)
		.pipe(
			catchError(this.handleError)
		);
	}

	getFacultyBusyTimes(ownerid: string): Observable<Busy[]>{
		let url = busyUrl + '/user/' + ownerid;
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

	// add busy to db
	setBusy(busy: Busy): Observable<Busy>{
		let url = busyUrl
		return this.http.post<Busy>(url, JSON.stringify(busy), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	// delete busy from db
	deleteBusy(busy: Busy): Observable<{}>{
		let url = busyUrl + '/' + busy._id;
		return this.http.delete(url)
		.pipe(
			catchError(this.handleError)
		);
	}

	// FIXME: move this to handlers
	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
			`Backend returned code ${error.status}, ` +
			`body was: ${JSON.stringify(error.error)}`);
		}
		// return an observable with a user-facing error message
		return throwError(
			'Something bad happened; please try again later.');
	};

}
