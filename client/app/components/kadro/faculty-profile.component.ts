import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Faculty, POSITIONS } from '../../faculty';
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'faculty-profile',
  templateUrl: './faculty-profile.component.html'
})

export class FacultyProfileComponent implements OnInit, OnChanges {

  @Input() profile: Faculty;
  @Output() submitEvent = new EventEmitter<string>();

  positions = POSITIONS;
  kisiForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _toaster: ToasterService,
    private _user: UserService) {}

  ngOnInit(): void {
    this.kisiForm = this._fb.group({
      fullname: '',
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+')]],
      office: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{1,4}')]],
      position: ['', Validators.required],
      mobile: ['', Validators.pattern('[0-9]{11}')],
      load: [, [Validators.required, Validators.pattern('[0-9.]{1,10}')]],
      vacation: [false, Validators.required]
    });

    this.kisiForm.disable();
    this.kisiForm.patchValue( this.profile );
  }

  // OnChanges is needed since profile is not ready when OnInit is executed
  // if (this.kisiForm) is needed since OnChanges is executed before OnInit for the first time.
  ngOnChanges(): void {
    if (this.kisiForm) {
      this.kisiForm.patchValue( this.profile );
    }
  }

  onSave(): void {
    const candidate: Faculty = this.kisiForm.value;
    candidate.username = candidate.email;

    // FIXME: Add snackbar error message
    this._user.updateKisi(candidate)
      .subscribe((kisi: Faculty) => {
        this.profile = kisi;
        this._toaster.info(kisi.fullname + ' duzenlendi.');
    });

    this.disableGroup();
  }

  onCancel(): void {
    this.kisiForm.reset();
    this.kisiForm.disable();
    this.kisiForm.patchValue( this.profile );
  }

  onDelete(): void {
    this.submitEvent.emit('delete');
  }

  enableGroup(): void {
    this.kisiForm.enable();
  }

  disableGroup(): void {
    this.kisiForm.disable();
  }
}
