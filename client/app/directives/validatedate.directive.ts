import { Directive } from '@angular/core';

import { AbstractControl, FormGroup, NG_VALIDATORS,
  ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';

// check if date is valid
export const validateDateValidator: ValidatorFn = (control: FormGroup):
ValidationErrors | null => {
	const sday = control.get('sday');
	const stime = control.get('stime');
	const etime = control.get('etime');

	// get date as is. if dateOnly() method is used,
	//   timezone is lost
	let sd = moment(sday.value);
	let ed = moment(sday.value);

	// combine the date & times
	sd = sd.add(stime.value.slice(0, 2), 'h');
	sd = sd.add(stime.value.slice(-2), 'm');
	ed = ed.add(etime.value.slice(0, 2), 'h');
	ed = ed.add(etime.value.slice(-2), 'm');

	return sday && stime && etime && sd.isBefore(ed) ? null : { timevalid :false };

};

