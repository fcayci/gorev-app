import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { Gorev } from '../../gorev';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'gorev-add',
  templateUrl: './gorev-add.component.html',
  styleUrls: ['./gorev-add.component.css']
})

export class GorevAddComponent {

  model : Gorev = {...};
  title = 'Yeni Gorev Ekle';
  edit = true;
  newGorev = true;

  constructor(
    private _router: Router,
    private _task:TaskService,
    private _location: Location) {}

  saveTask() {
    var candidate : Gorev = {...};
    candidate.title = this.model.title;
    candidate.type = this.model.type;
    candidate.startDate = new Date(this.model.startDate + 'T' + this.model.startTime);
    candidate.endDate = new Date(this.model.endDate + 'T' + this.model.endTime);
    candidate.peopleCount = this.model.peopleCount;

    this._task.addTask(candidate)
      .subscribe(res => {
    });

    setTimeout(() => this._router.navigate(['/angarya']), 800);
  }

  returnBackToInfinity(): void {
    this._location.back();
  }

  get diagnostic() { return JSON.stringify(this.model); }
}
