import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

import { FSortPipe } from '../../pipes/fsort.pipe';

import { Time, Busy } from '../../busy';
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
  opentasks: Task[];
  gorev: Task;
  gorevForm: FormGroup;
  choosenPeopleIds: Array<string>;

  argor = true;
  dr = false;
  duration;
  formTimeValid = false;
  showTimeError = true;

  gstates = GSTATES;
  types = TYPES;
  numbers: Array<number> = Array(7).fill(0).map((x, i) => i + 1);
  weights: Array<number> = Array(13).fill(0).map((x, i) => i / 4);

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
        this.opentasks = res;
    });

    this.createForm();
    this.gorevForm.disable();

    const id = this._route.snapshot.paramMap.get('id');
    this._task.getTasksById(id)
      .subscribe((gorev: Task[]) => {
        if (gorev.length === 0) {
          this._router.navigate(['/angarya']);
        } else {
          // The return will be a single item array. Just pass the first item.
          this.gorev = gorev[0];
          this.title = gorev[0].title;
          this.gorev.when.gDate = moment(gorev[0].when.startDate).format('YYYY-MM-DD');
          this.gorev.when.startTime = moment(gorev[0].when.startDate).format('HH:mm');
          this.gorev.when.endTime = moment(gorev[0].when.endDate).format('HH:mm');
          this.gorevForm.patchValue(this.gorev);
          this.choosenPeopleIds = JSON.parse(JSON.stringify(gorev[0].choosenPeople));
          this.validateTimeAndFindAvailable();
        }
      });
  }

  onSave(): void {
    // Remove load/tasks from choosenPeopleIds - careful, old load should be removed
    // Add load/tasks to new choosenPeople - new load should be added
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

  //    // Add the task to the db
  //   this._task.addTask(gorev)
  //   .subscribe(res => {
  //     for (let i = 0; i < gorev.peopleCount; i++) {
  //       const p = this.kadro.filter(faculty => faculty._id === gorev.choosenPeople[i])[0];

  //       // Add task to the each of the assigned people
  //       this._user.addTaskAndIncrementLoadToKisi(p, res)
  //         .subscribe((kisi: Faculty) => {
  //           console.log(kisi);
  //         });
  //     }

  //     this._router.navigate(['/angarya']);
  // });
  }

  createForm(): void {
    this.gorevForm = this._fb.group({
      title: [String, Validators.required],
      type: [Number, Validators.required],
      when: this._fb.group({
        gDate: [ ],
        startTime: [ ],
        endTime: [ ]
      }),
      weight: [Number, Validators.required],
      peopleCount: [Number, Validators.required],
      choosenPeople: [[], Validators.required],
      status: [Number],
      selector: [Number],
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

  // In case this feature is wanted
  // onPersonClick(id: string) {
  //   const p = this.kadro.find(x => x._id === id);
  //   this._router.navigate(['/kadro/' + p.username]);
  // }

  enableGroup(): void {
    this.gorevForm.enable();
    // Disable selected person since people should be full
    this.gorevForm.controls['selectedPerson'].disable();
  }

  onCancel(): void {
    this.gorevForm.reset();
    this.gorevForm.disable();
    this.gorevForm.patchValue(this.gorev);
    this.gorevForm.controls['selectedPerson'].setValue('');
    this.choosenPeopleIds = JSON.parse(JSON.stringify(this.gorev.choosenPeople));
  }

  removeFromChoosenPeople(pid) {
    this.choosenPeopleIds.splice(pid, 1);

    // if (this.available.indexOf(p) === -1) {
    //   this.available.push(p);
    // }

    this.gorevForm.controls['selectedPerson'].enable();
  }

  addToChoosenPeople() {
    const p = this.gorevForm.value.selectedPerson;

    if (this.choosenPeopleIds.indexOf(p._id) === -1) {
        this.choosenPeopleIds.push(p._id);
    }

    // Remove seleted person from available list
    // const index = this.available.indexOf(p);
    // if (index > -1) {
    //   this.available.splice(index, 1);
    // }

    // Disable form if good to go.
    if (this.gorevForm.value.peopleCount === this.choosenPeopleIds.length) {
      this.gorevForm.controls['selectedPerson'].disable();
    }

    // Reset form
    this.gorevForm.controls['selectedPerson'].setValue('');
  }

  findBusies(gs, ge): Array<string> {
    const { range } = extendMoment(moment);

    // Busy people id list.
    const busyIds = [];
    const gorevrange = range(gs, ge);

    // Merge two arrays to have a unified busy object for testing.
    const busies = Object.assign(this.busytimes, this.opentasks);

    for (const busy of busies) {

      const b = busy.when;
      // Just in case
      if (b) {
        // This is only availabe in busytimes, so no worries here
        if (b.recur) {
          const interval = moment(b.startDate).recur().every(b.recur).days();

          if (interval.matches(gs)) {

            // Since this is an interval, we need to create the exact date for checking.
            const bs = moment(gs.format('YYYY-MM-DD') + 'T' + moment(b.startDate).format('HH:mm'));
            const be = moment(ge.format('YYYY-MM-DD') + 'T' + moment(b.endDate).format('HH:mm'));
            const busyrange = range(bs, be);

            if (busyrange.overlaps(gorevrange)) {
              if (busyIds.indexOf(busy.owner_id) === -1) {
                busyIds.push(busy.owner_id);
              }
            }
          }
        } else {
          const bs = moment(b.startDate);
          const be = moment(b.endDate);
          const busyrange = range(bs, be);

          // This can be both busytimes and tasks
          if (busyrange.overlaps(gorevrange)) {

            // owner_id only exists in busytimes
            if (busy.owner_id) {
              if (busyIds.indexOf(busy.owner_id) === -1) {
                busyIds.push(busy.owner_id);
              }
            } else {
              for (let i = 0; i < busy.peopleCount; i++) {
                if (busyIds.indexOf(busy.choosenPeople[i]) === -1) {
                  busyIds.push(busy.choosenPeople[i]);
                }
              }
            }
          }
        }
      }
    }
    return busyIds;
  }

  validateTimeAndFindAvailable(): void {
    this.gorevForm.statusChanges.subscribe(status => {
      if (status === 'VALID') {

        this.available = [];
        const t = this.gorevForm.value;

        // Get the dates as is. if .dateOnly() method is used, we lose timezone.
        let sd = moment(t.gDate);
        let ed = moment(t.gDate);

        // Combine the date & times
        sd = sd.add(t.startTime.slice(0, 2), 'h');
        sd = sd.add(t.startTime.slice(-2), 'm');
        ed = ed.add(t.endTime.slice(0, 2), 'h');
        ed = ed.add(t.endTime.slice(-2), 'm');

        // Calculate load based on duration and weight
        t.duration = moment.duration(ed.diff(sd)).as('hours');
        t.load = t.duration * t.weight;

        // Make sure start date is after end.
        if (sd.isSameOrAfter(ed)) {
          this.formTimeValid = false;
        } else {
          this.gorevForm.value.startDate = sd.format();
          this.gorevForm.value.endDate = ed.format();

          this.formTimeValid = true;

          const busyIds = this.findBusies(sd, ed);

          for (const k of this.kadro ) {
            // If kisi id is NOT in busyIds, AND not already assigned to task add to available
            if (busyIds.indexOf(k._id) === -1 && this.choosenPeopleIds.indexOf(k._id) === -1) {
              this.available.push(k);
            }
          }
          // Sort the array for load
          this.available = this._fsort.transform(this.available, 'load');
          console.log(this.available)
        }
      }
    });
  }
}
