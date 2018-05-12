import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gorev } from '../../gorev';
import { TaskService } from '../../services/task.service';

export class msg {
  'ok': number;
  'n' : number
}

@Component({
  selector: 'gorev',
  templateUrl: './gorev.component.html'
})

export class GorevComponent implements OnInit {

  // TODO: See if there is a better way to instantiate an object.
  // kadro will hold the current kadro
  gorev : Gorev;

  constructor(
    private _task: TaskService,
    private _router: Router,
    private _route: ActivatedRoute) {}

  ngOnInit(): void {
    var id = this._route.snapshot.paramMap.get('id');
    this._task.getTaskById(id)
      .subscribe((gorev: Gorev) => {
        this.gorev = gorev;
      });
  }

  removeTask(): void {
    // TODO: Remove from user's busy list as well
    this._task.delTaskById(this.gorev)
      .subscribe((res: msg) => {
         if (res.ok == 1){
            setTimeout(() => this._router.navigate(['/angarya']), 800);
         }
      });
  }


  get diagnostic() { return JSON.stringify(this.gorev); }
}
