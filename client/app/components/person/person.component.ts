import { Component } from '@angular/core';
import { PasserService } from '../../services/passer.service';
import { Person } from '../../../person';

@Component({
  selector: 'person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponent {

  people : Person[];

  title : string;
  shown : boolean = false;
  choosenOne : Person;

  constructor(private passerservice:PasserService){
     this.passerservice.getPeople()
       .subscribe(people => {
         this.people = people;
       });
  }

  showDetails(id){
    this.shown = true;
    this.choosenOne = this.people[id];
    //console.log(this.choosenOne);
  }
}
