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

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _user: UserService) {}

  ngOnInit(): void {
    var username = this._route.snapshot.paramMap.get('username');
    this._user.getKisi(username)
      .subscribe((kisi : Faculty) => {
        this.kisi = kisi;
    });
  }

  // FIXME: Add snackbar here, and navigate only when deleted.
  // FIXME: Delete all busy related to this guy.
  // FIXME: Delete all the tasks related to this guy.
  onDelete(): void {
    this._user.deleteKisi(this.kisi)
      .subscribe(res => {
        // if res.ok == 1 ...
        //console.log('deleted with msg', res);
    });
    setTimeout(() => this._router.navigate(['/kadro']), 800);
  }

  handleMessage(e){
    if (e == "delete"){
      this.onDelete();
    }
  }
}
