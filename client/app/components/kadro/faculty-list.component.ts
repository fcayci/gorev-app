import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// import model
import { Faculty, ROLES } from '../../models/FacultyModel';

// import services
import { UserService } from '../../services/facultys.service';
import { ToasterService } from '../../services/toaster.service';

// import other components
import { FacultyAddComponent } from './faculty-add.component';

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
			//FIXME: remove
			console.log(kadro);
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
		if (res) {
			if (res.fullname) {
				this._toaster.info(res.position + ' ' + res.fullname + ' başarıyla eklendi.');
				this.getAllPeople();
			} else {
				this._toaster.info(res);
			}
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

	// TODO: find a way to make this kisi.username
	// active service is added for that purpose
	// to emit the events on kisi change
	// however there is the problem when a user
	// directly goes to a user's page using url
	gotoPerson(kisi: Faculty): void {
		this._user.getKisi(kisi)
		.subscribe((kisi: Faculty) => {
			this._router.navigate(['/kadro/' + kisi._id]);
		}, err => {
		this._toaster.info(err);
		});
	}
}
