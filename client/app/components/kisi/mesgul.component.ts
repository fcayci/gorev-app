import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';

import { OE } from '../../oe';
import { Zaman } from '../../zaman';
import { BusyDataService } from '../../services/busydata.service';

export class msg {
  'ok': number;
  'n' : number
}

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
  model = {
    owner_id : '',
    startDate : new Date().toISOString().substring(0,10),
    endDate  : new Date().toISOString().substring(0,10),
    startTime : '08:00',
    endTime  : '10:00',
    recur : false,
    tor : 0,
  }

  constructor(
    private _busy: BusyDataService
  ) {}

  ngOnInit(): void {
    this.getBusies();
    this.today = moment().format('LLLL (Z)');
  }

  parseBusyInput(): void {
    this.busy.startDate = new Date(this.model.startDate + 'T' + this.model.startTime);
    this.busy.endDate = new Date(this.model.endDate + 'T' + this.model.endTime);
    this.busy.owner_id = this.profile._id
    this.busy.recur = this.model.recur;
    this.busy.tor = this.model.recur ? this.model.tor : 0;
  }

  getBusies(): void {
    this._busy.getBusyByOwnerId(this.profile._id)
      .subscribe((busies : Zaman[]) => {
        this.busies = busies;
    });
  }

  addBusy(): void {
    this._busy.setBusyByOwnerId(this.busy)
      .subscribe(res => {
        console.log(res)
      });
  }

  removeBusy(s): void {
    // TODO: Remove from user's busy list as well
    this._busy.delBusyByTimeId(this.busies[s])
      .subscribe((res: msg) => {
         if (res.ok == 1){
            this.busies.splice(s,1);
         }
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

  toggleField(): void {
    this.showAddBusy = !this.showAddBusy;
  }

  get diagnostic() { return JSON.stringify(this.model); }
}
