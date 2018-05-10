import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class TaskDataService {

  constructor(private http:Http) {
    console.log('[taskdata.service.ts] Task Data service initialized...');
  }

  // get all kadro in the db
  getAllTasks(){
    return this.http.get('http://localhost:4200/api/tasks')
      .map(res => res.json());
  }

  // get a single kisi by passing username as an argument
  getTasksByOwnerId(id){
    return this.http.get('http://localhost:4200/api/tasks/' + id)
      .map(res => res.json());
  }

}