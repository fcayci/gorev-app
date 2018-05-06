import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Kisi } from '../../../person';
import { Router } from '@angular/router';

@Component({
  selector: 'adder',
  templateUrl: './adder.component.html',
  styleUrls: ['./adder.component.css']
})

export class AdderComponent {

  fullname : string;
  email : string;
  position : string;
  office : string;
  phone : string;
  mobile : string;

  constructor(private dataService:DataService, private router:Router){

    console.log('[adder.component.ts] Person component called..')
    // this.dataService.addPerson()
    //   .subscribe(person => {
    //     this.person;
    // });
  }


  addPerson() {
    var person : Kisi = {
      //username : 'hede',
      //password : 'secret',
      fullname : this.fullname,
      email : this.email
      //position : this.position,
      //office : this.office,
      //phone : this.phone,
      //mobile : this.mobile,
      //load : 32,
      //busy : null,
      //vacation : false
    }

    console.log(person);

    this.dataService.addPerson(person)
      .subscribe(person => {
         person = person;
      });

    // this.router.navigate(['/people']);
  }

  clearFields(){
    this.fullname = "";
    this.email = "";
  }
}
