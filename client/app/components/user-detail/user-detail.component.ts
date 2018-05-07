import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { OE } from '../../../ogretimelemani';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {

  @Input() kisi: Kisi;
  _kisiBak = {};
  fullname = null;

  edit = false;

  constructor(
    private route: ActivatedRoute,
    private dataService:DataService,
    private location: Location) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataService.getUser(id)
      .subscribe(kisi => {
        this.kisi = kisi;
        this.fullname = this.kisi.fullname;
        this._kisiBak = JSON.parse(JSON.stringify(this.kisi));
    });
  }

  updateUser(): void {
    this.dataService.updateUser(this.kisi)
      .subscribe(res => {
        console.log(res);
        this.fullname = this.kisi.fullname;
        this._kisiBak = JSON.parse(JSON.stringify(this.kisi));
      });

    this.showEdit();
  }

  // go back to original form when hit cancel.
  resetUser(): void {
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
