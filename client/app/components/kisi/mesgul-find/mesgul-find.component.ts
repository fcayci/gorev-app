import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';
import 'moment-recur-ts';

import { Zaman } from '../../../zaman';
import { BusyDataService } from '../../../services/busydata.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'mesgul-find',
  templateUrl: './mesgul-find.component.html'
})

export class MesgulFindComponent implements OnInit {

  busydb : Zaman[];
  query : Zaman;
  answer : {};
  today : string;

  interval = moment("2018-05-11 09:30")

 // FIXME: Better way to initialize todays values?
  model = {
    startDate : "2018-05-10",
    endDate  : "2018-05-10",
    startTime : "11:00",
    endTime  : "15:00"
  }

  constructor(
    private busyDataService: BusyDataService,
    private userDataService: UserService
  ) {}

  ngOnInit(): void {
    this.busyDataService.getBusyAll()
      .subscribe((res : Zaman[]) => {
        //console.log('[mesgul-find] wanted', res)
        //console.log(this.interval)
        this.busydb = res;
        this.today = new Date().toString();
    });
  }

  parseBusyInput(): void {
    this.query.startDate = new Date(this.model.startDate + 'T' + this.model.startTime).toISOString();
    this.query.endDate = new Date(this.model.endDate + 'T' + this.model.endTime).toISOString();
  }

  searchHandler(): void {
    this.parseBusyInput();
    this.answer = this.busydb.filter(this.filterByID);
    // FIXME: Ugh, Find a proper way to search with id but display with username.
    //this.userDataService.getKisi(this.answer.owner_id);
  }

  isNumber(obj) {
    return obj!== undefined && typeof(obj) === 'number' && !isNaN(obj);
  }

  filterByID(item) {
    let x = new Date('2018-06-11');
    let y = new Date('2018-06-02');

    // if (((item.startDate <= x) && (item.endDate > x)) || ((item.startDate < y) && (item.endDate >= y)))
    // {
    //   console.log('yea', item.startDate, x, item.endDate, y);
    //   //return true;
    // }
    if (item.recur){
      var interval = moment(item.startDate).recur().every(item.tor).days();
      console.log(interval)
      if (interval.matches(x)){
        console.log('yea')
        return true
      }

    }

  }

  get diagnostic() { return JSON.stringify(this.answer); }
}
