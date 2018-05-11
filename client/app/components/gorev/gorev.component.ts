import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gorev } from '../../gorev';
import { TaskDataService } from '../../services/taskdata.service';

@Component({
  selector: 'gorev',
  templateUrl: './gorev.component.html'
})

export class GorevComponent implements OnInit {

  // TODO: See if there is a better way to instantiate an object.
  // kadro will hold the current kadro
  gorev : Gorev;

  constructor(
    private _task: TaskDataService,
    private router: Router,
    private route: ActivatedRoute,) {}

  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    this._task.getTaskById(id)
      .subscribe((gorev: Gorev) => {
        this.gorev = gorev;
      });
  }

  get diagnostic() { return JSON.stringify(this.gorev); }
}
