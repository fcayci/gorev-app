import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';

import * as moment from 'moment';

import { Faculty } from '../../faculty';
import { Busy } from '../../busy';
import { BusyService } from '../../services/busy.service';
import { ToasterService } from '../../services/toaster.service';
import { FacultyBusyAddComponent } from './faculty-busy-add.component';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

export class msg {
  'ok': number;
  'n' : number
}

@Component({
  selector: 'faculty-busy',
  templateUrl: './faculty-busy.component.html'
})

export class FacultyBusyComponent implements OnInit, OnChanges{

  @Input() profile: Faculty;

  displayedColumns = ['title', 'date', 'time', 'recur', 'expired'];
  dataSource: MatTableDataSource<Busy>;
  today;
  title = 'Meşguliyet';
  showdelete = false;

  constructor(
    private _busy: BusyService,
    private _toaster: ToasterService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.today = moment();
  }

  ngOnChanges() {
    if(this.profile){
      this._busy.getBusyById('owner', this.profile._id)
        .subscribe((busies : Busy[]) => {
          let b = busies.filter(i => !i.task_id)
          this.dataSource = new MatTableDataSource(b);
      });
    }
  }

  // FIXME: Ask for confirmation before removing
  // FIXME: Add error handler
  onDelete(busy: Busy, i: number): void {
    this._busy.deleteBusy(busy)
      .subscribe((res: msg) => {
        if (res.ok == 1){
          let oldData = this.dataSource.data;
          oldData.splice(i,1);
          this.dataSource.data = oldData;
          this._toaster.info(busy.title + ' silindi.')
        }
      });
  }

  isExpired(d) {
    return this.today.isAfter(d)
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(FacultyBusyAddComponent, {
      width: '400px',
      data: this.profile
    });

    dialogRef.afterClosed().subscribe(msg => {
      if (msg == -1) {
        this._toaster.info('Hatali giris')
      }
      else if (msg){
        const oldData = this.dataSource.data;
        oldData.push(msg);
        this.dataSource.data = oldData;
        this._toaster.info(msg.title + ' eklendi.')
      }
    });
  }

  toggleEdit(){
    this.showdelete = !this.showdelete;
  }

}

