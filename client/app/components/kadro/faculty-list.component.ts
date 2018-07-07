import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Faculty, POSITIONS } from '../../faculty';
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../services/toaster.service';
import { FacultyAddComponent } from './faculty-add.component';

@Component({
  selector: 'faculty-list',
  templateUrl: './faculty-list.component.html'
})

export class FacultyListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['no', 'position', 'fullname', 'email', 'office', 'phone', 'load'];
  dataSource: MatTableDataSource<Faculty>;
  filterValue: string;
  position = POSITIONS;
  title = 'Bölüm Kadrosu';

  constructor(
    private _user: UserService,
    private _router: Router,
    private _toaster: ToasterService,
    public dialog: MatDialog) {}

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

    // FIXME: Add error snackbar message.
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._toaster.info(result.position + ' ' + result.fullname + ' başarıyla eklendi.');
        this.getAllPeople();
      }
    });
  }

  applyFilter(term: string) {
    this.filterValue = term.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToPerson(p) {
    this._router.navigate(['/kadro/' + p.username]);
  }
}
