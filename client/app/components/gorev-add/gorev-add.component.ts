import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { Gorev } from '../../gorev';
import { TaskDataService } from '../../services/taskdata.service';

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
    private router: Router,
    private taskDataService:TaskDataService,
    private location: Location) {}

  saveTask() {
    var candidate : Gorev = {...};
    candidate.title = this.model.title;
    candidate.type = this.model.type;
    candidate.startDate = new Date(this.model.startDate + 'T' + this.model.startTime);
    candidate.endDate = new Date(this.model.endDate + 'T' + this.model.endTime);
    candidate.peopleCount = this.model.peopleCount;

    this.taskDataService.addTask(candidate)
      .subscribe(res => {
    });

    setTimeout(() => this.router.navigate(['/angarya']), 800);
  }

  returnBackToInfinity(): void {
    this.location.back();
  }

  get diagnostic() { return JSON.stringify(this.model); }
}
