import { Component, OnInit, OnChanges, Input, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import * as moment from 'moment';

// import models
import { User } from '../../../models/User';
import { Task, TASK_STATES } from '../../../models/Task';

// import services
import { TaskService } from '../../../services/tasks.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
	selector: 'app-gorevler',
	templateUrl: './gorevler.component.html',
	styleUrls: ['./gorevler.component.css']
})
export class GorevlerComponent implements OnInit, OnChanges {

	@Input() profile: User;

	title = 'Görevlendirmeler';
	displayedColumns = ['description', 'taskgroup', 'date', 'time', 'load', 'complete'];
	dataSource: MatTableDataSource<Task>;
	today;
	gstates = TASK_STATES;
	totalLoad: number;

	constructor(
		private _task: TaskService,
		private _toaster: ToasterService,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.today = moment();
	}

	ngOnChanges() {
		if (this.profile) {
			let ids = this.profile.task;
			this._task.getTasksByIds(ids)
			.subscribe((tasks: Task[]) => {
				// FIXME: remove
				console.log(tasks);
				//this.totalLoad = tasks.map(i => i.load).reduce((acc, value) => acc + value, 0);
				this.dataSource = new MatTableDataSource(tasks);
			});
		}
	}

	onComplete(task: Task) {
		let newload = task.load * 60;
		const dialogRef = this.dialog.open(LoadChangeDialog, {
			width: '250px',
			data: {newload: newload, name: this.profile.fullname.split(' ')[0]}
		});

		dialogRef.afterClosed()
		.subscribe(res => {
			if (res === undefined) {
				this._toaster.info('İptal edildi...');
			} else if (res < 10 && res > 0) {
				this._toaster.info('Hata: Lütfen dakika olarak giriniz...');
			}
			else {
				newload = Math.round(res / 6) / 10;
				this._task.markTaskCompleted(task, this.profile._id, newload)
				.subscribe((task: Task) => {
					this._toaster.info('Yeni yük bildirildi ve görev sonlandırıldı.');
				});
			}
		});
	}

	isExpired(d) {
		return this.today.isAfter(d);
	}

	isCompleted(task: Task) {
		const x = task.owners.find(p => p.id === this.profile._id);
		if (x){
			return x.state;
		} else {
			return 0;
		}
	}
}

@Component({
	selector: 'load-change-dialog',
	templateUrl: 'load-change-dialog.html',
  })
  export class LoadChangeDialog {

	constructor(
	  public dialogRef: MatDialogRef<LoadChangeDialog>,
	  @Inject(MAT_DIALOG_DATA) public data) {}

	onNoClick(): void {
	  this.dialogRef.close();
	}

  }