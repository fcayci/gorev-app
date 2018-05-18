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
  assigned = false;


  title = 'Yeni Görev Oluştur';
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
    this.onPeopleChanges();
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

  onPeopleChanges() {
    this.gorevForm.get('peopleCount').valueChanges.subscribe(pc => {

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
        startDate: [moment().format("YYYY-MM-DD"), Validators.required],
        endDate: [moment().format("YYYY-MM-DD"), Validators.required],
        startTime: [moment().startOf('hour').add(1, 'hours').format("HH:mm"), Validators.required],
        endTime: [moment().startOf('hour').add(2, 'hours').format("HH:mm"), Validators.required],
      }),
      peopleCount: [1, Validators.required],
      choosenPeople: [[],],
      status: this.gstates[0]
    });
  }

  onSubmit() {
    var model = this.gorevForm.value;
    for ( let i = model.choosenPeople.length; i < model.peopleCount; i++){
      let pick : OE = this.pickKisi()
      console.log(i, 'picked', pick.fullname)
      model.choosenPeople.push(pick._id)
      this.available.splice(0, 1)
      this.notAvailable.push(pick)
    }
    console.log(' not picked', model.choosenPeople.length, model.peopleCount)

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

  pickKisi(): OE {
  //   Array.prototype.min = function(attrib) {
  //     return this.reduce(function(prev, curr){
  //         return prev[attrib] < curr[attrib] ? prev : curr;
  //     });
  //   }
  //   return this.available.min('load')
    return this.available[0]
  }

  get diagnostic() { return JSON.stringify(this.gorev); }
}
