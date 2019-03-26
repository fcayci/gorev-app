import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';

// import models
import { User, Busy } from '../../../models/User';

// import services
import { UserService } from '../../../services/user.service';
import { ToasterService } from '../../../services/toaster.service';

// import components
import { MesgulEkleComponent } from '../mesgul-ekle/mesgul-ekle.component';

@Component({
	selector: 'app-mesgul-listesi',
	templateUrl: './mesgul-listesi.component.html',
	styleUrls: ['./mesgul-listesi.component.css']
})
export class MesgulListesiComponent implements OnInit {

	@Input() profile: User;

	title = 'Meşguliyet';
	displayedColumns = ['description', 'date', 'time', 'recur', 'expired', 'delete'];
	dataSource: MatTableDataSource<Busy>;
	today;
	showdelete = false;

	constructor(
		private _user: UserService,
		private _toaster: ToasterService,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.today = moment();
	}

	ngOnChanges() {
		if (this.profile) {
			this.dataSource = new MatTableDataSource(this.profile.busy);
		}
	}

	// TODO: Add error handler - if a manual error is forced
	//   service is catching the error and not forwarding here
	// res is null - a msg can be created on the server side
	//   to verify operation
	onDelete(busy: Busy): void {
		this._user.deleteBusyFromUser(this.profile, busy)
		.subscribe( res => {
			this.dataSource.data = res.busy;
			this._toaster.info(busy.description + ' silindi.');
		});
	}

	isExpired(d) {
		return this.today.isAfter(d);
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(MesgulEkleComponent, {
			width: '400px',
			data: this.profile
		});

		dialogRef.afterClosed().subscribe(msg => {
			if (msg === -1) {
				this._toaster.info('Hatalı giriş!');
			} else if (msg) {
				//const oldData = this.dataSource.data;
				//oldData.push(msg);
				this.dataSource.data = msg.busy;
				this._toaster.info(msg.description + ' eklendi.');
			}
		});
	}

	toggleEdit() {
		this.showdelete = !this.showdelete;
	}

}

