import { Component} from '@angular/core';
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

import { Gorev, POSITIONS, GSTATES } from '../../gorev';
import { BusyService } from '../../services/busy.service';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'gorev-add',
  templateUrl: './gorev-add.component.html',
  styleUrls: ['./gorev-add.component.css']
})

export class GorevAddComponent {

  gorevForm : FormGroup;
  gorev : Gorev;
  busytimes : Zaman[];
  gstates = GSTATES;
  positions = POSITIONS;
  available : OE[];

  title = 'Yeni Gorev Ekle';
  edit = true;

  constructor(
    private _fb: FormBuilder,
    private _busy: BusyService,
    private _router: Router,
    private _task:TaskService,
    private _location: Location) {

    this.createForm();

    this._busy.getBusyAll()
      .subscribe((res : Zaman[]) => {
        this.busytimes = res;
    });
  }

  returnBackToInfinity(): void {
    this._location.back();
  }

  createForm() {
    this.gorevForm = this._fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      // parse today, maybe pull from moments
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      peopleCount: [1, Validators.required],
      choosenPeople: [],
      status: this.gstates[0]
    });
  }

  onSubmit() {
    this.findAvailable()
    //this.gorev = this.validateTask()

  // addTask();
  // returnBackToInfinity();
  }

  // Should be complete except the FIXME's.
  // FIXME: UTC - GMT+3 double/triple/quadrople check.
  findAvailable() {
    const { range } = extendMoment(moment);

    // FIXME: this is the owner_id array. Do something with this.
    const ids = [];
    // FIXME: get the date from form.
    // const start = moment(this.gorevForm.value.startDate + 'T' + this.gorevForm.value.startTime);
    // const end = moment(this.gorevForm.value.endDate + 'T' + this.gorevForm.value.endTime);
    const start = moment('2018-05-16' + 'T' + '10:50');
    const end = moment('2018-05-16' + 'T' + '22:01');

    const gorevrange = range(start, end);
    console.log("gorevrange", gorevrange)

    for (let busy of this.busytimes){

      if (busy.recur){
        let interval = moment(busy.startDate).recur().every(busy.tor).days();

        if (interval.matches(start)){
          // FIXME: get the date from form.
          let bs = moment('2018-05-16' + 'T' + moment(busy.startDate).format('HH:mm'));
          let es = moment('2018-05-16' + 'T' + moment(busy.endDate).format('HH:mm'));
          console.log(bs, es)

          let busyrange = range(bs, es);
          if (!busyrange.overlaps(gorevrange)) {
            ids.push(busy.owner_id);
            console.log('recur1 doesnt overlap', busy._id)
          } else { console.log('recur1 overlaps', busy._id)
          }
        }
        else {
          console.log('recur2 doesnt overlap', busy._id)
        }
      }
      else {
        let bs = moment(busy.startDate);
        let es = moment(busy.endDate);
        let busyrange = range(bs, es);

        if (!busyrange.overlaps(gorevrange)) {
          ids.push(busy.owner_id);
          console.log('doesnt overlap', busy._id)
        } else { console.log('overlaps', busy._id)
        }
      }
    }
  }

  validateTask(): Gorev {
    const formModel = this.gorevForm.value;
    const start = moment(formModel.startDate + 'T' + formModel.startTime);
    const end = moment(formModel.endDate + 'T' + formModel.endTime);

    if ( !end.isAfter(start) ) {
      console.log('ERROR');
    }

    var duration = moment.duration(end.diff(start));

    console.log(duration.asHours())
    console.log(duration.format("dd:hh:mm"))

    console.log(duration);

    const n: Gorev = {
      title : formModel.title,
      type: formModel.type,
      startDate: start.format(),
      endDate: end.format(),
      duration: duration,
      peopleCount: formModel.peopleCount,
      status: formModel.status,
      choosenPeople: []
    }

    // // deep copy of form model
    // const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
    //   (address: Address) => Object.assign({}, address)
    // );

    return n;
  }

  hede() {
    var candidates : OE[];

    var n : Gorev = {
      title : this.model.title,
      type : this.model.type,
      startDate : new Date(this.model.startDate + 'T' + this.model.startTime),
      endDate : new Date(this.model.endDate + 'T' + this.model.endTime),
      peopleCount : this.model.peopleCount,
      choosenPeople : this.model.choosenPeople,
      status : this.model.status
    }

    if (n.choosenPeople.length > n.peopleCount){
      console.log('Error, too many people for the job.')
    }
    else if (n.choosenPeople.length == n.peopleCount){
      console.log('Aferin')
    }
    else {
      // For loop until peopleCount is staisfied
      for (let i=0; i<n.peopleCount; i++){
        if (n.choosenPeople.length < n.peopleCount){
             this.findAvailableKadro(n.startDate, n.endDate){
             }
             // sort based on load
             //n.choosenPeople.push(candidates[0]);
        }
      }
    }

    // this._task.addTask(n)
    //   .subscribe(res => {
    // });

    // setTimeout(() => this._router.navigate(['/angarya']), 800);
  }

  findAvailableKadro(start, end){
    // Query busy collection
    // Find available set
    // Query users for the given owner_id
    // Create a variable for that.
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

  get diagnostic() { return JSON.stringify(this.gorev); }
}
