import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import models
import { User, ROLES } from '../../../models/User';

// import services
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	@Input() profile: User;
	@Output() profileEvent = new EventEmitter();

	roles = ROLES;
	kisiForm: FormGroup;

	constructor(
		private _fb: FormBuilder,
		private _user: UserService
	) {}

	ngOnInit(): void {
		this.kisiForm = this._fb.group({
		fullname: ['', Validators.required],
		email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+')]],
		office: [''],
		phone: ['', Validators.pattern('[0-9]{4}')],
		position: ['', Validators.required],
		mobile: ['', Validators.pattern('[0-9]{11}')],
		load: [, [Validators.required, Validators.pattern('[0-9.]{1,10}')]],
		vacation: [false, Validators.required]
		});

		this.kisiForm.disable();
		this.kisiForm.patchValue( this.profile );
		//this.kisiForm.controls['load'].patchValue(Math.round(this.kisiForm.value.load * 100) / 100);
	}

	// OnChanges is needed since profile is not ready when OnInit is executed
	// if (this.kisiForm) is needed since OnChanges is executed before OnInit for the first time.
	ngOnChanges(): void {
		if (this.kisiForm) {
			this.kisiForm.patchValue( this.profile );
			//this.kisiForm.controls['load'].patchValue(Math.round(this.kisiForm.value.load * 100) / 100);
		}
	}

	onSave(): void {
		const candidate: User = this.kisiForm.value;
		candidate["_id"] = this.profile._id;

		// add rank object
		const r = ROLES.find(x => x.position === candidate.position);
		// if position is in the list, get its rank, otherwise just assign 100
		if (r) candidate["rank"] = r.rank;
		else candidate["rank"] = 100;

		this.profileEvent.emit({ event: 'save', content: candidate });
		this.disableGroup();
	}

	onCancel(): void {
		this.kisiForm.reset();
		this.kisiForm.disable();
		this.kisiForm.patchValue( this.profile );
		//this.kisiForm.controls['load'].patchValue(Math.round(this.kisiForm.value.load * 100) / 100);
	}

	onDelete(): void {
		this.profileEvent.emit({ event: 'delete', content: 'null' });
	}

	enableGroup(): void {
		this.kisiForm.enable();
	}

	disableGroup(): void {
		this.kisiForm.disable();
	}
}

