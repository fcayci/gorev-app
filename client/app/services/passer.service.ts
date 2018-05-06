import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class PasserService{
  constructor(private http:Http) {
    console.log('[passer.service.ts] Passer service initialized...');
  }

  getPeople(){
    return this.http.get('http://localhost:4200/api/people')
      .map(res => res.json());
  }

  getDummy(){
    return this.http.get('http://localhost:4200/api/dummy')
      .map(res => res.json());
  }

  addPerson(person){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:4200/api/people', JSON.stringify(person), {headers: headers})
      .map(res => res.json());
  }

}