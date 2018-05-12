import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OE } from '../../oe';
import { UserService } from '../../services/user.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html'
})

export class TasksComponent implements OnInit {

  @Input() profile: OE;
  @Input() edit: boolean;

  tasks : {};

  constructor(
    private _user:UserService,
    private _task:TaskService
  ) {}

  ngOnInit(): void {
    // this._task.getTasksByOwnerId(this.profile._id)
    //   .subscribe(res => {
    //     console.log('[kisi-tasks] wanted', res)
    //     this.tasks = res;
    // });
  }

  //get diagnostic() { return JSON.stringify(this.profile); }
}
