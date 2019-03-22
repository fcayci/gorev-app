import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';

// import models
import { Busy, REPEATS } from '../../models/BusyModel';
import { Faculty } from '../../models/FacultyModel';

// import services
import { BusyService } from '../../services/busys.service';
import { UserService } from '../../services/facultys.service';

@Component({
	selector: 'faculty-busy-add',
	templateUrl: './faculty-busy-add.component.html'
})

export class FacultyBusyAddComponent implements OnInit  {

	busyForm: FormGroup;
	repeats = JSON.parse(JSON.stringify(REPEATS));
	tor = [0, 1, 7];
	formValid = false;
	startdate;
	enddate;

	constructor(
		private _busy: BusyService,
		private _user: UserService,
		public dialogRef: MatDialogRef<FacultyBusyAddComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder
	) {}

	ngOnInit() {
		moment.locale('tr');
		const day = moment().format('dddd');
		this.repeats[2] = REPEATS[2] + ' ' +  day;
		this.createForm();

		this.validateInputDate();
	}

	validateInputDate(): void {
		this.busyForm.statusChanges
		.subscribe(status => {
			if (status === 'VALID') {
				console.log('checking time...');
				const t = this.busyForm.value;

				// get date as is. if dateOnly() method is used,
				//   timezone is lost
				let sd = moment(t.startday);
				let ed = moment(t.endday);
				// combine the date & times
				sd = sd.add(t.starttime.slice(0, 2), 'h');
				sd = sd.add(t.starttime.slice(-2), 'm');
				ed = ed.add(t.endtime.slice(0, 2), 'h');
				ed = ed.add(t.endtime.slice(-2), 'm');

				// check if the time is correct
				if (ed.isAfter(sd)) {
					this.formValid = true;
				} else {
					this.formValid = false;
				}

				this.startdate = sd;
				this.enddate = ed;
			}
		});
	}

	// Prevent Saturday and Sunday from being selected.
	weekendFilter = (d: Date): boolean => {
		const day = moment(d).format('E');
		return day !== '6' && day !== '7';
	}

	createForm() {
		this.busyForm = this._fb.group({
			name: ['', Validators.required],
			startday: [ moment().startOf('day').format(), Validators.required],
			endday: [ moment().startOf('day').format(), Validators.required],
			starttime: [ moment('0800', 'hmm').format('HH:mm'), Validators.required],
			endtime: [ moment('1000', 'hhmm').format('HH:mm'), Validators.required],
			recur: [ , Validators.required],
		});
	}

	updateDay(e) {
		const day = e.value.format('dddd');
		this.repeats[2] = REPEATS[2] + ' ' +  day;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	onSubmit() {
 		const b = this.busyForm.value;
		const model: Busy = {
			name: b.name,
			startdate : this.startdate.format(),
			enddate : this.enddate.format(),
			owner : this.data._id,
			recur : b.recur
		};

		// FIXME: add error handling
		this._busy.setBusy(model)
		.subscribe(res => {

			this._user.addBusyToKisi(this.data, res)
				.subscribe((kisi: Faculty) => {

				});

			this.dialogRef.close(res);
		});
	}
}
