import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import * as moment from 'moment';

// import components
import { AssignmentAddComponent } from './assignment-add.component';

// import models
import { Task, TASK_STATES} from '../../models/TaskModel';
import { Faculty } from '../../models/FacultyModel';

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
	kadro: Faculty[] = [];
	displayedColumns = ['no', 'name', 'group', 'startdate', 'time', 'people', 'owners', 'load', 'state', 'delete'];
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
		this._user.getKadro()
		.subscribe((kadro: Faculty[]) => {
			this.kadro = kadro;
		});

		this.today = moment();

		this.getTasks();
	}

	getTasks(): void {
		this._task.getTasks()
		.subscribe((angarya: Task[]) => {
			// FIXME: remove
			console.log(angarya);
			// append owner names so that they are searchable
			while(!this.kadro); // block until kadro appears
			for (const a of angarya){
				a.ownernames = [];
				for (const id of a.owners) {
					const k = this.kadro.find(x => x._id === id);
					if (k) {
						a.ownernames.push(k.fullname);
					} else {
						a.ownernames.push('ghost');
					}
				}
			}
			console.log(angarya);

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
			this._toaster.info( res.group + ' ' + res.name + ' başarıyla eklendi.');
				this.getTasks();
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

}
