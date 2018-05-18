import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';

import * as moment from 'moment';

import { OE } from '../../oe';
import { Zaman } from '../../zaman';
import { BusyService } from '../../services/busy.service';
import { MesgulAddComponent } from '../mesgul-add/mesgul-add.component';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

export class msg {
  'ok': number;
  'n' : number
}

@Component({
  selector: 'mesgul',
  templateUrl: './mesgul.component.html'
})

export class MesgulComponent implements OnInit, OnChanges{

  @Input() profile: OE;
  @Output() submitEvent = new EventEmitter<string>();

  displayedColumns = ['title', 'date', 'time', 'recur'];
  dataSource: MatTableDataSource<Zaman>;

  title = 'Meşguliyet';

  constructor(
    private _busy: BusyService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {}

  ngOnInit(): void {
  }

  ngOnChanges() {
    if(this.profile){
      this.getBusies();
    }
  }

  getBusies(): void {
    this._busy.getBusyByOwnerId(this.profile._id)
      .subscribe((busies : Zaman[]) => {
        this.dataSource = new MatTableDataSource(busies);
    });
  }

  parseForm(f){
    // Get the dates as is. if .dateOnly() method is used, we lose timezone.
    var sd = moment(f.startDate)
    var ed = moment(f.endDate)

    // Make sure dates are the same or end is bigger
    if (sd.isAfter(ed)){
      return -1
    }

    sd = sd.add(f.startTime.slice(0,2), 'h');
    sd = sd.add(f.startTime.slice(-2), 'm');
    ed = ed.add(f.endTime.slice(0,2), 'h');
    ed = ed.add(f.endTime.slice(-2), 'm');

    // Make sure start date is after end.
    if (sd.isSameOrAfter(ed)){
      console.log('3')
      return -1
    }

    var model : Zaman = {
      title : f.title,
      startDate : sd.format(),
      endDate : ed.format(),
      owner_id : this.profile._id,
      recur : f.recur
    };

    return model;
  }

  addBusyToOwner(b): void {
    this._busy.setBusyByOwnerId(b)
      .subscribe(res => {
        this.openSnackBar(res.title + ' başarıyla eklendi.')
        const oldData = this.dataSource.data;
        oldData.push(res);
        this.dataSource.data = oldData;
      });
  }

  removeBusy(s): void {
    // TODO: Remove from user's busy list as well
    this._busy.delBusyByTimeId(s._id)
      .subscribe((res: msg) => {
         if (res.ok == 1){
            const oldData = this.dataSource.data;
            oldData.splice(s,1);
            this.dataSource.data = oldData;
         }
      });
  }

  // FIXME: Add the busy object ot users busy field
  pushBusyToUser(busy): void {
    // TODO implement this
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(MesgulAddComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(mesg => {
      if (mesg){
        const busy = this.parseForm(mesg);
        if (busy != -1) {
          // const { range } = extendMoment(moment);

          // var x = moment('2018-05-23T10:00:00+03:00')
          // var y = moment('2018-05-23T12:00:00+03:00')
          // console.log('x: ', x)
          // console.log('y:', y)
          // const rg = range(x, y)
          // console.log('rg:', rg)

          // const rb = range(busy.startDate + '/' + busy.endDate);
          // console.log('rb', rb)

          // console.log(rb.overlaps(rg))
          this.addBusyToOwner(busy);
        }
        else {
          this.openSnackBar('Hatalı tarih girişi')
        }
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}

