import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';

import * as moment from 'moment';

import { Faculty } from '../../faculty';
import { Busy } from '../../busy';
import { BusyService } from '../../services/busy.service';
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
  @Output() submitEvent = new EventEmitter<string>();

  displayedColumns = ['title', 'date', 'time', 'recur', 'expired'];
  dataSource: MatTableDataSource<Busy>;
  today;
  title = 'Meşguliyet';
  showdelete = false;

  constructor(
    private _busy: BusyService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.today = moment();
  }

  ngOnChanges() {
    if(this.profile){
      this.getBusies();
    }
  }

  getBusies(): void {
    this._busy.getBusyByOwnerId(this.profile._id)
      .subscribe((busies : Busy[]) => {
        this.dataSource = new MatTableDataSource(busies);
    });
  }

  // FIXME: Ask for confirmation before removing
  removeBusy(busy, i): void {
    // TODO: Remove from user's busy list as well
    this._busy.delBusyByTime(busy)
      .subscribe((res: msg) => {
        if (res.ok == 1){
          let oldData = this.dataSource.data;
          oldData.splice(i,1);
          this.dataSource.data = oldData;
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

    dialogRef.afterClosed().subscribe(mesg => {
      if (mesg == -1) {
        this.openSnackBar('Hatalı tarih girişi')
      }
      else if (mesg){
        const oldData = this.dataSource.data;
        oldData.push(mesg);
        this.dataSource.data = oldData;
      }
    });
  }

  toggleEdit(){
    this.showdelete = !this.showdelete;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

}

