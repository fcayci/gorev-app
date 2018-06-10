import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

import { Faculty } from '../../faculty';
import { Busy } from '../../busy';

import { Task, TYPES, GSTATES } from '../../task';
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
  choosenPeople : Faculty[];

  busytimes : Busy[];
  gorevForm : FormGroup;
  peopleForm : FormGroup;

  duration : any = 2;
  gorev : Task;
  gstates = GSTATES;
  types = TYPES;
  assigned = false;
  numbers;
  weights;

  title = 'Yeni Görev Oluştur';

  constructor(
    private _fb: FormBuilder,
    private _user: UserService,
    private _busy: BusyService) {
  }

  ngOnInit() {
    this.numbers = Array(7).fill(0).map((x,i)=>i+1);
    this.weights = Array(12).fill(0).map((x,i)=>(i+1)/4);
    this.choosenPeople = [];

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
    this.onPeopleChanges();
  }

  addToChoosenPeople() {
    let p = this.peopleForm.value.selectedPerson;
    if(this.choosenPeople.indexOf(p) === -1) {
      this.choosenPeople.push(p);
    }

    // Remove choosen from available
    var index = this.available.indexOf(p, 0);
    if (index > -1) {
      this.available.splice(index, 1);
    }
    // Disable form if good to go.
    if (this.gorevForm.value.peopleCount == this.choosenPeople.length) {
      this.peopleForm.controls['selectedPerson'].disable();
    }

    // Reset form
    this.peopleForm.value.selectedPerson = '';
  }

  removeFromChoosenPeople(p) {
    // Remove choosen from available
    var index = this.choosenPeople.indexOf(p, 0);
    if (index > -1) {
      this.choosenPeople.splice(index, 1);
    }

    this.available.push(p);

    // Enable form
    this.peopleForm.controls['selectedPerson'].enable();

    // Reset form
    this.peopleForm.value.selectedPerson = '';
  }


  autoAssignPeople() {

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


  // onSubmit() {
  //   var model = this.gorevForm.value;
  //   for ( let i = model.choosenPeople.length; i < model.peopleCount; i++){
  //     let pick : Faculty = this.pickKisi()
  //     console.log(i, 'picked', pick.fullname)
  //     model.choosenPeople.push(pick._id)
  //     this.available.splice(0, 1)
  //     this.notAvailable.push(pick)
  //   }
  //   console.log(' not picked', model.choosenPeople.length, model.peopleCount)

  //   // var gorev = this.createTask()
  //   // addTaskToDB(gorev);
  //   // addBusyToOE();
  //   // returnBackToInfinity();
  // }

  // INITIALIZERS
  createGorevForm() {
    this.gorevForm = this._fb.group({
      title: ['asdf', Validators.required],
      type: ['asdf', Validators.required],
      time: this._fb.group({
        gDate: [ moment().startOf('day').format(), Validators.required],
        startTime: [ moment().startOf('hour').add(1,'hours').format('HH:mm'), Validators.required],
        endTime: [ moment().startOf('hour').add(3,'hours').format('HH:mm'), Validators.required]
      }),
      weight: [1, Validators.required],
      peopleCount: [1, [Validators.required, Validators.pattern('[1-7]')]],
      duration: [2, [Validators.required, Validators.pattern('[0-9]{1,2}')]]
    });
  }

  createPeopleForm() {
    this.peopleForm = this._fb.group({
      selectedPerson: [{disabled: false}],
    });
  }

  onTimeChanges() {
    this.gorevForm.get('time').valueChanges.subscribe(t => {
      if(t.gDate && t.startTime && t.endTime){
        this.parseTimeandFindAvailable(t);
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
      var t = this.gorevForm.value.time;
      if(t.gDate && t.startTime && t.endTime){
        this.parseTimeandFindAvailable(t);
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

  parseTimeandFindAvailable(t){
    // Get the dates as is. if .dateOnly() method is used, we lose timezone.
    var sd = moment(t.gDate)
    var ed = moment(t.gDate)

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

    let NAids = this.findBusies(sd, ed);

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
  }

  findBusies(gs, ge) {
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
}
