import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    private _router: Router,
    private _user: UserService) {}

  savePerson() {
    this._user.addKisi(this.profile)
      .subscribe(res => {
    });

    setTimeout(() => this._router.navigate(['/kadro']), 800);
  }
}
