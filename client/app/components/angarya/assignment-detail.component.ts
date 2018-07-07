import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

import { FSortPipe } from '../../pipes/fsort.pipe';

import { Busy } from '../../busy';
import { Task, TYPES, GSTATES } from '../../task';
import { Faculty } from '../../faculty';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { BusyService } from '../../services/busy.service';

export class Msg {
  'ok': number;
  'n': number;
}

@Component({
  selector: 'assignment-detail',
  templateUrl: './assignment-detail.component.html'
})

export class AssignmentDetailComponent implements OnInit {

  title: string;
  kadro: Faculty[] = [];
  available: Faculty[] = [];
  notAvailable: Faculty[] = [];

  busytimes: Busy[];
  alltasks: Task[];
  gorev: Task;
  gorevForm: FormGroup;
  argor = true;
  dr = false;
  duration;
  formTimeValid = false;
  showTimeError = true;

  gstates = GSTATES;
  types = TYPES;
  numbers: Array<number> = [];
  weights: Array<number> = [];

  constructor(
    private _fsort: FSortPipe,
    private _task: TaskService,
    private _user: UserService,
    private _busy: BusyService,
    private _router: Router,
    private _fb: FormBuilder,
    private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._user.getKadro()
      .subscribe((kadro: Faculty[]) => {
        this.kadro = kadro;
    });

    this._busy.getBusyAll()
      .subscribe((res: Busy[]) => {
        this.busytimes = res;
    });

    this._task.getOpenTasks()
      .subscribe((res: Task[]) => {
        this.alltasks = res;
    });

    this.createForm();
    this.gorevForm.disable();

    this.numbers = Array(7).fill(0).map((x, i) => i + 1);
    this.weights = Array(12).fill(0).map((x, i) => (i + 1) / 4);

    const id = this._route.snapshot.paramMap.get('id');
    this._task.getTasksById(id)
      .subscribe((gorev: Task[]) => {
        if (gorev.length === 0) {
          this._router.navigate(['/angarya']);
        } else {
          // The return will be a single item array. Just pass the first item.
          this.gorev = gorev[0];
          this.title = this.gorev.title;
          this.gorevForm.patchValue(this.gorev);
          this.parseTime(this.gorev);

          this.validateTimeAndFindAvailable();
        }
      });
  }

  onDelete(): void {

    // var model : Busy = {
    //   title : gorev.title,
    //   startDate : gorev.startDate,
    //   endDate : gorev.endDate,
    //   recur : 0,
    //   owner_id : ''
    // };

    // for(let i=0; i < gorev.peopleCount; i++) {
    //   model.owner_id = gorev.choosenPeople[i];
    //   this._busy.setBusyByOwnerId(model)
    //     .subscribe(res => {
    //       // this.openSnackBar(res.title + ' başarıyla eklendi.')
    //     });
    // }

    var gids;

    this._busy.getBusyById('task', this.gorev._id)
      .subscribe((res) => {
        gids = res;
    });

    // this._busy.deleteBusy()
    //   .subscribe(() => {
    //   })

    this._task.delTaskById(this.gorev)
      .subscribe((res: Msg) => {
         if (res.ok === 1) {
            setTimeout(() => this._router.navigate(['/angarya']), 800);
         }
      });
  }

  createForm(): void {
    this.gorevForm = this._fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      gDate: [, Validators.required],
      startTime: [, Validators.required],
      endTime: [, Validators.required],
      weight: [, Validators.required],
      peopleCount: [, [Validators.required, Validators.pattern('[1-7]')]],
      duration: [],
      startDate: [],
      endDate: [],
      choosenPeople: [[]],
      status: [],
      selector: [],
      selectedPerson: []
    });
  }

  getPerson(id: string): string {
    if (this.kadro.length === 0) {
      return '';
    } else {
      const p = this.kadro.find(x => x._id === id);
      return p.position + ' ' + p.fullname;
    }
  }

  onPersonClick(id: string) {
    // Route to Person
  }

  parseTime(g): void {
    const m = {
      gDate : moment(g.startDate).format('YYYY-MM-DD'),
      startTime : moment(g.startDate).format('HH:mm'),
      endTime : moment(g.endDate).format('HH:mm')
    };
    this.gorevForm.patchValue(m);
  }

  enableGroup(): void {
    this.gorevForm.enable();
  }

  disableGroup(): void {
    this.gorevForm.disable();
    this.gorevForm.controls['selectedPerson'].setValue('');
  }

  removeFromChoosenPeople(pid) {
    // FIXME: Remove person from the task
    // FIXME: Remove task from persons list
  }

  addToChoosenPeople() {
    const g = this.gorevForm.value;
    const p: Faculty = g.selectedPerson;

    // if(g.choosenPeople.indexOf(p) === -1) {
    //   g.choosenPeople.push(p);
    //   this.gorevForm.value.choosenPeople.push(p._id);
    // }

    // // Remove choosen from available
    // let index = this.available.indexOf(p, 0);
    // if (index > -1) {
    //   this.available.splice(index, 1);
    // }

    // // Disable form if good to go.
    // if (this.gorevForm.value.peopleCount == this.choosenPeople.length) {
    //   this.peopleForm.controls['selectedPerson'].disable();
    // }

    // // Reset form
    // this.peopleForm.controls['selectedPerson'].setValue('');
  }

  findBusies(gs, ge): Array<string> {
    const { range } = extendMoment(moment);

    // Not availables
    const NAs = [];
    const gorevrange = range(gs, ge);

    // Merge two arrays to have a unified busy object for testing.
    const busies = Object.assign(this.busytimes, this.alltasks);

    for (const busy of busies) {

      // This is only availabe in busytimes, so no worries here
      if (busy.recur) {
        const interval = moment(busy.startDate).recur().every(busy.recur).days();

        if (interval.matches(gs)) {

          // Since this is an interval, we need to create the exact date for checking.
          const bs = moment(gs.format('YYYY-MM-DD') + 'T' + moment(busy.startDate).format('HH:mm'));
          const be = moment(ge.format('YYYY-MM-DD') + 'T' + moment(busy.endDate).format('HH:mm'));
          const busyrange = range(bs, be);

          if (busyrange.overlaps(gorevrange)) {
            if (NAs.indexOf(busy.owner_id) === -1) {
              NAs.push(busy.owner_id);
            }
          }
        }
      } else {
        const bs = moment(busy.startDate);
        const be = moment(busy.endDate);
        const busyrange = range(bs, be);

        // This can be both busytimes and tasks
        if (busyrange.overlaps(gorevrange)) {
          if (busy.owner_id) {
            if (NAs.indexOf(busy.owner_id) === -1) {
              NAs.push(busy.owner_id);
            }
          } else {
            for (let i = 0; i < busy.peopleCount; i++) {
              if (NAs.indexOf(busy.choosenPeople[i])) {
                NAs.push(busy.choosenPeople[i]);
              }
            }
          }
        }
      }
    }
    return NAs;
  }

  validateTimeAndFindAvailable(): void {
    this.gorevForm.statusChanges.subscribe(status => {
      if (status === 'VALID') {

        this.available = [];
        this.notAvailable = [];
        const t = this.gorevForm.value;

        // Get the dates as is. if .dateOnly() method is used, we lose timezone.
        let sd = moment(t.gDate);
        let ed = moment(t.gDate);

        // Combine the date & times
        sd = sd.add(t.startTime.slice(0, 2), 'h');
        sd = sd.add(t.startTime.slice(-2), 'm');
        ed = ed.add(t.endTime.slice(0, 2), 'h');
        ed = ed.add(t.endTime.slice(-2), 'm');

        t.duration = moment.duration(ed.diff(sd)).as('hours');
        t.load = t.duration * t.weight;

        // Make sure start date is after end.
        if (sd.isSameOrAfter(ed)) {
          this.formTimeValid = false;
          this.showTimeError = true;
        } else {
          this.gorevForm.value.startDate = sd.format();
          this.gorevForm.value.endDate = ed.format();

          this.formTimeValid = true;
          this.showTimeError = false;

          const NAids = this.findBusies(sd, ed);

          for (const k of this.kadro ) {
            // If kisi id is not in NAids, AND not already assigned to task add to available
            if (NAids.indexOf(k._id) === -1 && this.gorevForm.value.choosenPeople.indexOf(k._id) === -1){
              this.available.push(k);
            } else {
              this.notAvailable.push(k);
            }
          }
          this.available = this._fsort.transform(this.available, 'load');
          this.notAvailable = this._fsort.transform(this.notAvailable, 'load');
        }
      }
    });
  }
}
