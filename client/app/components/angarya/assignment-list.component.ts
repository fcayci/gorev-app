import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
		if(this.dialog.openDialogs.length==0){
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
		for (const o of task.owners) {
			const p = this.kadro.find(x => x._id === o.id);
			this._user.deleteTaskFromUser(p, task)
			.subscribe ( res => {
				//
			})
		}

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

	onComplete(task: Task) {

		let dialogdata = [];

		// get each users updated tasks
		for (const o of task.owners) {
			const p = this.kadro.find(x => x._id === o.id);
			dialogdata.push({name: p.fullname, id: o.id, newload: o.newload * 60});
		}

		console.log(dialogdata);
		const dialogRef = this.dialog.open(FinalizeDialog, {
			width: '400px',
			data: {data: dialogdata}
		});

		dialogRef.afterClosed()
		.subscribe(res => {
			if (res === undefined) {
				this._toaster.info('İptal edildi...');
			} else {
				for (const o of task.owners) {
					// find the person form result to update newload
					const a = res.find(x => x.id === o.id);
					o.newload =  Math.round(a.newload / 6) / 10;
					// find the person from kadro
					const p = this.kadro.find(x => x._id === o.id);
					// remove task from users
					// and add newtask load to users
					this._user.completeTaskOfUser(p, task)
					.subscribe(res => {
						//
					});
				}

				// update task
				task.state = 1;
				this._task.updateTask(task)
				.subscribe( res => {
					this._toaster.info('Görev sonlandırıldı...');
				});
			}
		});

	}

	// check if everyone finalized their tasks
	isCompleted(task: Task) {
		if (task.state == 1) {
			// task is completed
			return 2;
		}
		for (const x of task.owners){
			if (x.state === 0){
				// waiting for people to mark task completed
				return 0;
			}
		}
		// pending
		return 1;
	}

}


@Component({
	selector: 'finalize-dialog',
	templateUrl: 'finalize-dialog.html',
  })
  export class FinalizeDialog {

	constructor(
	  public dialogRef: MatDialogRef<FinalizeDialog>,
	  @Inject(MAT_DIALOG_DATA) public data) {}

	onNoClick(): void {
	  this.dialogRef.close();
	}

  }