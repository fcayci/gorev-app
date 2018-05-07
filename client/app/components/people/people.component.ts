import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { Kisi } from '../../../person';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})

export class PeopleComponent implements OnInit {
  @Input() people: Kisi[];

  // FIX this model
  model : Kisi = {...};

  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private dataService:DataService,
    private location: Location) {}

  ngOnInit(): void {
    // TODO: remove this for production
    console.log('[people.component] people grabbed from db');
    this.getPeople();
  }

  getPeople() : void {
    this.dataService.getPeople()
      .subscribe(people => {
        this.people = people;
      });
  }

  addPerson() {
    var result = this.people.filter(p => p.fullname.toLowerCase() === this.model.fullname).length;
    if (result == 0) {

      // TODO: remove this for production
      console.log('[people.component.ts] Adding person');
      this.dataService.addPerson(this.model)
        .subscribe(res => {
          this.people.push(res);
        });

      setTimeout(() => this.hide(), 800);
      this.success();
    }
    else {
      // TODO: remove this for production
      console.log('[people.component.ts] Person exists');
      setTimeout(() => this.hide(), 800);
      this.success();
    }
  }

  // delete person with parameters $event and index
  deletePerson(e, i){
    // Do not propagate click to the details section
    e.stopPropagation();

    this.dataService.deletePerson(this.people[i])
        .subscribe(res => {
          this.people.splice(i, 1);
        });
  }

  onSubmit() {
    this.submitted = true;
  }

  aSuccess = false;
  aFail = false;

  success(): void {
    this.aSuccess = true;
    setTimeout(() => this.aSuccess = false, 800);
  }

  fail(): void {
    this.aFail = true;
    setTimeout(() => this.aFail = false, 800);
  }

  // Fancy stuff for modal view inside people component
  visible = false;
  visibleAnimate = false;

  show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  //TODO: remove this for production
  //get diagnostic() { return JSON.stringify(this.model); }
}
