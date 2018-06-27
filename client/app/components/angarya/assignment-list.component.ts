import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { Task } from '../../task';
import { Faculty } from '../../faculty';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'assignment-list',
  templateUrl: './assignment-list.component.html',
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
  //     state('expanded', style({ height: '*', visibility: 'visible' })),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
})

export class AssignmentListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  angarya : Task[];
  kadro : Faculty[] = [];
  displayedColumns = ['no', 'title', 'type', 'date', 'time', 'status', 'people', 'choosenPeople'];
  dataSource : any;
  COLORS = ['primary', 'warn', 'accent', 'none'];

  //isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  //expandedElement: Faculty;

  constructor(
    private _task: TaskService,
    private _user: UserService,
    private _router: Router) {}

  ngOnInit(): void {
    this._user.getKadro()
      .subscribe((kadro: Faculty[]) => {
        this.kadro = kadro;
      });

    this._task.getAllTasks()
      .subscribe((angarya: Task[]) => {

        //const rows = []
        //angarya.forEach(gorev => rows.push(gorev, { detailRow: true, gorev }));

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

  getPerson(id: string) {
    if (this.kadro.length > 0) {
      return this.kadro.find(x => x._id == id).fullname;
    } else return 'Kaçak'
  }

  getPersonInitials(id: string) {
    if (this.kadro.length > 0) {
      let name = this.kadro.find(x => x._id == id).fullname;
      return name.match(/\b(\w)/g).join('').toLowerCase();
    } else return 'N/A'
  }

  goToPerson(id: string) {
    let p = this.kadro.find(x => x._id == id).username;
    this._router.navigate(['/kadro/' + p])
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onDetail(a) {
    this._router.navigate(['/angarya/' + a._id]);
  }

}
