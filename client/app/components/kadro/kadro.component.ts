import { Component, OnInit } from '@angular/core';

import { OE } from '../../oe';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'kadro',
  templateUrl: './kadro.component.html'
})

export class KadroComponent implements OnInit {

  kadro : OE[];

  constructor(private _user: UserService) {}

  ngOnInit(): void {

    this._user.getKadro()
      .subscribe((kadro : OE[]) => {
        console.log(kadro)
        this.kadro = kadro;
      });
  }
}
