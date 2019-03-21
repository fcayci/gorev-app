import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

// import { animate, state, style, transition, trigger } from '@angular/animations';
import { AssignmentAddComponent } from './assignment-add.component';

import { Task, TASK_GROUPS, TASK_STATES} from '../../models/TaskModel';
import { Faculty } from '../../models/FacultyModel';
import { TaskService } from '../../services/tasks.service';
import { UserService } from '../../services/facultys.service';
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
	displayedColumns = ['no', 'name', 'group', 'date', 'time', 'people', 'owners', 'state'];
	dataSource: MatTableDataSource<Task>;

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

		this.getTasks();
	}

	getTasks(): void {
		this._task.getTasks()
		.subscribe((angarya: Task[]) => {
			// FIXME: remove
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

			this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
				if (typeof data[sortHeaderId] === 'string') {
					return data[sortHeaderId].toLocaleLowerCase();
				}
				return data[sortHeaderId];
 			};
		});
	}

	getPerson(id: string) {
		if (this.kadro.length > 0) {
			return this.kadro.find(x => x._id === id).fullname;
		} else {
			return 'N/A';
	}
}

	getPersonInitials(id: string) {
		if (this.kadro.length > 0) {
			const name = this.kadro.find(x => x._id === id).fullname;
			return name.match(/\b(\w)/g).join('').toLowerCase();
		} else {
			return 'N/A';
		}
	}

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

// 	gotoPerson(id: string) {
// 		const p = this.kadro.find(x => x._id === id).username;
// 		this._router.navigate(['/kadro/' + p]);
// 	}
//
// 	applyFilter(filterValue: string) {
//  		filterValue = filterValue.trim().toLowerCase();
// 		this.dataSource.filter = filterValue;
// 	}
//
// 	onDetail(a) {
// 		this._router.navigate(['/angarya/' + a._id]);
// 	}
}
