import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OE } from '../../oe';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent{

  @Input() profile: OE;
  @Input() edit: boolean;
  @Output() submitEvent = new EventEmitter<string>();

  sendMessage(e) {
    this.submitEvent.emit(e)
  }

  constructor(
  ) {}

}
