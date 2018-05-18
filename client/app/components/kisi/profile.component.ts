import { Component, OnChanges, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OE, POSITIONS } from '../../oe';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnChanges, OnInit {

  @Input() profile: OE;
  @Output() submitEvent = new EventEmitter<string>();

  positions = POSITIONS;
  kisiForm : FormGroup;

  sendMessage(e) {
    this.submitEvent.emit(e)
  }

  constructor(private _fb: FormBuilder) {}

  ngOnChanges() {
    if(this.kisiForm){
      this.kisiForm.disable();
      this.kisiForm.patchValue( this.profile );
    }
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.kisiForm = this._fb.group({
      fullname: '',
      email: ['', Validators.required],
      office: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{1,4}')]],
      position: ['', Validators.required],
      mobile: ['', Validators.pattern('[0-9]{11}')],
      load: [0, [Validators.required, Validators.pattern('[0-9.]{1,4}')]],
      vacation: [false, Validators.required]
    });
  }

  enableGroup(): void {
    this.kisiForm.enable();
  }

  disableGroup(): void {
    this.kisiForm.disable();
  }
}
