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

@Component({
  selector: 'assignment-add',
  templateUrl: './assignment-add.component.html'
})

export class AssignmentAddComponent implements OnInit {

  kadro : Faculty[] = [];
  available : Faculty[] = [];
  notAvailable : Faculty[] = [];
  choosenPeople : Faculty[] = [];

  busytimes : Busy[];
  gorevForm : FormGroup;
  peopleForm : FormGroup;

  gorev : Task;
  gstates = GSTATES;
  types = TYPES;
  numbers : Array<number> = [];
  weights : Array<number> = [];
  gorevInfo : string = '';
  formTimeValid : boolean = false;
  showTimeError : boolean = false;

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
    this.numbers = Array(7).fill(0).map((x,i)=>i+1);
    this.weights = Array(12).fill(0).map((x,i)=>(i+1)/4);

    this.createGorevForm();
    this.createPeopleForm();

    this._busy.getBusyAll()
      .subscribe((res : Busy[]) => {
        this.busytimes = res;
    });

    this._user.getKadro()
      .subscribe((kadro : Faculty[]) => {
        this.kadro = kadro;
    });

    this.validateTimeAndFindAvailable();
  }

  onSubmit() {
    let gorev: Task = this.gorevForm.value;

    this._task.addTask(gorev)
      .subscribe(res => {
        var model : Busy = {
          title : gorev.title,
          startDate : gorev.startDate,
          endDate : gorev.endDate,
          recur : 0,
          task_id : res._id,
          owner_id : ''
        };

      for(let i=0; i < gorev.peopleCount; i++) {
        model.owner_id = gorev.choosenPeople[i];
          this._busy.setBusy(model)
            .subscribe(res => {
        });
      }
      this._router.navigate(['/angarya']);

    });
  }

  // FIXME: Security problem. Susceptible to XSS
  parseForm() {
    moment.locale('tr');
    let g = this.gorevForm.value;
    let x = moment(g.gDate);

    let info = '<b>' + g.title + '</b> icin <i>' + g.type + '</i> kapsaminda '
    info += x.format("LL, dddd") + ' gunu ' + g.startTime + ' ve ' + g.endTime + ' saatleri arasinda,'
    info += ' asagida eklenen ' + g.peopleCount + ' kisi gorevlendirilmistir.'
    info += '<br/><br/>'
    info += '<b>Gorevlendirilen kisiler:</b><br/>'

    for (let i = 0; i<this.choosenPeople.length; i++){
      info += this.choosenPeople[i].position + ' ' + this.choosenPeople[i].fullname + '<br/>'
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

    if(this.choosenPeople.indexOf(p) === -1) {
      this.choosenPeople.push(p);
      this.gorevForm.value.choosenPeople.push(p._id);
    }

    // Remove choosen from available
    let index = this.available.indexOf(p, 0);
    if (index > -1) {
      this.available.splice(index, 1);
    }

    // Disable form if good to go.
    if (this.gorevForm.value.peopleCount == this.choosenPeople.length) {
      this.peopleForm.controls['selectedPerson'].disable();
    }

    // Reset form
    this.peopleForm.controls['selectedPerson'].setValue('');
  }

  removeFromChoosenPeople(p) {
    // Remove choosen from available
    let index = this.choosenPeople.indexOf(p, 0);
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

  autoAssignPeople() : void {
    let g = this.gorevForm.value;

    for (let i = 0; i < g.peopleCount; i++) {
      if (g.selector == 0) {
        this.addToChoosenPeople( this.available.filter(
          people => people.position == 'Araştırma Görevlisi')[0]
        );
      }
      else if (g.selector == 1) {
        this.addToChoosenPeople( this.available.filter(
          people => people.position == 'Dr.')[0]
        );
      }
      else {
        this.addToChoosenPeople( this.available[0] );
      }
    }
  }

  clearAssignedPeople() : void {
    this.choosenPeople = [];
    this.gorevForm.controls['choosenPeople'].setValue([]);
    this.gorevForm.patchValue({peopleCount: ''});
  }

  createGorevForm() : void {
    this.gorevForm = this._fb.group({
      title: ['asdf', Validators.required],
      type: ['Sekreterlik', Validators.required],
      gDate: [ moment().startOf('day').format(), Validators.required],
      startTime: [ moment().startOf('hour').add(1,'hours').format('HH:mm'), Validators.required],
      endTime: [ moment().startOf('hour').add(3,'hours').format('HH:mm'), Validators.required],
      weight: [1, Validators.required],
      peopleCount: [1, [Validators.required, Validators.pattern('[1-7]')]],
      duration: [2, [Validators.required, Validators.pattern('[0-9]{1,2}')]],
      startDate: [],
      selector: [0, Validators.required],
      endDate: [],
      choosenPeople: [[], ],
      status: ['Open'],
    });
  }

  createPeopleForm() : void {
    this.peopleForm = this._fb.group({
      selectedPerson: [{disabled: false}]
    });
  }

  findBusies(gs, ge) : Array<string> {
    const { range } = extendMoment(moment);

    // Not availables
    var NAs = [];
    var gorevrange = range(gs, ge);

    for (let busy of this.busytimes){

      if (busy.recur){
        let interval = moment(busy.startDate).recur().every(busy.recur).days();

        if (interval.matches(gs)){

          // Since this is an interval, we need to create the exact date for checking.
          let bs = moment(gs.format('YYYY-MM-DD') + 'T' + moment(busy.startDate).format('HH:mm'));
          let be = moment(ge.format('YYYY-MM-DD') + 'T' + moment(busy.endDate).format('HH:mm'));
          let busyrange = range(bs, be);

          if (busyrange.overlaps(gorevrange)) {
            if(NAs.indexOf(busy.owner_id) === -1) {
              NAs.push(busy.owner_id);
            }
          }
        }
      }
      else {
        let bs = moment(busy.startDate);
        let be = moment(busy.endDate);
        let busyrange = range(bs, be);

        if (busyrange.overlaps(gorevrange)) {
          if(NAs.indexOf(busy.owner_id) === -1) {
            NAs.push(busy.owner_id);
          }
        }
      }
    }
    return NAs;
  }

  validateTimeAndFindAvailable() : void {
    this.gorevForm.statusChanges.subscribe(status => {
      if (status == 'VALID') {

        this.available = [];
        this.notAvailable = [];
        var t = this.gorevForm.value;

        // Get the dates as is. if .dateOnly() method is used, we lose timezone.
        var sd = moment(t.gDate)
        var ed = moment(t.gDate)

        // Combine the date & times
        sd = sd.add(t.startTime.slice(0,2), 'h');
        sd = sd.add(t.startTime.slice(-2), 'm');
        ed = ed.add(t.endTime.slice(0,2), 'h');
        ed = ed.add(t.endTime.slice(-2), 'm');

        t.duration = moment.duration(ed.diff(sd));

        // Make sure start date is after end.
        if (sd.isSameOrAfter(ed)){
          this.formTimeValid = false;
          this.showTimeError = true;
        }
        else {
          this.gorevForm.value.startDate = sd.format();
          this.gorevForm.value.endDate = ed.format();

          this.formTimeValid = true;
          this.showTimeError = false;

          let NAids = this.findBusies(sd, ed);

          for (let k of this.kadro ){
            if (NAids.indexOf(k._id) === -1){
              this.available.push(k)
            } else {
              this.notAvailable.push(k)
            }
          }
          this.available = this._fsort.transform(this.available, 'load');
          this.notAvailable = this._fsort.transform(this.notAvailable, 'load');
        }
      }
    });
  }

}
