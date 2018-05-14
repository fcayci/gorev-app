import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';

import { OE } from '../../oe';
import { Zaman } from '../../zaman';
import { BusyService } from '../../services/busy.service';

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
  today : string;
  showAddBusy : boolean = false;

  model = {
    owner_id : '',
    startDate : moment().format("YYYY-MM-DD"),
    endDate  : moment().format("YYYY-MM-DD"),
    startTime : moment().startOf('hour').add(1, 'hours').format("HH:mm"),
    endTime  : moment().startOf('hour').add(2, 'hours').format("HH:mm"),
    recur : false,
    tor : 0,
  }

  constructor(
    private _busy: BusyService
  ) {}

  ngOnInit(): void {
    this.getBusies();
    this.today = moment().format('LLLL (Z)');
  }

  getBusies(): void {
    this._busy.getBusyByOwnerId(this.profile._id)
      .subscribe((busies : Zaman[]) => {
        this.busies = busies;
    });
  }

  onSubmit() : void {
    const busy : Zaman = this.parseBusyInput();
    this.addBusyToOwner(busy);
    this.pushBusyToUser(busy);
  }

  parseBusyInput(): Zaman {
    var busy : Zaman = {
      startDate : '',
      endDate : '',
      owner_id : '',
      recur : false,
      tor : 0,
    };

    busy.startDate = moment(this.model.startDate + 'T' + this.model.startTime).format();
    busy.recur = this.model.recur;
    if (busy.recur) {
      busy.endDate = moment(this.model.startDate + 'T' + this.model.endTime).format();
    } else {
      busy.endDate = moment(this.model.endDate + 'T' + this.model.endTime).format();
    }
    busy.owner_id = this.profile._id
    busy.tor = this.model.recur ? this.model.tor : 0;

    if (busy.recur && !busy.tor) {
        console.log('ERROR')
    }

    return busy
  }

  addBusyToOwner(b): void {
    this._busy.setBusyByOwnerId(b)
      .subscribe(res => {
        this.busies.push(res);
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

  // FIXME: Add the busy object ot users busy field
  pushBusyToUser(busy): void {
    // TODO implement this
  }

  toggleField(): void {
    this.showAddBusy = !this.showAddBusy;
  }

  get diagnostic() { return JSON.stringify(this.model); }
}
