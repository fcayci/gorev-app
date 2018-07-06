import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { Faculty } from '../../faculty';
import { Task } from '../../task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'faculty-tasks',
  templateUrl: './faculty-tasks.component.html'
})

export class FacultyTasksComponent implements OnInit, OnChanges {

  @Input() profile: Faculty;

  displayedColumns = ['title', 'date', 'time', 'duration', 'expired', 'load'];
  dataSource: MatTableDataSource<Task>;
  today;
  totalLoad: number;
  title = 'Görevlendirmeler';

  constructor(
    private _task: TaskService,
    private _router: Router) {}

  ngOnInit(): void {
    this.today = moment();
  }

  ngOnChanges() {
    if (this.profile) {
      this._task.getTasksByIds(this.profile.tasks)
        .subscribe((tasks: Task[]) => {
          console.log(tasks);
          //this.totalLoad = tasks.map(i => i.load).reduce((acc, value) => acc + value, 0);
          this.dataSource = new MatTableDataSource(tasks);
      });
    }
  }

  onClick(r) {
    this._router.navigate(['/angarya/' + r.task_id]);
  }

  isExpired(d) {
    return this.today.isAfter(d);
  }
}
