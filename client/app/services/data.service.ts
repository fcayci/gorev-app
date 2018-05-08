import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  constructor(private http:Http) {
    console.log('[data.service.ts] Data service initialized...');
  }

  // get a single kisi by passing username as an argument
  getKisi(username){
    return this.http.get('http://localhost:4200/api/kadro/' + username)
      .map(res => res.json());
  }

  // get all kadro in the db
  getKadro(){
    return this.http.get('http://localhost:4200/api/kadro')
      .map(res => res.json());
  }

  // add a kisi to the db by passing the kisi object
  addKisi(kisi){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    console.log('[data.service]. ' + kisi);
    return this.http.post('http://localhost:4200/api/kadro', JSON.stringify(kisi), {headers: headers})
      .map(res => res.json());
  }

  // delete a kisi by passing the kisi
  deleteKisi(kisi){
    return this.http.delete('http://localhost:4200/api/kadro/' + kisi.username)
      .map(res => res.json());
  }

  // update kisi
  updateKisi(kisi){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put('http://localhost:4200/api/kadro/' + kisi.username, JSON.stringify(kisi), {headers: headers})
      .map(res => res.json());
  }

}