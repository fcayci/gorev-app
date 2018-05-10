import { Component, OnInit } from '@angular/core';

import { OE, Gorev } from '../../../schemas';
import { TaskDataService } from '../../services/taskdata.service';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html'
})

export class TasksComponent implements OnInit {

  // TODO: See if there is a better way to instantiate an object.
  // kadro will hold the current kadro
  gs : Gorev[];

  constructor(private taskDataService: TaskDataService) {}

  ngOnInit(): void {

    this.taskDataService.getAllTasks()
      .subscribe(gs => {
        this.gs = gs;
      });
  }

}
