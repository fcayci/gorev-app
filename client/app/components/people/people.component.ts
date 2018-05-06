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
  showAdd : boolean = false;

  constructor(private dataService:DataService){
    this.dataService.getPeople()
      .subscribe(people => {
        this.people = people;
      });
  }

  addPerson() {
    this.showAdd = !this.showAdd;

    // var person : Kisi = {
    //   //username : 'hede',
    //   //password : 'secret',
    //   fullname : this.fullname,
    //   email : this.email
    //   //position : this.position,
    //   //office : this.office,
    //   //phone : this.phone,
    //   //mobile : this.mobile,
    //   //load : 32,
    //   //busy : null,
    //   //vacation : false
    // }

    // console.log('[adder.component.ts] ' + person);

    // var result = this.people.filter(p => p.fullname.toLowerCase() === person.fullname).length;
    // if (result == 0) {
    //   console.log('[adder.component.ts] Adding person');
    //   this.dataService.addPerson(person)
    //     .subscribe(person => {
    //        person = person;
    //        this.people.push(person);
    //     });
    // }
  }

  // clearFields(){
  //   this.fullname = "";
  //   this.email = "";
  // }
}
