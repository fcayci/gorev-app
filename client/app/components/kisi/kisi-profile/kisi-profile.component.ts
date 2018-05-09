import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { OE } from '../../../../schemas';
import { UserDataService } from '../../../services/userdata.service';

@Component({
  selector: 'kisi-profile',
  templateUrl: './kisi-profile.component.html',
  styleUrls: ['./kisi-profile.component.css']
})

export class KisiProfileComponent{

  @Input() profile: OE;
  @Input() edit: boolean;
  @Output() submitEvent = new EventEmitter<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userDataService:UserDataService
  ) {}

  sendMessage(e) {
    this.submitEvent.emit(e)
  }

  //get diagnostic() { return JSON.stringify(this.profile); }

}
