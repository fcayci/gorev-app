import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Faculty } from '../../faculty';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'faculty-wrapper',
  templateUrl: './faculty-wrapper.component.html'
})

export class FacultyWrapperComponent implements OnInit {

  kisi: Faculty;
  edit = false;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _user: UserService
  ) {}

  ngOnInit(): void {
    this.getKisi();
  }

  // FIXME: add error handler
  getKisi(): void {
    var username = this._route.snapshot.paramMap.get('username');
    this._user.getKisi(username)
      .subscribe((kisi : Faculty) => {
        this.kisi = kisi;
    });
  }

  updateKisi(): void {
    this._user.updateKisi(this.kisi)
      .subscribe((kisi : Faculty) => {
        this.kisi = kisi;
    });
    this.toggleEdit();
  }

  deleteKisi(): void {
    this._user.deleteKisi(this.kisi)
      .subscribe(res => {
    });
    setTimeout(() => this._router.navigate(['/kadro']), 800);
  }

  resetKisi(): void {
    this.getKisi();
    this.toggleEdit();
  }

  handleMessage(e){
    if (e == "edit"){
      this.toggleEdit();
    } else if (e == "save"){
      this.updateKisi();
    } else if(e == "cancel"){
      this.resetKisi();
    } else if(e == "delete"){
      this.deleteKisi();
    }
  }

  toggleEdit(){
    this.edit = !this.edit;
  }

}
