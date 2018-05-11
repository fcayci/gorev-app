import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { OE } from '../../oe';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'kisi-add',
  templateUrl: './kisi-add.component.html',
  styleUrls: ['./kisi-add.component.css']
})

export class KisiAddComponent {

  profile : OE = {...};
  title = 'Yeni Kişi Ekle';

  constructor(
    private router: Router,
    private _user: UserService,
    private location: Location) {}

  savePerson() {
    this._user.addKisi(this.profile)
      .subscribe(res => {
    });

    setTimeout(() => this.router.navigate(['/kadro']), 800);
  }
}
