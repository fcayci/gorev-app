import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

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

  busytimes: Busy[];
  opentasks: Task[];
  gorevForm: FormGroup;
  peopleForm: FormGroup;

  gorev: Task;
  gstates = GSTATES;
  types = TYPES;
  numbers: Array<number> = [];
  weights: Array<number> = [];
  gorevInfo: string;
  formTimeValid = false;
  showTimeError = false;

  title = 'Yeni Görev Oluştur';

  constructor(
    private _fsort: FSortPipe,
    private _fb: FormBuilder,
    private _router: Router,
    private _user: UserService,
    private _busy: BusyService,
    private _task: TaskService) {
  }

  ngOnInit() {
    // Create arrays for weights and number of choosen people
    this.numbers = Array(7).fill(0).map((x, i) => i + 1);
    this.weights = Array(12).fill(0).map((x, i) => (i + 1) / 4);

    this.createGorevForm();
    this.createPeopleForm();

    // Get the busy times of all the people
    this._busy.getBusyAll()
      .subscribe((res: Busy[]) => {
        this.busytimes = res;
    });

    // Get currently open tasks for additional busy times
    this._task.getOpenTasks()
      .subscribe((res: Task[]) => {
        this.opentasks = res;
    });

    // Get the people
    this._user.getKadro()
      .subscribe((kadro: Faculty[]) => {
        this.kadro = kadro;
    });

    // Find the available people based on the busy times.
    this.validateTimeAndFindAvailable();
  }

  onSubmit() {
    const gorev: Task = this.gorevForm.value;

    // Add the task to the db
    this._task.addTask(gorev)
      .subscribe(res => {
        for (let i = 0; i < gorev.peopleCount; i++) {
          const p = this.kadro.filter(faculty => faculty._id === gorev.choosenPeople[i])[0];

          // Add task to the each of the assigned people
          this._user.addTaskAndIncrementLoadToKisi(p, res)
            .subscribe((kisi: Faculty) => {
              console.log(kisi);
            });
        }

        this._router.navigate(['/angarya']);
    });
  }

  // FIXME: Security problem. Susceptible to XSS
  parseForm() {
    moment.locale('tr');
    const g = this.gorevForm.value;
    const x = moment(g.gDate);

    let info = '<b>' + g.title + '</b> icin <i>' + g.type + '</i> kapsaminda ';
    info += x.format('LL, dddd') + ' gunu ' + g.startTime + ' ve ' + g.endTime + ' saatleri arasinda,';
    info += ' asagida eklenen ' + g.peopleCount + ' kisi gorevlendirilmistir.';
    info += '<br/><br/>';
    info += '<b>Gorevlendirilen kisiler:</b><br/>';

    for (let i = 0; i < this.choosenPeople.length; i++) {
      info += this.choosenPeople[i].position + ' ' + this.choosenPeople[i].fullname + '<br/>';
    }

    this.gorevInfo = info;
  }

  addToChoosenPeople(x?: Faculty) {
    let p: Faculty;

    if (!x) {
      p = this.peopleForm.value.selectedPerson;
    } else {
      p = x;
    }

    if (this.choosenPeople.indexOf(p) === -1) {
      this.choosenPeople.push(p);
      this.gorevForm.value.choosenPeople.push(p._id);
    }

    // Remove choosen from available
    const index = this.available.indexOf(p, 0);
    if (index > -1) {
      this.available.splice(index, 1);
    }

    // Disable form if good to go.
    if (this.gorevForm.value.peopleCount === this.choosenPeople.length) {
      this.peopleForm.controls['selectedPerson'].disable();
    }

    // Reset form
    this.peopleForm.controls['selectedPerson'].setValue('');
  }

  removeFromChoosenPeople(p) {
    // Remove choosen from available
    const index = this.choosenPeople.indexOf(p, 0);
    if (index > -1) {
      this.choosenPeople.splice(index, 1);
      this.gorevForm.value.choosenPeople.splice(index, 1);
    }

    this.available.push(p);
    this.available = this._fsort.transform(this.available, 'load');

    // Enable form
    this.peopleForm.controls['selectedPerson'].enable();

    // Reset form
    this.peopleForm.controls['selectedPerson'].setValue('');
  }

  autoAssignPeople(): void {
    const g = this.gorevForm.value;

    for (let i = 0; i < g.peopleCount; i++) {
      if (g.selector === 0) {
        this.addToChoosenPeople( this.available.filter(
          people => people.position === 'Araştırma Görevlisi')[0]
        );
      } else if (g.selector === 1) {
        this.addToChoosenPeople( this.available.filter(
          people => people.position === 'Dr.')[0]
        );
      } else {
        this.addToChoosenPeople( this.available[0] );
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
      title: ['asdf', Validators.required],
      type: ['Sekreterlik', Validators.required],
      gDate: [ moment().startOf('day').format(), Validators.required],
      startTime: [ moment('0800', 'hmm').format('HH:mm'), Validators.required],
      endTime: [ moment('1000', 'hhmm').format('HH:mm'), Validators.required],
      weight: [1, Validators.required],
      peopleCount: [1, [Validators.required, Validators.pattern('[1-7]')]],
      duration: [2],
      startDate: [],
      selector: [0, Validators.required],
      endDate: [],
      choosenPeople: [[], ],
      status: ['open'],
    });
  }

  createPeopleForm(): void {
    this.peopleForm = this._fb.group({
      selectedPerson: [{disabled: false}]
    });
  }

  findBusies(gs, ge): Array<string> {
    const { range } = extendMoment(moment);

    // Not availables
    const NAs = [];
    const gorevrange = range(gs, ge);

    // Merge two arrays to have a unified busy object for testing.
    const busies = Object.assign(this.busytimes, this.opentasks);

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
            if (NAids.indexOf(k._id) === -1) {
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
