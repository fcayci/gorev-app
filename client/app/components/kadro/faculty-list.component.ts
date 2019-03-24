import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// import components
import { FacultyAddComponent } from './faculty-add.component';

// import models
import { Faculty, ROLES } from '../../models/FacultyModel';

// import services
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
	selector: 'faculty-list',
	templateUrl: './faculty-list.component.html'
})

export class FacultyListComponent implements OnInit {

	// table stuff
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	// what columns to display
	displayedColumns = ['no', 'position', 'fullname', 'email', 'office', 'phone', 'load'];
	dataSource: MatTableDataSource<Faculty>;
	filterValue: string;
	roles = ROLES;
	title = 'Bölüm Kadrosu';

	constructor (
		private _user: UserService,
		private _router: Router,
		private _toaster: ToasterService,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.getAllPeople();
	}

	getAllPeople() {
		this._user.getKadro()
		.subscribe((kadro: Faculty[]) => {
			this.dataSource = new MatTableDataSource(kadro);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(FacultyAddComponent, {
			width: '460px'
		});

		dialogRef.afterClosed().subscribe( res => {
		// FIXME: what happens is res is nil?
		if (res) {
			if (res.fullname) {
				this._toaster.info(res.position + ' ' + res.fullname + ' başarıyla eklendi.');
				this.getAllPeople();
			} else {
				this._toaster.info(res);
			}
		} else {
			this._toaster.info('I should not be here');
		}
		});
	}

	// function for search box
	applyFilter(term: string) {
		this.filterValue = term.trim().toLowerCase();
		this.dataSource.filter = this.filterValue;
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	gotoPerson(kisi: Faculty): void {
		this._user.getKisi(kisi)
		.subscribe((kisi: Faculty) => {
			this._router.navigate(['/kadro/' + kisi._id]);
		}, err => {
		this._toaster.info(err);
		});
	}
}
