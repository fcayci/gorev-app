import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { MatDatepickerModule } from '@angular/material/datepicker';
import * as moment from 'moment';

import { OE, Zaman } from '../../../../schemas';
import { BusyDataService } from '../../../services/busydata.service';

@Component({
  selector: 'mesgul',
  templateUrl: './mesgul.component.html',
  styleUrls: ['./mesgul.component.css']
})

export class MesgulComponent implements OnInit {

  @Input() profile: OE;
  @Input() edit: string;

  busydb : Zaman[];

  // FIXME: Better way to initialize todays values?
  model = {
    startDate : "2018-05-10",
    endDate  : "2018-05-10",
    startTime : "11:00",
    endTime  : "15:00",
    recur : false,
    tor : 0,
  }

  busy : Zaman = new Zaman();
  today : string;
  showAddBusy : boolean = false;

  constructor(
    private busyDataService: BusyDataService
  ) {}

  ngOnInit(): void {
    this.busyDataService.getBusyByOwnerId(this.profile._id)
      .subscribe(res => {
        //console.log('[mesgul.component] wanted', res)
        this.busydb = res;
        this.today = moment().format('LLLL (Z)');
    });
  }

  parseBusyInput(): void {
    this.busy.startDate = new Date(this.model.startDate + 'T' + this.model.startTime).toISOString();
    this.busy.endDate = new Date(this.model.endDate + 'T' + this.model.endTime).toISOString();
    this.busy.owner_id = this.profile._id;
    this.busy.recur = this.model.recur;
    this.busy.tor = this.model.recur ? this.model.tor : 0;
  }

  // Add busy to times colleciton
  addBusy(): void {
    this.busyDataService.setBusyByOwnerId(this.busy)
      .subscribe(res => {
         console.log('response from addBusy', res);
      });
  }

  adderHandler() : void {
    this.parseBusyInput();
    this.addBusy();
    this.pushBusyToUser();
    this.busydb.push(this.busy);
  }

  // FIXME: Add the busy object ot users busy field
  pushBusyToUser(): void {
    // TODO implement this
  }

  toggleAddBusyField(): void {
    this.showAddBusy = !this.showAddBusy;
  }

  //get diagnostic() { return JSON.stringify(this.busy); }
}
