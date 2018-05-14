import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of} from 'rxjs';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

import { OE } from '../../oe';
import { Zaman } from '../../zaman';

import { Gorev, TYPES, GSTATES } from '../../gorev';
import { BusyService } from '../../services/busy.service';
import { UserService } from '../../services/user.service';
//import { TaskService } from '../../services/task.service';


@Component({
  selector: 'gorev-add',
  templateUrl: './gorev-add.component.html',
  styleUrls: ['./gorev-add.component.css']
})

export class GorevAddComponent implements OnInit {

  kadro : OE[];
  available : OE[];
  notAvailable : OE[];
  gorevForm : FormGroup;
  gorev : Gorev;
  busytimes : Zaman[];
  gstates = GSTATES;
  positions = TYPES;


  title = 'Yeni Gorev Ekle';
  edit = true;

  constructor(
    private _fb: FormBuilder,
    private _busy: BusyService,
    private _user: UserService,
    //private _task: TaskService,
    private _router: Router,
    private _location: Location) {}

  ngOnInit() {

    this.createForm();

    this._busy.getBusyAll()
      .subscribe((res : Zaman[]) => {
        this.busytimes = res;
    });

    this._user.getKadro()
      .subscribe((kadro : OE[]) => {
        this.kadro = kadro;
      });

    this.onTimeChanges();
  }

  onTimeChanges() {
    this.gorevForm.get('time').valueChanges.subscribe(time => {
      if(time.startDate && time.endDate && time.startTime && time.endTime){
        // Get duration - will be moved to submission
        var d = this.getDuration(time.startDate, time.endDate, time.startTime, time.endTime);

        // get busy people's owner_ids
        var busies = this.findAvailable(time.startDate, time.endDate, time.startTime, time.endTime);

        // get availabe and busy people
        var people = this.getAvailableOEs(busies);
        this.available = people[0];
        this.notAvailable = people[1];
      }
      else {
        // reset arrays
        this.available = [];
        this.notAvailable = [];
      }
    },
    err => {
      console.log('ERROR');
    });

  }

  returnBackToInfinity(): void {
    this._location.back();
  }

  createForm() {
    this.gorevForm = this._fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      time: this._fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
      }),
      peopleCount: [1, Validators.required],
      choosenPeople: [],
      status: this.gstates[0]
    });
  }

  onSubmit() {
    // var gorev = this.createTask()
    // addTaskToDB(gorev);
    // addBusyToOE();
    // returnBackToInfinity();
  }

  getDuration(startDate, endDate, startTime, endTime) {
    let start = moment(startDate + 'T' + startTime);
    let end = moment(endDate + 'T' + endTime);

    if ( !end.isAfter(start) ) {
      console.log('ERROR');
    }

    let duration = moment.duration(end.diff(start));

    //return duration.format("dd:hh:mm")
    return duration.asHours()
  }

  // FIXME: UTC - GMT+3 double/triple/quadrople check.
  findAvailable(startDate, endDate, startTime, endTime) {
    const { range } = extendMoment(moment);
    const start = moment(startDate + 'T' + startTime);
    const end = moment(endDate + 'T' + endTime);

    const ids = [];

    const gorevrange = range(start, end);

    for (let busy of this.busytimes){

      if (busy.recur){
        let interval = moment(busy.startDate).recur().every(busy.tor).days();

        if (interval.matches(start)){
          // busy.startDate has the time information in it.
          let bs = moment(startDate + 'T' + moment(busy.startDate).format('HH:mm'));
          let es = moment(endDate + 'T' + moment(busy.endDate).format('HH:mm'));

          let busyrange = range(bs, es);
          if (busyrange.overlaps(gorevrange)) {
            ids.push(busy.owner_id);
          }
        }
      }
      else {
        let bs = moment(busy.startDate);
        let es = moment(busy.endDate);
        let busyrange = range(bs, es);

        if (busyrange.overlaps(gorevrange)) {
          ids.push(busy.owner_id);
        }
      }
    }

    return ids;
  }

  getAvailableOEs(busies) {
    var available: OE[] = [];
    var notAvailable: OE[] = [];
    for (let kisi of this.kadro){
      if (busies.includes(kisi._id)){
        notAvailable.push(kisi);
      }
      else {
        available.push(kisi);
      }
    }
    return [available, notAvailable];
  }


  // hede() {
  //   var candidates : OE[];

  //   var n : Gorev = {
  //     title : this.model.title,
  //     type : this.model.type,
  //     startDate : new Date(this.model.startDate + 'T' + this.model.startTime),
  //     endDate : new Date(this.model.endDate + 'T' + this.model.endTime),
  //     peopleCount : this.model.peopleCount,
  //     choosenPeople : this.model.choosenPeople,
  //     status : this.model.status
  //   }

  //   if (n.choosenPeople.length > n.peopleCount){
  //     console.log('Error, too many people for the job.')
  //   }
  //   else if (n.choosenPeople.length == n.peopleCount){
  //     console.log('Aferin')
  //   }
  //   else {
  //     // For loop until peopleCount is staisfied
  //     for (let i=0; i<n.peopleCount; i++){
  //       if (n.choosenPeople.length < n.peopleCount){
  //            this.findAvailableKadro(n.startDate, n.endDate){
  //            }
  //            // sort based on load
  //            //n.choosenPeople.push(candidates[0]);
  //       }
  //     }
  //   }

    // this._task.addTask(n)
    //   .subscribe(res => {
    // });

    // setTimeout(() => this._router.navigate(['/angarya']), 800);
  // }

  // parseBusyInput(): void {
  //   this.query.startDate = new Date(this.model.startDate + 'T' + this.model.startTime).toISOString();
  //   this.query.endDate = new Date(this.model.endDate + 'T' + this.model.endTime).toISOString();
  // }

  // searchHandler(): void {
  //   this.parseBusyInput();
  //   this.answer = this.busydb.filter(this.filterByID);
  //   // FIXME: Ugh, Find a proper way to search with id but display with username.
  //   //this.userDataService.getKisi(this.answer.owner_id);
  // }

  // isNumber(obj) {
  //   return obj!== undefined && typeof(obj) === 'number' && !isNaN(obj);
  // }

  // filterByID(item) {
  //   let x = new Date('2018-06-11');
  //   let y = new Date('2018-06-02');

  //   // if (((item.startDate <= x) && (item.endDate > x)) || ((item.startDate < y) && (item.endDate >= y)))
  //   // {
  //   //   console.log('yea', item.startDate, x, item.endDate, y);
  //   //   //return true;
  //   // }
  //   if (item.recur){
  //     var interval = moment(item.startDate).recur().every(item.tor).days();
  //     console.log(interval)
  //     if (interval.matches(x)){
  //       console.log('yea')
  //       return true
  //     }

  //   }

  // }

  get diagnostic() { return JSON.stringify(this.gorev); }
}
