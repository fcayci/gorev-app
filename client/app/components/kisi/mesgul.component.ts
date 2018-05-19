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

  displayedColumns = ['title', 'date', 'time', 'recur', 'expired'];
  dataSource: MatTableDataSource<Zaman>;
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
      .subscribe((busies : Zaman[]) => {
        this.dataSource = new MatTableDataSource(busies);
    });
  }

  removeBusy(s, i): void {
    console.log(s)
    // TODO: Remove from user's busy list as well
    this._busy.delBusyByTime(s)
      .subscribe((res: msg) => {
        if (res.ok == 1){
          const oldData = this.dataSource.data;
          oldData.splice(i,1);
          this.dataSource.data = oldData;
        }
      });
  }


  isExpired(d) {
    return this.today.isAfter(d)
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(MesgulAddComponent, {
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

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}

