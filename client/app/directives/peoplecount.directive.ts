import { Directive } from '@angular/core';

import { AbstractControl, FormGroup, NG_VALIDATORS, 
  ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

// check if the peoplecount and length of owners match
export const peopleCountValidator: ValidatorFn = (control: FormGroup): 
ValidationErrors | null => {
	const owners = control.get('owners');
	const peoplecount = control.get('peoplecount');

	return peoplecount && owners.value.length !== peoplecount.value ? { notenoughpeople : true } : null;
};

@Directive({
	selector: '[appPeopleCount]',
	providers: [{ provide: NG_VALIDATORS, useExisting: peopleCountValidatorDirective, multi: true }]
	})

export class peopleCountValidatorDirective implements Validator {
	validate(control: AbstractControl): ValidationErrors {
		return peopleCountValidator(control)
	}
}

