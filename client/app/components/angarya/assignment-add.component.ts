import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

import { Faculty } from '../../faculty';
import { Busy } from '../../busy';

import { Task, TYPES, GSTATES } from '../../Task';
import { BusyService } from '../../services/busy.service';
import { UserService } from '../../services/user.service';
//import { TaskService } from '../../services/task.service';

@Component({
  selector: 'assignment-add',
  templateUrl: './assignment-add.component.html'
})

export class AssignmentAddComponent implements OnInit {

  kadro : Faculty[];
  available : Faculty[];
  notAvailable : Faculty[];
  busytimes : Busy[];
  gorevForm : FormGroup;
  peopleForm : FormGroup;

  duration : any = 2;
  gorev : Task;
  gstates = GSTATES;
  types = TYPES;
  assigned = false;
  numbers;

  title = 'Yeni Görev Oluştur';
  edit = true;

  constructor(
      private _fb: FormBuilder,
      private _user: UserService,
      private _busy: BusyService) {
    this.numbers = Array(7).fill(0).map((x,i)=>i+1);
  }

  ngOnInit() {
    this.createGorevForm();
    this.createPeopleForm();

    this._busy.getBusyAll()
      .subscribe((res : Busy[]) => {
        this.busytimes = res;
    });

    this._user.getKadro()
      .subscribe((kadro : Faculty[]) => {
        this.kadro = kadro;
    });

    this.onTimeChanges();
  }

  hede() {
    console.log('clicked');
  }

  createGorevForm() {
    this.gorevForm = this._fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      time: this._fb.group({
        startDate: [ moment().startOf('day').format(), Validators.required],
        endDate: [ moment().startOf('day').format(), Validators.required],
        startTime: [ moment().startOf('hour').add(1,'hours').format('HH:mm'), Validators.required],
        endTime: [ moment().startOf('hour').add(3,'hours').format('HH:mm'), Validators.required]
      }),
      duration: [2, [Validators.required, Validators.pattern('[0-9]{1,2}')]]
    });
  }

  createPeopleForm() {
    this.peopleForm = this._fb.group({,
      peopleCount: [, [Validators.required, Validators.pattern('[1-7]')]],
      choosenPeople: [[], Validators.required],
      status: [0, Validators.required]
    });
  }

  onTimeChanges() {
    console.log('clicked');
    //let t = this.gorevForm.value.time;
    this.gorevForm.get('time').valueChanges.subscribe(t => {
      if(t.startDate && t.endDate && t.startTime && t.endTime){
        console.log('onTimeChange')
        // Get the dates as is. if .dateOnly() method is used, we lose timezone.
        var sd = moment(t.startDate)
        var ed = moment(t.endDate)

        // Make sure dates are the same or end is bigger
        if (sd.isAfter(ed)){
          console.log('ERROR');
          return -1
        }

        // Combine the date & times
        sd = sd.add(t.startTime.slice(0,2), 'h');
        sd = sd.add(t.startTime.slice(-2), 'm');
        ed = ed.add(t.endTime.slice(0,2), 'h');
        ed = ed.add(t.endTime.slice(-2), 'm');

        // Make sure start date is after end.
        if (sd.isSameOrAfter(ed)){
          console.log('ERROR');
          return -1
        }

        // Get duration
        var d = moment.duration(ed.diff(sd)).humanize();

        // Update duration
        this.duration = d;

        let NAids = this.findAvailable(sd, ed);

        this.notAvailable = [];
        this.available = [];

        for (let k of this.kadro ){
          // If kisi id is not in NAids, add to available
          if (NAids.indexOf(k._id) === -1){
            this.available.push(k)
          } else {
            this.notAvailable.push(k)
          }
        }

        console.log('NA', this.notAvailable);
        console.log('AA', this.available);

        // get availabe and busy people
        //var people = this.getAvailableOEs(busies);
        //this.available = people[0];
        //this.notAvailable = people[1];

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

  onSubmit() {
    var model = this.gorevForm.value;
    for ( let i = model.choosenPeople.length; i < model.peopleCount; i++){
      let pick : Faculty = this.pickKisi()
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

  findAvailable(gs, ge) {
    const { range } = extendMoment(moment);

    // Not availables
    var NAs = [];
    var gorevrange = range(gs, ge);

    for (let busy of this.busytimes){

      if (busy.recur){
        let interval = moment(busy.startDate).recur().every(busy.recur).days();

        if (interval.matches(gs)){

          // Since this is an interval, we need to create the exact date for checking.
          let bs = moment(gs.format('YYYY-MM-DD') + 'T' + moment(busy.startDate).format('HH:mm'));
          let be = moment(ge.format('YYYY-MM-DD') + 'T' + moment(busy.endDate).format('HH:mm'));
          let busyrange = range(bs, be);

          if (busyrange.overlaps(gorevrange)) {
            if(NAs.indexOf(busy.owner_id) === -1) {
              NAs.push(busy.owner_id);
            }
          }
        }
      }
      else {
        let bs = moment(busy.startDate);
        let be = moment(busy.endDate);
        let busyrange = range(bs, be);

        if (busyrange.overlaps(gorevrange)) {
          if(NAs.indexOf(busy.owner_id) === -1) {
            NAs.push(busy.owner_id);
          }
        }
      }
    }
    return NAs;
  }

  getAvailableOEs(busies) {
    var available: Faculty[] = [];
    var notAvailable: Faculty[] = [];
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

  pickKisi(): Faculty {
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
