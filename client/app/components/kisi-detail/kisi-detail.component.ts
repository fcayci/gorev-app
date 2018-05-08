import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { OE } from '../../../ogretimelemani';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'kisi-detail',
  templateUrl: './kisi-detail.component.html',
  styleUrls: ['./kisi-detail.component.css']
})

export class KisiDetailComponent implements OnInit {

  @Input() kisi: OE;
  __kisi = {};
  fullname = null;

  edit = false;

  constructor(
    private route: ActivatedRoute,
    private dataService:DataService,
    private location: Location) {}

  ngOnInit(): void {
    this.getKisi();
  }

  getKisi(): void {
    const username = this.route.snapshot.paramMap.get('id');
    this.dataService.getKisi(username)
      .subscribe(kisi => {
        this.kisi = kisi;
        this.fullname = this.kisi.fullname;
        this.__kisi = JSON.parse(JSON.stringify(this.kisi));
    });
  }

  updateKisi(): void {
    this.dataService.updateKisi(this.kisi)
      .subscribe(res => {
        console.log(res);
        this.fullname = this.kisi.fullname;
        this.__kisi = JSON.parse(JSON.stringify(this.kisi));
      });

    this.showEdit();
  }

  // go back to original form when hit cancel.
  resetKisi(): void {
    this.kisi = JSON.parse(JSON.stringify(this.__kisi));
    this.showEdit();
  }

  showEdit(){
    this.edit = !this.edit;
  }

  goBack(){
    this.location.back();
  }
}
