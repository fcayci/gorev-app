import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material';

import { KadroDataTable } from './kadro-data';
import { OE } from '../../oe';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'kadro',
  templateUrl: './kadro.component.html'
})

export class KadroComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  kadro : OE[];
  displayedColumns = ['fullname', 'email', 'position', 'office', 'phone', 'load'];
  dataSource: KadroDataTable;
  filterValue: string;

  constructor(private _user: UserService) {}

  ngOnInit(): void {
    this.dataSource = new KadroDataTable(this.paginator, this.sort, this._user);
  }

  search(term: string) {
    this.filterValue = term.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }
}
