import { Component } from '@angular/core';
import { Person, Kisi } from '../../../person';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})

export class PeopleComponent {

  people : Kisi[];

  constructor(private dataService:DataService){
     this.dataService.getPeople()
       .subscribe(people => {
         this.people = people;
       });
  }

}
