import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';

import { BusyService } from '../../services/busy.service';
import { Zaman, REPEATS } from '../../zaman';

@Component({
  selector: 'mesgul-add',
  templateUrl: './mesgul-add.component.html'
})

export class MesgulAddComponent implements OnInit  {

  busyForm : FormGroup;
  repeats = JSON.parse(JSON.stringify(REPEATS));
  tor = [0, 1, 7];

  constructor(
    public dialogRef: MatDialogRef<MesgulAddComponent>,
    private _fb: FormBuilder) {}

  ngOnInit() {
    moment.locale('tr');
    const day = moment().format('dddd');
    this.repeats[2] = REPEATS[2] + ' ' +  day;
    this.createForm();
  }

  // Prevent Saturday and Sunday from being selected.
  weekendFilter = (d: Date): boolean => {
    const day = moment(d).format('E')
    return day !== '6' && day !== '7';
  }

  createForm() {
    this.busyForm = this._fb.group({
      title: ['', Validators.required],
      startDate: [ moment().startOf('day').format(), Validators.required],
      endDate: [ moment().startOf('day').format(), Validators.required],
      startTime: [ moment().startOf('hour').add(1,'hours').format('HH:mm'), Validators.required],
      endTime: [ moment().startOf('hour').add(3,'hours').format('HH:mm'), Validators.required],
      recur: [ 0, Validators.required],
    });
  }

  updateDay(e){
    const day = e.value.format('dddd');
    this.repeats[2] = REPEATS[2] + ' ' +  day
  }


  onNoClick(): void {
    // var x = this.busyForm.value;
    // console.log( moment(x.startDate).recur().every(1).days())
    // console.log( moment(x.startDate).recur(x.endDate).every(7).days())


    // var sd = moment(x.startDate).dateOnly()
    // var ed = moment(x.endDate).dateOnly()

    // console.log('sd', sd)
    // console.log('ed', ed)

    // sd = sd.add(x.startTime.slice(0,2), 'h');
    // sd = sd.add(x.startTime.slice(-2), 'm');
    // ed = ed.add(x.endTime.slice(0,2), 'h');
    // ed = ed.add(x.endTime.slice(-2), 'm');


    // var duration = moment.duration(ed.diff(sd));
    // console.log(Math.ceil(duration.asDays()), 'day repeats')
    // console.log(Math.ceil(duration.asWeeks()), 'week repeats')
    this.dialogRef.close();
  }

  onSubmit() {
    // TODO: can add a validator here.
    //const busy = this.parseForm(this.busyForm.value);
    this.dialogRef.close(this.busyForm.value);
  }
}
