import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';

// import models
import { Faculty } from '../../models/FacultyModel';
import { Busy } from '../../models/BusyModel';

// import services
import { BusyService } from '../../services/busys.service';
import { UserService } from '../../services/facultys.service';
import { ToasterService } from '../../services/toaster.service';

// import components
import { FacultyBusyAddComponent } from './faculty-busy-add.component';

@Component({
	selector: 'faculty-busy',
	templateUrl: './faculty-busy.component.html'
})

export class FacultyBusyComponent implements OnInit, OnChanges{

	@Input() profile: Faculty;

	title = 'Meşguliyet';
	displayedColumns = ['name', 'date', 'time', 'recur', 'expired'];
	dataSource: MatTableDataSource<Busy>;
	today;
	showdelete = false;

	constructor(
		private _busy: BusyService,
		private _user: UserService,
		private _toaster: ToasterService,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.today = moment();
	}

	ngOnChanges() {
		if (this.profile) {
			this._busy.getFacultyBusyTimes(this.profile._id)
			.subscribe((busies: Busy[]) => {
				// FIXME: Remove filter when you remove task_id field from busy.
				//const b = busies.filter(i => !i.task_id);
				console.log(busies);
				this.dataSource = new MatTableDataSource(busies);
			});
		}
	}

	// TODO: Add error handler - if a manual error is forced
	//   service is catching the error and not forwarding here
	// res is null - a msg can be created on the server side
	//   to verify oepration
	onDelete(busy: Busy, i: number): void {
		this._busy.deleteBusy(busy)
		.subscribe( _ => {
			const oldData = this.dataSource.data;
			oldData.splice(i, 1);
			this.dataSource.data = oldData;

			this._user.deleteBusyFromKisi(this.profile, busy)
				.subscribe((kisi: Faculty) => {

				});

			this._toaster.info(busy.name + ' silindi.');
		});
	}

	isExpired(d) {
		return this.today.isAfter(d);
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(FacultyBusyAddComponent, {
			width: '400px',
			data: this.profile
		});

		dialogRef.afterClosed().subscribe(msg => {
			if (msg === -1) {
				this._toaster.info('Hatalı giriş!');
			} else if (msg) {
				const oldData = this.dataSource.data;
				oldData.push(msg);
				this.dataSource.data = oldData;
				this._toaster.info(msg.name + ' eklendi.');
			}
		});
	}

	toggleEdit() {
		this.showdelete = !this.showdelete;
	}

}

