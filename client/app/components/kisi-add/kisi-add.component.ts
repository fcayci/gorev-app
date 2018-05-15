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
      email: ['', Validators.required],
      office: ['', Validators.required],
      phone: ['', Validators.required],
      position: ['', Validators.required],
      mobile: ''
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close();
    const profile: OE = this.kisiForm.value;
    this._user.addKisi(profile)
      .subscribe(res => {
    });

    this.dialogRef.close(this.kisiForm.value);
  }
}
