import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Faculty } from '../../models/FacultyModel';
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
	onSave(kisi: Faculty ): void {
		this._user.updateKisi(kisi)
		.subscribe((kisi: Faculty) => {
			this._toaster.info(kisi.fullname + ' başarıyla düzenlendi.');
			setTimeout(() => this._router.navigate(['/kadro']), 300);
		}, err => {
		this._toaster.info(err);
		this._router.navigate(['/kadro']);
		});
	}

	// delete kisi
	// FIXME: Delete all busy related to this guy..
	onDelete(): void {
		const kisi: Faculty = this.kisi;
		this._user.deleteKisi(this.kisi)
		.subscribe(res => {
			this._toaster.info(this.kisi.fullname + ' silindi..');
		}, err => {
			this._toaster.info(err);
			this._router.navigate(['/kadro']);
		});
		//this._busy.deleteBusybyOwnerID();
		setTimeout(() => this._router.navigate(['/kadro']), 300);
	}

	// get events from children and act accordingly
	profileEventHandler(e) {
		if (e.event === 'delete') {
			this.onDelete();
		} else if (e.event === 'save') {
			this.onSave(e.content);
		}
	}
}
