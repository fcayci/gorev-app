import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { OE } from '../../../ogretimelemani';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  @Input() users: OE[];

  // FIX this model
  model : OE = {...};

  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private dataService:DataService,
    private location: Location) {}

  ngOnInit(): void {
    // TODO: remove this for production
    console.log('[users.component] users grabbed from db');
    this.getUsers();
  }

  getUsers() : void {
    this.dataService.getUsers()
      .subscribe(users => {
        this.users = users;
      });
  }

  addUser() {
    var result = this.users.filter(p => p.fullname.toLowerCase() === this.model.fullname).length;
    if (result == 0) {

      // TODO: remove this for production
      console.log('[users.component.ts] Adding user');
      this.dataService.addUser(this.model)
        .subscribe(res => {
          this.users.push(res);
        });

      setTimeout(() => this.hide(), 800);
      this.success();
    }
    else {
      // TODO: remove this for production
      console.log('[users.component.ts] User exists');
      setTimeout(() => this.hide(), 800);
      this.success();
    }
  }

  // delete user with parameters $event and index
  deleteUser(e, i){
    // Do not propagate click to the details section
    e.stopPropagation();

    this.dataService.deleteUser(this.users[i])
        .subscribe(res => {
          this.users.splice(i, 1);
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

  // Fancy stuff for modal view inside users component
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
