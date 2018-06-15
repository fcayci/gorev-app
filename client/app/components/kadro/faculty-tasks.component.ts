import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import * as moment from 'moment';

import { Faculty } from '../../faculty';
import { Busy } from '../../busy';
import { BusyService } from '../../services/busy.service';

@Component({
  selector: 'faculty-tasks',
  templateUrl: './faculty-tasks.component.html'
})

export class FacultyTasksComponent implements OnInit, OnChanges{

  @Input() profile: Faculty;

  displayedColumns = ['title', 'date', 'time', 'duration', 'weight', 'expired'];
  dataSource: MatTableDataSource<Busy>;
  today;
  title = 'Görevlendirmeler';

  constructor(
    private _busy: BusyService) {}

  ngOnInit(): void {
    this.today = moment();
  }

  ngOnChanges() {
    if(this.profile){
      this._busy.getBusyById('owner', this.profile._id)
        .subscribe((busies : Busy[]) => {
          let b = busies.filter(i => i.task_id)
          this.dataSource = new MatTableDataSource(b);
      });
    }
  }

  isExpired(d) {
    return this.today.isAfter(d)
  }


}