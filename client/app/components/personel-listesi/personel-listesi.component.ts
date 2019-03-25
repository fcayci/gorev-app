import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// import components
import { PersonelEkleComponent } from '../personel-ekle/personel-ekle.component';

// import models
import { User, ROLES } from '../../models/User';

// import services
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-personel-listesi',
  templateUrl: './personel-listesi.component.html',
  styleUrls: ['./personel-listesi.component.css']
})
export class PersonelListesiComponent implements OnInit {

	// table stuff
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	// what columns to display
	displayedColumns = ['no', 'position', 'fullname', 'email', 'office', 'phone', 'load'];
	dataSource: MatTableDataSource<User>;
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
		this.getUsers();
	}

	getUsers() {
		this._user.getUsers()
		.subscribe((kadro: User[]) => {
			this.dataSource = new MatTableDataSource(kadro);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(PersonelEkleComponent, {
			width: '460px'
		});

		dialogRef.afterClosed().subscribe( res => {
		if (res) {
			if (res.fullname) {
				this._toaster.info(res.position + ' ' + res.fullname + ' başarıyla eklendi.');
				this.getUsers();
			} else {
				this._toaster.info(res);
			}
		} else {
			this._toaster.info('İptal edildi.');
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

	gotoPerson(kisi: User): void {
		this._user.getUser(kisi)
		.subscribe((kisi: User) => {
			this._router.navigate(['/kadro/' + kisi._id]);
		}, err => {
		this._toaster.info(err);
		});
	}
}
