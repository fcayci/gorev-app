import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { OE } from '../../../schemas';
import { UserDataService } from '../../services/userdata.service';

@Component({
  selector: 'kisi-add',
  templateUrl: '../kisi/kisi-profile/kisi-profile.component.html',
  styleUrls: ['../kisi/kisi-profile/kisi-profile.component.css']
})

export class KisiAddComponent {
  @Input() kadro: OE[];

  kisi = {email:''};
  fullname = 'Yeni Kişi Ekle';
  edit = true;
  newKisi = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userDataService:UserDataService,
    private location: Location) {}

  ngOnInit(): void {
    // TODO: remove this for production
    console.log('[kadro.component] kadro grabbed from db');
    this.getKadro();
  }

  getKadro() : void {
    this.userDataService.getKadro()
      .subscribe(kadro => {
        this.kadro = kadro;
      });
  }

  addKisi() {
    var result = this.kadro.filter(p => p.email === this.kisi.email).length;
    if (result == 0) {

      // TODO: remove this for production
      console.log('[kadro.component.ts] Adding kisi');
      this.userDataService.addKisi(this.kisi)
        .subscribe(res => {
          this.kadro.push(res);
        });

      setTimeout(() => this.router.navigate(['/kadro/'+ this.kisi.email]), 800);

    }
    else {
      // TODO: remove this for production
      console.log('[kadro.component.ts] Kisi exists');
    }
  }

  resetKisi(): void {
    this.kisi = {email:''};
  }

  goBack(){
    this.location.back();
  }

  get diagnostic() { return JSON.stringify(this.kisi); }
}
