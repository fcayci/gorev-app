import { Component, OnInit } from '@angular/core';

import { OE } from '../../oe';
import { UserDataService } from '../../services/userdata.service';

@Component({
  selector: 'kadro',
  templateUrl: './kadro.component.html'
})

export class KadroComponent implements OnInit {

  kadro : OE[];

  constructor(private _user: UserDataService) {}

  ngOnInit(): void {

    this._user.getKadro()
      .subscribe((kadro : OE[]) => {
        console.log(kadro)
        this.kadro = kadro;
      });
  }
}
