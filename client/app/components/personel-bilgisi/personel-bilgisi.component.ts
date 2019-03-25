import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// import models
import { User } from '../../models/User';

// import services
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
	selector: 'app-personel-bilgisi',
	templateUrl: './personel-bilgisi.component.html',
	styleUrls: ['./personel-bilgisi.component.css']
})
export class PersonelBilgisiComponent implements OnInit {

	kisi: User;

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _user: UserService,
		private _toaster: ToasterService
	) {}

	ngOnInit(): void {
		const id = this._route.snapshot.paramMap.get('_id');
		this._user.getUserById(id)
		.subscribe((kisi: User) => {
			this.kisi = kisi;
			}, err => {
			this._toaster.info(err);
			this._router.navigate(['/kadro']);
			}
		);
	}

	// update kisi
	onSave(kisi: User ): void {
		this._user.updateUser(kisi)
		.subscribe((kisi: User) => {
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
		const kisi: User = this.kisi;
		this._user.deleteUser(this.kisi)
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
