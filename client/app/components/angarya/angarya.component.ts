import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material';

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
  dataSource : any;

  constructor(private _task: TaskService) {}

  ngOnInit(): void {
    this._task.getAllTasks()
      .subscribe((angarya: Gorev[]) => {
        this.dataSource = new MatTableDataSource(angarya);
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
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}