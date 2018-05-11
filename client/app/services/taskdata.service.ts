import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'SUPERSECRET'
  })
};

@Injectable({
  providedIn: 'root',
})
export class TaskDataService {

  constructor(private http:HttpClient) {
    console.log('[taskdata.service.ts] Task Data service initialized...');
  }

  // get all angarya in the db
  getAllTasks(){
    return this.http.get('http://localhost:4200/api/angarya')
 //     .map(res => res.json());
  }

  // get a single task by passing username as an argument
  getTasksByOwnerId(id){
    return this.http.get('http://localhost:4200/api/angarya/' + id)
 //     .map(res => res.json());
  }

  // add a task to the db by passing the task object
  addTask(task){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    console.log('[taskdata.service] creating', task);
    return this.http.post('http://localhost:4200/api/angarya', JSON.stringify(task), httpOptions)
 //     .map(res => res.json());
  }
}