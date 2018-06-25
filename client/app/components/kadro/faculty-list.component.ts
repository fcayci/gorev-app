import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material';

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
  title = "Bölüm Kadrosu"

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
      .subscribe((kadro : Faculty[]) => {
        this.dataSource = new MatTableDataSource(kadro);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // FIXME: Make this filter exclude useless ones (i.e load)
        // Custom filter to exclude _id section
        this.dataSource.filterPredicate = (data, filter) => {
          // Transform the data into a lowercase string of all property values except _id
          const accumulator = (currentTerm, key) =>  key != "_id" ? currentTerm + data[key] : currentTerm;
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          // Transform the filter by converting it to lowercase and removing whitespace.
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) != -1;
        };

        this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }
          return data[sortHeaderId];
        };
      });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(FacultyAddComponent, {
      width: '460px'
    });

    // FIXME: Add error snackbar message.
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._toaster.info(result.position + ' ' + result.fullname + ' başarıyla eklendi.')
        this.getAllPeople();
      }
    });
  }

  applyFilter(term: string) {
    this.filterValue = term.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }

  goToPerson(p) {
    this._router.navigate(['/kadro/' + p.username])
  }
}
