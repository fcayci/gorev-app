import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { OE } from '../../oe';
import { UserDataService } from '../../services/userdata.service';

@Component({
  selector: 'kisi-add',
  templateUrl: './kisi-add.component.html',
  styleUrls: ['./kisi-add.component.css']
})

export class KisiAddComponent {

  profile : OE;
  title = 'Yeni Kişi Ekle';
  edit = true;
  newKisi = true;

  constructor(
    private router: Router,
    private userDataService:UserDataService,
    private location: Location) {}

  savePerson() {
    console.log('[kisi-add.component.ts] Adding kisi');
    this.userDataService.addKisi(this.profile)
      .subscribe(res => {
      });

    setTimeout(() => this.router.navigate(['/kadro']), 800);
  }

  returnBackToInfinity(): void {
    this.location.back();
  }

  //get diagnostic() { return JSON.stringify(this.kisi); }
}
