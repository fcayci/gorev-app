import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { OE, POSITIONS } from '../../oe';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'kisi-add',
  templateUrl: './kisi-add.component.html'
})

export class KisiAddComponent implements OnInit  {

  positions = POSITIONS;
  kisiForm : FormGroup;
  title = 'Yeni Kişi Ekle';

  constructor(
    public dialogRef: MatDialogRef<KisiAddComponent>,
    private _fb: FormBuilder,
    private _user: UserService) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.kisiForm = this._fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+')]],
      office: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      position: ['', Validators.required],
      mobile: ['', Validators.pattern('[0-9]{11}')],
      vacation: false
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    const profile: OE = this.kisiForm.value;
    this._user.addKisi(profile)
      .subscribe(res => {
    });
    this.dialogRef.close(profile);
  }
}
