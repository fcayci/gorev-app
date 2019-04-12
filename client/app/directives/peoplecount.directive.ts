import { Directive, Input } from '@angular/core';

import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

// check if the peoplecount and length of owners match
export function peopleCountValidator(pc: number): ValidatorFn {
	return (control: AbstractControl): {[key: string]: any} | null => {
		const owners = control.get('owners').value;
		const peoplecount = control.get('peoplecount').value;
		return owners.length === peoplecount ? null : { peoplevalid : false };
	};
}

@Directive({
	selector: '[appPeopleCount]',
	providers: [{ provide: NG_VALIDATORS, useExisting: peopleCountValidatorDirective, multi: true }]
	})

export class peopleCountValidatorDirective implements Validator {
	@Input('appPeopleCount') peoplecount: number;

	validate(control: AbstractControl): {[key: string]: any} | null {
	  return peopleCountValidator(1)(control);
	}

}