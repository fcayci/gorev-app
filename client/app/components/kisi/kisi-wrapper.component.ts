import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { OE } from '../../oe';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'kisi-wrapper',
  templateUrl: './kisi-wrapper.component.html'
})

export class KisiWrapperComponent implements OnInit {

  kisi: OE;     // current values
  edit = false; // allow/disallow edits

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _user:UserService
  ) {}

  ngOnInit(): void {
    this.getKisi();
  }

  getKisi(): void {
    var username = this.route.snapshot.paramMap.get('username');
    this._user.getKisi(username)
      .subscribe((kisi : OE) => {
        this.kisi = kisi;
    });
  }


  updateKisi(): void {
    this._user.updateKisi(this.kisi)
      .subscribe((kisi : OE) => {
        this.kisi = kisi;
    });
    this.toggleEdit();
  }

  deleteKisi(): void {
    this._user.deleteKisi(this.kisi)
      .subscribe(res => {
    });
    setTimeout(() => this.router.navigate(['/kadro']), 800);
  }

  resetKisi(): void {
    this.getKisi();
    this.toggleEdit();
  }

  handleMessage(e){
    if (e.target.name == "save"){
      this.updateKisi();
    } else if(e.target.name == "cancel"){
      this.resetKisi();
    }
  }

  toggleEdit(){
    this.edit = !this.edit;
  }

}
