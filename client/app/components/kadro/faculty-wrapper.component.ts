import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Faculty } from '../../models/FacultyModel';
import { UserService } from '../../services/facultys.service';
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
		private _toaster: ToasterService
	) {}

	ngOnInit(): void {
		const id = this._route.snapshot.paramMap.get('_id');
		this._user.getKisibyId(id)
		.subscribe((kisi: Faculty) => {
			this.kisi = kisi;
			}, err => {
			this._toaster.info(err);
			this._router.navigate(['/kadro']);
			}
		);
	}

	// update kisi
	onSave(candidate: Faculty ): void {
		this._user.updateKisi(candidate)
		.subscribe((kisi: Faculty) => {
			this._toaster.info(kisi.fullname + ' başarıyla düzenlendi.');
			setTimeout(() => this._router.navigate(['/kadro']), 300);	
		}, err => {
		this._toaster.info(err);
		this._router.navigate(['/kadro']);
		}
		);
	}


  // FIXME: Delete all busy related to this guy.
  // FIXME: Delete all the tasks related to this guy.
  onDelete(): void {
    this._user.deleteKisi(this.kisi)
      .subscribe(res => {
        if (res === 1) {
          this._toaster.info(this.kisi.fullname + ' silindi..');
        } else {
          console.log('hata olustu, ' + JSON.stringify(res));
        }
    });
    setTimeout(() => this._router.navigate(['/kadro']), 300);
  }
  profileEventHandler(e) {
    if (e.event === 'delete') {
      this.onDelete();
    } else if (e.event === 'save') {
      this.onSave(e.content);
    }
  }
}
