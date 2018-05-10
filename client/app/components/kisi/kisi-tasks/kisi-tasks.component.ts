import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OE } from '../../../../schemas';
import { UserDataService } from '../../../services/userdata.service';
import { TaskDataService } from '../../../services/taskdata.service';

@Component({
  selector: 'kisi-tasks',
  templateUrl: './kisi-tasks.component.html'
})

export class KisiTasksComponent implements OnInit {

  @Input() profile: OE;
  @Input() edit: boolean;

  tasks : {};

  constructor(
    private userDataService:UserDataService,
    private taskDataService:TaskDataService
  ) {}

  ngOnInit(): void {
    // this.taskDataService.getTasksByOwnerId(this.profile._id)
    //   .subscribe(res => {
    //     console.log('[kisi-tasks] wanted', res)
    //     this.tasks = res;
    // });
  }

  //get diagnostic() { return JSON.stringify(this.profile); }
}
