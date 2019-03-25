import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import * as moment from 'moment';

// import models
import { User } from '../../../models/User';
import { Task, TASK_STATES } from '../../../models/Task';

// import services
import { TaskService } from '../../../services/tasks.service';

@Component({
	selector: 'app-gorevler',
	templateUrl: './gorevler.component.html',
	styleUrls: ['./gorevler.component.css']
})
export class GorevlerComponent implements OnInit, OnChanges {

	@Input() profile: User;

	title = 'Görevlendirmeler';
	displayedColumns = ['description', 'date', 'time', 'load', 'expired'];
	dataSource: MatTableDataSource<Task>;
	today;
	gstates = TASK_STATES;
	totalLoad: number;

	constructor(
		private _task: TaskService) {}

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

	isExpired(d) {
		return this.today.isAfter(d);
	}
}
