import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    private _fb: FormBuilder,
    private _router: Router,
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

  onSubmit() {
    const profile: OE = this.kisiForm.value;
    console.log(profile)
    this._user.addKisi(profile)
      .subscribe(res => {
    });

    setTimeout(() => this._router.navigate(['/kadro']), 800);
  }
}
