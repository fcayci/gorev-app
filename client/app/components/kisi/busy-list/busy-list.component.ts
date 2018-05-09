import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { OE, Zaman } from '../../../../schemas';
import { UserDataService } from '../../../services/userdata.service';


@Component({
  selector: 'busy-list',
  templateUrl: './busy-list.component.html',
  styleUrls: ['./busy-list.component.css']
})

export class BusyListComponent implements OnInit {

  // @Input() kisi: OE;
  // zmodel = {};

  // __kisi = {};
  // fullname = null;

  // title = "null";
  // edit = false;

  // // TODO: for testing purposes
  // busy = ['a','b','c','e','f','g','h'];
  // tasks = ['a','b','c','e','f'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private location: Location) {}

  ngOnInit(): void {
    // this.zmodel =  new Zaman();
    // this.getKisi();
  }

  // getKisi(): void {
  //   const username = this.route.snapshot.paramMap.get('id');
  //   this.userDataService.getKisi(username)
  //     .subscribe(kisi => {
  //       this.kisi = kisi;
  //       this.fullname = this.kisi.fullname;
  //       this.__kisi = JSON.parse(JSON.stringify(this.kisi));
  //   });
  // }

  // updateKisi(): void {
  //   this.userDataService.updateKisi(this.kisi)
  //     .subscribe(res => {
  //       console.log(res);
  //       this.fullname = this.kisi.fullname;
  //       this.__kisi = JSON.parse(JSON.stringify(this.kisi));
  //     });
  //   this.showEdit();
  // }

  // addBusy(){
  //   if (this.zmodel.allDay){
  //     this.zmodel.dateEnd = this.zmodel.dateStart;
  //     this.zmodel.timeStart = "08:00";
  //   }

  // }

  // // go back to original form when hit cancel.
  // resetKisi(): void {
  //   this.kisi = JSON.parse(JSON.stringify(this.__kisi));
  //   this.showEdit();
  // }

  // showEdit(){
  //   this.edit = !this.edit;
  // }

  // goBack(){
  //   this.location.back();
  // }

  // // Fancy stuff for modal view inside users component
  // aSuccess = false;
  // aFail = false;

  // success(): void {
  //   this.aSuccess = true;
  //   setTimeout(() => this.aSuccess = false, 800);
  // }

  // fail(): void {
  //   this.aFail = true;
  //   setTimeout(() => this.aFail = false, 800);
  // }

  // visible = false;
  // visibleAnimate = false;

  // show(): void {
  //   this.visible = true;
  //   setTimeout(() => this.visibleAnimate = true, 100);
  // }

  // hide(): void {
  //   this.visibleAnimate = false;
  //   setTimeout(() => this.visible = false, 300);
  // }

  // onContainerClicked(event: MouseEvent): void {
  //   if ((<HTMLElement>event.target).classList.contains('modal')) {
  //     this.hide();
  //   }
  // }

  // get diagnostic() { return JSON.stringify(this.zmodel); }
}
