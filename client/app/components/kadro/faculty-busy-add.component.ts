import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';

import { BusyService } from '../../services/busy.service';
import { Busy, REPEATS } from '../../busy';

@Component({
  selector: 'faculty-busy-add',
  templateUrl: './faculty-busy-add.component.html'
})

export class FacultyBusyAddComponent implements OnInit  {

  busyForm: FormGroup;
  repeats = JSON.parse(JSON.stringify(REPEATS));
  tor = [0, 1, 7];

  constructor(
    private _busy: BusyService,
    public dialogRef: MatDialogRef<FacultyBusyAddComponent>,
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
    const day = moment(d).format('E');
    return day !== '6' && day !== '7';
  }

  createForm() {
    this.busyForm = this._fb.group({
      title: ['', Validators.required],
      startDate: [ moment().startOf('day').format(), Validators.required],
      endDate: [ moment().startOf('day').format(), Validators.required],
      startTime: [ moment('0800', 'hmm').format('HH:mm'), Validators.required],
      endTime: [ moment('1000', 'hhmm').format('HH:mm'), Validators.required],
      recur: [ 0, Validators.required],
    });
  }

  updateDay(e) {
    const day = e.value.format('dddd');
    this.repeats[2] = REPEATS[2] + ' ' +  day;
  }

  parseForm(f) {
    // Get the dates as is. if .dateOnly() method is used, we lose timezone.
    let sd = moment(f.startDate);
    let ed = moment(f.endDate);

    // Make sure dates are the same or end is bigger
    if (sd.isAfter(ed)) {
      return -1;
    }

    sd = sd.add(f.startTime.slice(0, 2), 'h');
    sd = sd.add(f.startTime.slice(-2), 'm');
    ed = ed.add(f.endTime.slice(0, 2), 'h');
    ed = ed.add(f.endTime.slice(-2), 'm');

    // Make sure start date is after end.
    if (sd.isSameOrAfter(ed)) {
      return -1;
    }

    const model: Busy = {
      title : f.title,
      owner_id : this.data._id,
      when : {
        startDate : sd.format(),
        endDate : ed.format(),
        recur : f.recur
      }
    };

    return model;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    const busy = this.parseForm(this.busyForm.value);
    if (busy !== -1) {
        this._busy.setBusy(busy)
          .subscribe(res => {
            this.dialogRef.close(res);
        });
    } else {
      this.dialogRef.close(-1);
    }
  }
}
