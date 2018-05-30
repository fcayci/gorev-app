import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material';

import { Task } from '../../task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'assignment-list',
  templateUrl: './assignment-list.component.html'
})

export class AssignmentListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  angarya : Task[];
  displayedColumns = ['no', 'title', 'type', 'date', 'time', 'status'];
  dataSource : any;

  constructor(private _task: TaskService) {}

  ngOnInit(): void {
    this.getAngarya();
  }

  getAngarya() {
    this._task.getAllTasks()
      .subscribe((angarya: Task[]) => {
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

        this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }
          return data[sortHeaderId];
        };
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}