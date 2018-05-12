import { Component, OnInit } from '@angular/core';

import { Gorev } from '../../gorev';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'angarya',
  templateUrl: './angarya.component.html'
})

export class AngaryaComponent implements OnInit {

  // TODO: See if there is a better way to instantiate an object.
  // kadro will hold the current kadro
  angarya : Gorev[];

  constructor(private _task: TaskService) {}

  ngOnInit(): void {

    this._task.getAllTasks()
      .subscribe((angarya: Gorev[]) => {
        this.angarya = angarya;
      });
  }

  get diagnostic() { return JSON.stringify(this.angarya); }
}
