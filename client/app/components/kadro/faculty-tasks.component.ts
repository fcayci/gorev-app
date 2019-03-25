import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

import * as moment from 'moment';

// import models
import { Personel } from '../../models/Personel';
import { Task, TASK_STATES } from '../../models/TaskModel';

// import services
import { TaskService } from '../../services/tasks.service';

@Component({
	selector: 'faculty-tasks',
	templateUrl: './faculty-tasks.component.html'
})

export class FacultyTasksComponent implements OnInit, OnChanges {

	@Input() profile: Personel;

	title = 'Görevlendirmeler';
	displayedColumns = ['name', 'date', 'time', 'load', 'expired'];
	dataSource: MatTableDataSource<Task>;
	today;
	gstates = TASK_STATES;
	totalLoad: number;

	constructor(
		private _task: TaskService,
		private _router: Router) {}

	ngOnInit(): void {
		this.today = moment();
	}

	ngOnChanges() {
		if (this.profile) {
			this._task.getFacultyTasks(this.profile._id)
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
