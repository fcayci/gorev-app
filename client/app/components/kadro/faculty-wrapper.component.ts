import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Faculty } from '../../faculty';
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'faculty-wrapper',
  templateUrl: './faculty-wrapper.component.html'
})

export class FacultyWrapperComponent implements OnInit {

  kisi: Faculty;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _user: UserService,
    private _toaster: ToasterService) {}

  ngOnInit(): void {
    const username = this._route.snapshot.paramMap.get('username');
    this._user.getKisi(username)
      .subscribe((kisi: Faculty) => {
        this.kisi = kisi;
      }, err => {
        this._router.navigate(['/kadro']);
      });
  }

  // FIXME: Delete all busy related to this guy.
  // FIXME: Delete all the tasks related to this guy.
  onDelete(): void {
    this._user.deleteKisi(this.kisi)
      .subscribe(res => {
        if (res.ok === 1) {
          this._toaster.info(this.kisi.fullname + ' silindi..');
        } else {
          console.log('hata olustu, ' + JSON.stringify(res));
        }
    });
    setTimeout(() => this._router.navigate(['/kadro']), 300);
  }

  onSave(candidate: Faculty ): void {
    this._user.updateKisi(candidate)
      .subscribe(
        (kisi: Faculty) => {
          this._toaster.info(kisi.fullname + ' başarıyla düzenlendi.');
          setTimeout(() => this._router.navigate(['/kadro']), 300);
        },
        err => {
          this._toaster.info(err);
          this._router.navigate(['/kadro']);
        }
    );
  }

  profileEventHandler(e) {
    if (e.event === 'delete') {
      this.onDelete();
    } else if (e.event === 'save') {
      this.onSave(e.content);
    }
  }
}
