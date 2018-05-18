import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';

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

  displayedColumns = ['date', 'time'];//['title', 'date', 'time', 'repeat'];
  dataSource: any;

  busies : Zaman[];
  today = moment().format('LLLL (Z)');
  title = 'Meşguliyet';

  constructor(
    private _busy: BusyService,
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
        this.busies = busies;
        this.dataSource = new MatTableDataSource(this.busies);
    });
  }

  onSubmit() : void {
    console.log('will submit');
    // const busy : Zaman = this.parseBusyInput();
    // this.addBusyToOwner(busy);
    // this.pushBusyToUser(busy);
  }


  parseForm(f){
    var model : Zaman = {
      title : '',
      startDate : '',
      endDate : '',
      owner_id : '',
      recur : 0
    };

    var sd = moment(f.startDate)
    var ed = moment(f.endDate)
    if (sd.isAfter(ed)){
      return -1
    }

    sd = sd.add(f.startTime.slice(0,2), 'h');
    sd = sd.add(f.startTime.slice(-2), 'm');
    ed = ed.add(f.endTime.slice(0,2), 'h');
    ed = ed.add(f.endTime.slice(-2), 'm');

    if (sd.isSameOrAfter(ed)){
      return -1
    }

    model.title = f.title;
    model.startDate = sd.format();
    model.endDate = ed.format();
    model.recur = f.recur;
    model.owner_id = this.profile._id;
    console.log(model);
    return model;
  }

  addBusyToOwner(b): void {
    this._busy.setBusyByOwnerId(b)
      .subscribe(res => {
        this.busies.push(res);
      });
  }

  removeBusy(s): void {
    // TODO: Remove from user's busy list as well
    this._busy.delBusyByTimeId(this.busies[s])
      .subscribe((res: msg) => {
         if (res.ok == 1){
            this.busies.splice(s,1);
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
          const { range } = extendMoment(moment);

          var x = moment('2018-05-23T10:00:00+03:00')
          var y = moment('2018-05-23T12:00:00+03:00')
          console.log('x: ', x)
          console.log('y:', y)
          const rg = range(x, y)
          console.log('rg:', rg)

          const rb = range(busy.startDate + '/' + busy.endDate);
          console.log('rb', rb)

          console.log(rb.overlaps(rg))

          //this.openSnackBar(result.position + ' ' + result.fullname + ' başarıyla eklendi.')
          //this.getKadro();
        }
      }
    });
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}

