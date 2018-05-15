import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material';

import { OE } from '../../oe';
import { UserService } from '../../services/user.service';
import { KisiAddComponent } from '../kisi-add/kisi-add.component';

@Component({
  selector: 'kadro',
  templateUrl: './kadro.component.html'
})

export class KadroComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['no', 'fullname', 'email', 'position', 'office', 'phone', 'load'];
  dataSource: any;
  filterValue: string;

  constructor(private _user: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getKadro();
  }

  getKadro() {
    this._user.getKadro()
      .subscribe((kadro : OE[]) => {
        this.dataSource = new MatTableDataSource(kadro);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

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
    let dialogRef = this.dialog.open(KisiAddComponent, {
      width: '460px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {this.getKadro();}
    });
  }

  applyFilter(term: string) {
    this.filterValue = term.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}
