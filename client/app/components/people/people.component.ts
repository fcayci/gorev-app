import { Component } from '@angular/core';
import { Person, Kisi } from '../../../person';

import { PasserService } from '../../services/passer.service';

@Component({
  selector: 'people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})

export class PeopleComponent {

  people : Kisi[];

  constructor(private passerservice:PasserService){
     this.passerservice.getPeople()
       .subscribe(people => {
         this.people = people;
         console.log(this.people);
       });
  }

  addPerson(){
    //this.router.navigate[('person')];
  }

  addPersondummy(){
    var p = {
      fullname : "hede",
    }

    this.people.push(p);
  }

}
