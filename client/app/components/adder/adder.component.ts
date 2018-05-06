import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Kisi } from '../../../person';
import { Router } from '@angular/router';

@Component({
  selector: 'adder',
  templateUrl: './adder.component.html',
  styles: [`
    .modal {
      background: rgba(0,0,0,0.6);
    }
  `]
})

export class AdderComponent {

  people : Kisi[];

  fullname : string;
  email : string;
  position : string;
  office : string;
  phone : string;
  mobile : string;

  constructor(private dataService:DataService, private router:Router){

    console.log('[adder.component.ts] Person component called..')
    this.dataService.getPeople()
      .subscribe(people => {
        this.people = people;
      });
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

    console.log('[adder.component.ts] ' + person);

    var result = this.people.filter(p => p.fullname.toLowerCase() === person.fullname).length;
    if (result == 0) {
      console.log('[adder.component.ts] Adding person');
      this.dataService.addPerson(person)
        .subscribe(person => {
           person = person;
           this.people.push(person);
        });
    }

    this.router.navigate(['/people']);
  }

  clearFields(){
    this.fullname = "";
    this.email = "";
  }

  public visible = false;
  public visibleAnimate = false;

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}
