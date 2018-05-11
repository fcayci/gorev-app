import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'SUPERSECRET'
  })
};

@Injectable({
  providedIn: 'root',
})
export class UserDataService {

  constructor(private http: HttpClient) {
    console.log('[userdata.service.ts] User Data service initialized...');
  }

  // get a single kisi by passing username as an argument
  getKisi(username){
    return this.http.get('http://localhost:4200/api/kadro/' + username)
 //     .map(res => res.json());
  }

  // get all kadro in the db
  getKadro(){
    return this.http.get('http://localhost:4200/api/kadro')
      .pipe(
        catchError(this.handleError)
      );
  }

  // add a kisi to the db by passing the kisi object
  addKisi(kisi){
    console.log('[userdata.service] creating', kisi);
    return this.http.post('http://localhost:4200/api/kadro', JSON.stringify(kisi), httpOptions)
 //     .map(res => res.json());
  }

  // delete a kisi by passing the kisi
  deleteKisi(kisi){
    return this.http.delete('http://localhost:4200/api/kadro/' + kisi.username)
 //     .map(res => res.json());
  }

  // update kisi
  updateKisi(kisi){
    console.log('[userdata.service] updating', kisi);
    return this.http.put('http://localhost:4200/api/kadro/' + kisi.username, JSON.stringify(kisi), httpOptions)
//      .map(res => res.json());
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