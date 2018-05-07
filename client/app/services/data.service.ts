import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  constructor(private http:Http) {
    console.log('[data.service.ts] Data service initialized...');
  }

  // get a single user by passing id as an argument
  getUser(id){
    return this.http.get('http://localhost:4200/api/users/' + id)
      .map(res => res.json());
  }

  // get all users in the db
  getUsers(){
    return this.http.get('http://localhost:4200/api/users')
      .map(res => res.json());
  }

  // add a user to the db by passing the kisi object
  addUser(user){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    console.log('[data.service]. ' + user);
    return this.http.post('http://localhost:4200/api/users', JSON.stringify(user), {headers: headers})
      .map(res => res.json());
  }

  // delete a user by passing the user
  deleteUser(user){
    return this.http.delete('http://localhost:4200/api/users/' + user._id)
      .map(res => res.json());
  }

  // update user
  updateUser(user){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put('http://localhost:4200/api/users/' + user._id, JSON.stringify(user), {headers: headers})
      .map(res => res.json());
  }

}