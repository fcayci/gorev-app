import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import * as moment from 'moment';

// import components
import { AssignmentAddComponent } from './assignment-add.component';

// import models
import { User } from '../../models/User';
import { Task, TASK_STATES} from '../../models/Task';

// import services
import { TaskService } from '../../services/tasks.service';
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
	selector: 'assignment-list',
	templateUrl: './assignment-list.component.html',
})

export class AssignmentListComponent implements OnInit {

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	taskstates = TASK_STATES;
	angarya: Task[];
	kadro: User[] = [];
	displayedColumns = ['no', 'description', 'taskgroup', 'startdate', 'time', 'people', 'owners', 'load', 'state', 'delete'];
	dataSource: MatTableDataSource<Task>;
	today;
	showdelete = false;

	constructor(
		private _task: TaskService,
		private _user: UserService,
		private _router: Router,
		private _toaster: ToasterService,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this._user.getUsers()
		.subscribe((kadro: User[]) => {
			this.kadro = kadro;
		});

		this.today = moment();

		this.getAllTasks();
	}

	getAllTasks(): void {
		this._task.getTasks()
		.subscribe((angarya: Task[]) => {
			// FIXME: remove
			console.log('getAllTasks()', angarya);
			// append owner names so that they are searchable
			while(!this.kadro); // block until kadro appears
			for (const a of angarya){
				a.ownernames = [];
				for (const o of a.owners) {
					const k = this.kadro.find(x => x._id === o.id);
					if (k) {
						a.ownernames.push(k.fullname);
					} else {
						a.ownernames.push('ghost');
					}
				}
			}

			this.dataSource = new MatTableDataSource(angarya);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;

			// Custom filter to exclude _id section
			this.dataSource.filterPredicate = (data, filter) => {
				// Transform the data into a lowercase string of all property values except _id
				const accumulator = (currentTerm, key) =>  key !== '_id' ? currentTerm + data[key] : currentTerm;
				const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
				// Transform the filter by converting it to lowercase and removing whitespace.
				const transformedFilter = filter.trim().toLowerCase();
				return dataStr.indexOf(transformedFilter) !== -1;
			};

			this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: any): any => {
				if (typeof data[sortHeaderId] === 'string') {
					return data[sortHeaderId].toLocaleLowerCase();
				}
				return data[sortHeaderId];
 			};
		});
	}

	getPerson(id: string) {
		if (this.kadro.length > 0) {
			const kisi = this.kadro.find(x => x._id === id)
			if (kisi){
				return kisi.fullname;
			}
		}
		return 'ghost';
	}

	getPersonInitials(id: string) {
		if (this.kadro.length > 0) {
			const kisi = this.kadro.find(x => x._id === id);
			if (kisi) {
				return this.getInitials(kisi.fullname);
			}
		}
		return 'ghost';
	}

	getInitials(fullname: string) {
		var names = fullname.split(' '),
			initials = names[0].substring(0, 1).toLowerCase();

		if (names.length > 1) {
			initials += names[names.length - 1].substring(0, 1).toLowerCase();
		}
		return initials;
	};

	openDialog(): void {
		const dialogRef = this.dialog.open(AssignmentAddComponent, {
			width: '600px'
		});

		dialogRef.afterClosed().subscribe( res => {
		if (res) {
			this._toaster.info( res.taskgroup + ' ' + res.description + ' başarıyla eklendi.');
			this.getAllTasks();
		} else {
			this._toaster.info('İptal edildi...');
		}
		});
	}

	isExpired(d) {
		return this.today.isAfter(d);
	}

	// function for search box
	applyFilter(filterValue: string) {
 		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	toggleEdit() {
		this.showdelete = !this.showdelete;
	}

	gotoPerson(id: string) {
		const p = this.kadro.find(x => x._id === id)._id;
		this._router.navigate(['/kadro/' + p]);
	}

	// TODO: Add error handler - if a manual error is forced
	//   service is catching the error and not forwarding here
	// res is null - a msg can be created on the server side
	//   to verify operation
	onDelete(task: Task): void {
		this._task.deleteTask(task)
		.subscribe( res => {
			console.log('onDelete()', res);
			this._toaster.info(task.description + ' silindi.');
			this.getAllTasks();
			// remove deleted task from data
			// const oldData = this.dataSource.data;
			// const index: number = oldData.indexOf(task._id);
			// console.log(index);
			// oldData.splice(index, 1);
			// this.dataSource.data = oldData;
		});
	}


}
