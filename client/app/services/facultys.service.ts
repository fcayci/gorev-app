import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Faculty } from '../models/FacultyModel';
//import { Task } from '../task';

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

	cache_kisi: Faculty;
	cache_kadro: Faculty[];
	constructor(private http: HttpClient) {}

	getKadro(): Observable<Faculty[]> {
		const url = kadroUrl;
		return this.http.get<Faculty[]>(url)
		.pipe(
			catchError(this.handleError),
			//.map((res: Response) => res.json())
			//tap(Faculty[] => this.cache_kadro = Faculty[])
		);
	}

	addKisi(kisi: Faculty): Observable<Faculty> {
		const url = kadroUrl;
		return this.http.post<Faculty>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError)
		);
	}

	getKisi(kisi: Faculty): Observable<Faculty> {
		const url = kadroUrl + '/' + kisi._id;
		return this.http.get<Faculty>(url)
		.pipe(
			catchError(this.handleError),
			tap(kisi => this.cache_kisi = kisi)
		);
	}

	getKisibyId(id: string): Observable<Faculty> {
		const url = kadroUrl + '/' + id;
		return this.http.get<Faculty>(url)
		.pipe(
			catchError(this.handleError),
			tap(kisi => this.cache_kisi = kisi)
		);
	}

	updateKisi(kisi: Faculty): Observable<Faculty> {
		console.log('updating')
		console.log(kisi)
		const url = kadroUrl + '/' + kisi._id;
		return this.http.put<Faculty>(url, JSON.stringify(kisi), httpOptions)
		.pipe(
			catchError(this.handleError),
			tap(kisi => this.cache_kisi = kisi)
		);
	}



  // addTaskAndIncrementLoadToKisi(kisi: Faculty, task: Task): Observable<Faculty> {
  //   const url = kadroUrl + '/' + kisi.username + '/addtask';
  //   return this.http.put<Faculty>(url, JSON.stringify(task), httpOptions)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }
  //
  // deleteTaskAndDecrementLoadFromKisi(kisi: Faculty, task: Task): Observable<Faculty> {
  //   const url = kadroUrl + '/' + kisi.username + '/deltask';
  //   return this.http.put<Faculty>(url, JSON.stringify(task), httpOptions)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  

  deleteKisi(kisi: Faculty): Observable<{}> {
    const url = kadroUrl + '/' + kisi.username;
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
    // return throwError('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
    return throwError(error.error);
  }
}
