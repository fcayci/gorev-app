import { Component, OnInit } from '@angular/core';

//import { OE } from '../../../schemas';
import { UserDataService } from '../../services/userdata.service';

@Component({
  selector: 'kadro',
  templateUrl: './kadro.component.html'
})

export class KadroComponent implements OnInit {

  // TODO: See if there is a better way to instantiate an object.
  // kadro will hold the current kadro
  kadro = {};

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {

    // get current kadro from db using user data service
    this.userDataService.getKadro()
      .subscribe(kadro => {
        this.kadro = kadro;
      });
  }

}
