import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Person } from '../../../person';

@Component({
  selector: 'dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.css']
})

export class DummyComponent {

  people : Person[];

  title : string;
  shown : boolean = false;
  choosenOne : Person;

  constructor(private dataService:DataService){
     this.dataService.getDummy()
       .subscribe(people => {
         this.people = people;
       });
  }

  showDetails(id){
    this.shown = true;
    this.choosenOne = this.people[id];
  }
}
