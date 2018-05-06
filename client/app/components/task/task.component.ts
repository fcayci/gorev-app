import { Component } from '@angular/core';
import { PasserService } from '../../services/passer.service';
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
