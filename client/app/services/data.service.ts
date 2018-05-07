import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  constructor(private http:Http) {
    console.log('[data.service.ts] Data service initialized...');
  }

  // get a single person by passing id as an argument
  getPerson(id){
    return this.http.get('http://localhost:4200/api/people/' + id)
      .map(res => res.json());
  }

  // get all people in the db
  getPeople(){
    return this.http.get('http://localhost:4200/api/people')
      .map(res => res.json());
  }

  // add a person to the db by passing the kisi object
  addPerson(person){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    console.log('[data.service]. ' + person);
    return this.http.post('http://localhost:4200/api/people', JSON.stringify(person), {headers: headers})
      .map(res => res.json());
  }

  // delete a person by passing the person
  deletePerson(person){
    return this.http.delete('http://localhost:4200/api/people/' + person._id)
      .map(res => res.json());
  }

  // update person
  updatePerson(person){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put('http://localhost:4200/api/people/' + person._id, JSON.stringify(person), {headers: headers})
      .map(res => res.json());
  }

}