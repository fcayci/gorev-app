import { Component, OnInit } from '@angular/core';

import { OE, Gorev } from '../../../schemas';
import { TaskDataService } from '../../services/taskdata.service';

@Component({
  selector: 'angarya',
  templateUrl: './angarya.component.html'
})

export class AngaryaComponent implements OnInit {

  // TODO: See if there is a better way to instantiate an object.
  // kadro will hold the current kadro
  angarya : Gorev[];

  constructor(private taskDataService: TaskDataService) {}

  ngOnInit(): void {

    this.taskDataService.getAllTasks()
      .subscribe(angarya => {
        this.angarya = angarya;
        console.log(angarya);
      });
  }

  get diagnostic() { return JSON.stringify(this.angarya); }
}
