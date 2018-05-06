import { Component } from '@angular/core';
import { PasserService } from './services/passer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PasserService]
})

export class AppComponent {
}
