import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Kisi } from '../../../person';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})

export class PersonDetailComponent implements OnInit {

  @Input() kisi: Kisi;
  _kisiBak = {};
  fullname = null;

  edit = false;

  constructor(
    private route: ActivatedRoute,
    private dataService:DataService,
    private location: Location) {}

  ngOnInit(): void {
    this.getPerson();
  }

  getPerson(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataService.getPerson(id)
      .subscribe(kisi => {
        this.kisi = kisi;
        this.fullname = this.kisi.fullname;
        this._kisiBak = JSON.parse(JSON.stringify(this.kisi));
    });
  }

  updatePerson(): void {
    this.dataService.updatePerson(this.kisi)
      .subscribe(res => {
        console.log(res);
        this.fullname = this.kisi.fullname;
        this._kisiBak = JSON.parse(JSON.stringify(this.kisi));
      });

    this.showEdit();
  }

  // go back to original form when hit cancel.
  resetPerson(): void {
    this.kisi = JSON.parse(JSON.stringify(this._kisiBak));
    this.showEdit();
  }

  showEdit(){
    this.edit = !this.edit;
  }

  goBack(){
    this.location.back();
  }
}
