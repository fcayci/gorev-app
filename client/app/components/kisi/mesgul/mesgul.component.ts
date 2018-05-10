import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { OE, Zaman } from '../../../../schemas';
import { BusyDataService } from '../../../services/busydata.service';


@Component({
  selector: 'mesgul',
  templateUrl: './mesgul.component.html',
  styleUrls: ['./mesgul.component.css']
})

export class MesgulComponent implements OnInit {

  @Input() profile: OE;
  @Input() edit: string;

  busydb : Zaman[];
  busy : Zaman[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private busyDataService: BusyDataService
  ) {}

  ngOnInit(): void {
    this.busyDataService.getBusyByOwnerId(this.profile._id)
      .subscribe(busy => {
        //console.log('wanted', busy)
        this.busydb = busy;
    });
  }

  get diagnostic() { return JSON.stringify(this.busydb); }
}
