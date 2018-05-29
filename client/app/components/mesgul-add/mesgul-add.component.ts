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
    private _busy: BusyService,
    public dialogRef: MatDialogRef<MesgulAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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

  addBusyToOwner(b): void {
    this._busy.setBusyByOwnerId(b)
      .subscribe(res => {
        // this.openSnackBar(res.title + ' başarıyla eklendi.')
      });
  }

  // FIXME: Add the busy object ot users busy field
  pushBusyToUser(busy): void {
    // TODO implement this
  }

  parseForm(f){
    // Get the dates as is. if .dateOnly() method is used, we lose timezone.
    var sd = moment(f.startDate)
    var ed = moment(f.endDate)

    // Make sure dates are the same or end is bigger
    if (sd.isAfter(ed)){
      return -1
    }

    sd = sd.add(f.startTime.slice(0,2), 'h');
    sd = sd.add(f.startTime.slice(-2), 'm');
    ed = ed.add(f.endTime.slice(0,2), 'h');
    ed = ed.add(f.endTime.slice(-2), 'm');

    // Make sure start date is after end.
    if (sd.isSameOrAfter(ed)){
      return -1
    }

    var model : Zaman = {
      title : f.title,
      startDate : sd.format(),
      endDate : ed.format(),
      owner_id : this.data._id,
      recur : f.recur
    };

    return model;
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
    const busy = this.parseForm(this.busyForm.value);
    if (busy != -1){
      this.addBusyToOwner(busy);
      this.dialogRef.close(this.busyForm.value);
    }
    else {
      this.dialogRef.close(-1);
    }
  }
}
