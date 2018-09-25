import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { Faculty, POSITIONS } from '../../faculty';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'faculty-add',
  templateUrl: './faculty-add.component.html'
})

export class FacultyAddComponent implements OnInit  {

  positions = POSITIONS;
  kisiForm: FormGroup;
  title = 'Yeni Kişi Ekle';

  constructor(
    public dialogRef: MatDialogRef<FacultyAddComponent>,
    private _fb: FormBuilder,
    private _user: UserService) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.kisiForm = this._fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+')]],
      office: [''],
      phone: ['', Validators.pattern('[0-9]{4}')],
      position: ['', Validators.required],
      mobile: ['', Validators.pattern('[0-9]{11}')],
      load: 0,
      vacation: false
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    // this.kisiForm.value.fullname = this.kisiForm.value.fullname.toProperCase();
    const profile: Faculty = this.kisiForm.value;
    this._user.addKisi(profile)
      .subscribe(
        res => { this.dialogRef.close(res); },
        err => { this.dialogRef.close(err); }
    );
  }
}

// String.prototype.toProperCase = function () {
//   return this.replace(/\w\S*/g, function(txt) {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// };
