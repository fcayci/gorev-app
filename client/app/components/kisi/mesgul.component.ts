import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';

import { OE } from '../../oe';
import { Zaman } from '../../zaman';
import { BusyDataService } from '../../services/busydata.service';

@Component({
  selector: 'mesgul',
  templateUrl: './mesgul.component.html'
})

export class MesgulComponent implements OnInit {

  @Input() profile: OE;
  @Input() edit: string;

  busies : Zaman[];
  busy : Zaman = {...};
  today : string;
  showAddBusy : boolean = false;

  // FIXME: Better way to initialize todays values?
  model : Zaman = {
    owner_id : '',
    startDate : new Date("2018-05-10"),
    endDate  : new Date("2018-05-10"),
    startTime : "11:00",
    endTime  : "15:00",
    recur : false,
    tor : 0,
  }

  constructor(
    private _busy: BusyDataService
  ) {}

  ngOnInit(): void {
    this._busy.getBusyByOwnerId(this.profile._id)
      .subscribe((busies : Zaman[]) => {
        this.busies = busies;
    });

    this.today = moment().format('LLLL (Z)');

  }

  parseBusyInput(): void {
    this.busy.startDate = new Date(this.model.startDate + 'T' + this.model.startTime);
    this.busy.endDate = new Date(this.model.endDate + 'T' + this.model.endTime);
    this.busy.owner_id = this.profile._id
    this.busy.recur = this.model.recur;
    this.busy.tor = this.model.recur ? this.model.tor : 0;
  }

  // Add busy to times colleciton
  addBusy(): void {
    this._busy.setBusyByOwnerId(this.busy)
      .subscribe(res => {
         console.log('response from addBusy', res);
      });
  }

  adderHandler() : void {
    this.parseBusyInput();
    this.addBusy();
    this.pushBusyToUser();
    this.busies.push(this.busy);
  }

  // FIXME: Add the busy object ot users busy field
  pushBusyToUser(): void {
    // TODO implement this
  }

  toggleAddBusyField(): void {
    this.showAddBusy = !this.showAddBusy;
  }

  get diagnostic() { return JSON.stringify(this.model); }
}
