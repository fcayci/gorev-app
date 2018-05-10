import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OE } from '../../../../schemas';

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
  ) {}

  sendMessage(e) {
    this.submitEvent.emit(e)
  }

  //get diagnostic() { return JSON.stringify(this.profile); }
}
