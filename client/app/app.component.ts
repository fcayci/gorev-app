import { Component } from '@angular/core';
import { UserDataService } from './services/userdata.service';
import { TaskDataService } from './services/taskdata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    UserDataService,
    TaskDataService
  ]
})

export class AppComponent {
}
