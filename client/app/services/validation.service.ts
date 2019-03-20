import { Injectable } from '@angular/core';
import { TaskDate } from '../models/BusyModel';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';

@Injectable({
	providedIn: 'root',
})
export class ValidationService {

	constructor() {}

	validateDate(sday: string, eday: string,
	  stime: string, etime: string): TaskDate {
		let model: TaskDate = {
			valid: false,
			startdate: null,
			enddate: null,
			duration: 0
		};

		// get date as is. if dateOnly() method is used,
		//   timezone is lost
		let sd = moment(sday);
		let ed = moment(eday);

		// combine the date & times
		sd = sd.add(stime.slice(0, 2), 'h');
		sd = sd.add(stime.slice(-2), 'm');
		ed = ed.add(etime.slice(0, 2), 'h');
		ed = ed.add(etime.slice(-2), 'm');

		// check if the time is correct
		if (sd.isBefore(ed)) {
			model.valid = true;
			model.duration = Math.trunc(moment.duration(ed.diff(sd)).as('minutes'));
			model.startdate = sd.format();
			model.enddate = ed.format();
		}

		return model;
	}
}
