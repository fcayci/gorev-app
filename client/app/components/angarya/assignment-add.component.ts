import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';

import { Observable } from 'rxjs';
// import {map, startWith} from 'rxjs/operators';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

import { FSortPipe } from '../../pipes/fsort.pipe';
import { Faculty } from '../../faculty';
import { Busy } from '../../busy';
import { Task, TYPES, GSTATES } from '../../task';
import { BusyService } from '../../services/busy.service';
import { UserService } from '../../services/user.service';
import { TaskService } from '../../services/task.service';

export class Msg {
  'ok': number;
  'n': number;
}

@Component({
  selector: 'assignment-add',
  templateUrl: './assignment-add.component.html'
})

export class AssignmentAddComponent implements OnInit {

  kadro: Faculty[] = [];
  available: Faculty[] = [];
  notAvailable: Faculty[] = [];
  choosenPeople: Faculty[] = [];
  filteredPeople: Observable<Faculty[]>;

  busytimes: Busy[];
  opentasks: Task[];
  gorevForm: FormGroup;

  gorev: Task;
  gstates = GSTATES;
  types = TYPES;
  numbers: Array<number> = Array(7).fill(0).map((x, i) => i + 1);
  weights: Array<number> = Array(41).fill(0).map((x, i) => i / 4);

  gorevInfo: string;
  formTimeValid = false;
  showTimeError = false;

  title = 'Yeni Görev Oluştur';

  constructor(
    public dialogRef: MatDialogRef<AssignmentAddComponent>,
    private _fsort: FSortPipe,
    private _fb: FormBuilder,
    private _router: Router,
    private _user: UserService,
    private _busy: BusyService,
    private _task: TaskService) {
  }

  ngOnInit() {

    this.createGorevForm();

    // Get busy times of all the people
    this._busy.getBusyAll()
      .subscribe((res: Busy[]) => {
        this.busytimes = res;
    });

    // Get currently open tasks for additional busy times
    this._task.getOpenTasks()
      .subscribe((res: Task[]) => {
        this.opentasks = res;
    });

    // Get people
    this._user.getKadro()
      .subscribe((kadro: Faculty[]) => {
        this.kadro = kadro;
    });

    // Find the available people based on the busy times.
    this.validateTimeAndFindAvailable();

    // this.filteredPeople = this.gorevForm.get('selectedPerson').valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );
  }

  // private _filter(value: String): Faculty[] {
  //   const filterValue = value.toLowerCase();
  //   return this.available.filter(option => option.fullname.toLowerCase().indexOf(filterValue) === 0);
  // }

  onSubmit() {
    const gorev: Task = this.gorevForm.value;
    // Add the task to the db
    this._task.addTask(gorev)
      .subscribe(res => {
        // FIXME: Add error handling
        for (let i = 0; i < gorev.peopleCount; i++) {
          const p = this.kadro.filter(faculty => faculty._id === gorev.choosenPeople[i])[0];

          // Add task to the each of the assigned people
          this._user.addTaskAndIncrementLoadToKisi(p, res)
            .subscribe((kisi: Faculty) => {
              // FIXME: Add error handling
            });
        }

        this.dialogRef.close(res);
    });
  }

  addToChoosenPeople(x?: Faculty) {
    let p: Faculty;

    if (!x) {
      p = this.gorevForm.get('selectedPerson').value;
    } else {
      p = x;
    }

    if (this.choosenPeople.indexOf(p) === -1) {
      this.choosenPeople.push(p);
      this.gorevForm.value.choosenPeople.push(p._id);
    }

    // Remove choosen from available
    const index = this.available.indexOf(p);
    if (index > -1) {
      this.available.splice(index, 1);
    }

    // Disable form if good to go.
    if (this.gorevForm.value.peopleCount <= this.choosenPeople.length) {
      this.gorevForm.controls['selectedPerson'].disable();
    }

    // Reset form
    this.gorevForm.controls['selectedPerson'].setValue('');
  }

  removeFromChoosenPeople(p) {
    // Remove choosen from available
    const index = this.choosenPeople.indexOf(p);
    if (index > -1) {
      this.choosenPeople.splice(index, 1);
      this.gorevForm.value.choosenPeople.splice(index, 1);
    }

    this.available.push(p);
    this.available = this._fsort.transform(this.available, 'load');

    // Enable form
    if (this.choosenPeople.length < this.gorevForm.get('peopleCount').value) {
      this.gorevForm.controls['selectedPerson'].enable();
    }

    // Reset form
    this.gorevForm.controls['selectedPerson'].setValue('');
  }

  autoAssignPeople(): void {
    const g = this.gorevForm.value;

    for (let i = this.choosenPeople.length; i < g.peopleCount; i++) {
      if (g.selector === '0') {
        const p = this.available.filter(
          people => people.position === 'Araştırma Görevlisi')
        if (p.length > 0) {
          this.addToChoosenPeople(p[0]);
        }
      } else if (g.selector === '1') {
        const p = this.available.filter(
          people => people.position === 'Dr.');
        if (p.length > 0) {
          this.addToChoosenPeople(p[0]);
        }
      } else {
        const p = this.available;
        if (p.length > 0) {
          this.addToChoosenPeople(p[0]);
        }
      }
    }
  }

  clearAssignedPeople(): void {
    this.choosenPeople = [];
    this.gorevForm.controls['choosenPeople'].setValue([]);
    this.gorevForm.patchValue({peopleCount: ''});
  }

  createGorevForm(): void {
    this.gorevForm = this._fb.group({
      title: [, Validators.required],
      type: [, Validators.required],
      when: this._fb.group({
        gDate: [, Validators.required],
        startTime: [moment('0800', 'hmm').format('HH:mm'), Validators.required],
        endTime: [moment('1000', 'hhmm').format('HH:mm'), Validators.required],
        startDate: [],
        endDate: [],
        duration: [2]
      }),
      weight: [1, Validators.required],
      peopleCount: [1, [Validators.required, Validators.pattern('[1-7]')]],
      choosenPeople: [[], ],
      selector: ['0', Validators.required],
      status: [0],
      load: [2],
      selectedPerson: [],
    });
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
    this.gorevForm.get('weight').valueChanges.subscribe(value => {
      if ( this.gorevForm.value.when ) {
        this.gorevForm.controls['load'].setValue(this.gorevForm.value.when.duration * value);
      }
    });
    this.gorevForm.get('when').statusChanges.subscribe(status => {
      if (status === 'VALID') {
        const t = this.gorevForm.get('when').value;
        const g = this.gorevForm.value;
        this.available = [];

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
        this.gorevForm.controls['load'].setValue(t.duration * g.weight);

        // Make sure start date is after end.
        if (sd.isSameOrAfter(ed)) {
          this.formTimeValid = false;
        } else {
          t.startDate = sd.format();
          t.endDate = ed.format();

          this.formTimeValid = true;

          const busyIds = this.findBusies(sd, ed);

          for (const k of this.kadro ) {
            if (k.vacation === false) {
              if (busyIds.indexOf(k._id) === -1) {
                this.available.push(k);
              }
            }
          }
          this.available = this._fsort.transform(this.available, 'load');
          // Just a hack to activate observable.
          // this.gorevForm.controls['selectedPerson'].setValue('');
        }
      }
    });
  }
}
