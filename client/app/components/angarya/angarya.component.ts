import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';

import { AngaryaDataTable } from './angarya-data';
import { Gorev } from '../../gorev';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'angarya',
  templateUrl: './angarya.component.html'
})

export class AngaryaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  angarya : Gorev[];
  displayedColumns = ['no', 'title', 'type', 'date', 'time', 'status'];
  dataSource: AngaryaDataTable;
  filterValue: string;

  constructor(private _task: TaskService) {}

  ngOnInit(): void {
    this.dataSource = new AngaryaDataTable(this.paginator, this.sort, this._task);
  }

  applyFilter(term: string) {
    this.filterValue = term.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}

