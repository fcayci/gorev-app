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
    });
  }

  showEdit(){
    this.edit = !this.edit;
  }

  goBack(){
    this.location.back();
  }
}
