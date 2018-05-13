import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of} from 'rxjs';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';

import { OE } from '../../oe';
import { Gorev, POSITIONS, GSTATES } from '../../gorev';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'gorev-add',
  templateUrl: './gorev-add.component.html',
  styleUrls: ['./gorev-add.component.css']
})

export class GorevAddComponent {

  gorevForm : FormGroup;
  gorev : Gorev;
  gstates = GSTATES;
  positions = POSITIONS;
  available : OE[];

  title = 'Yeni Gorev Ekle';
  edit = true;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _task:TaskService,
    private _location: Location) {

    this.createForm();
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
    this.gorev = this.validateTask()

  // addTask();
  // returnBackToInfinity();
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
