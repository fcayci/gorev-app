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

export class msg {
  'ok': number;
  'n' : number
}

@Component({
  selector: 'assignment-detail',
  templateUrl: './assignment-detail.component.html'
})

export class AssignmentDetailComponent implements OnInit {

  title : string = '';
  kadro : Faculty[] = [];
  available : Faculty[] = [];
  notAvailable : Faculty[] = [];
  busytimes : Busy[] = [];
  gorev : Task;
  gorevForm : FormGroup;
  argor: boolean = true;
  dr : boolean = false;
  duration;
  formTimeValid = false;
  showTimeError = true;

  gstates = GSTATES;
  types = TYPES;
  numbers : Array<number> = [];
  weights : Array<number> = [];

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
      .subscribe((res : Busy[]) => {
        this.busytimes = res;
    });

    this.createForm();
    this.gorevForm.disable();

    this.numbers = Array(7).fill(0).map((x,i)=>i+1);
    this.weights = Array(12).fill(0).map((x,i)=>(i+1)/4);

    var id = this._route.snapshot.paramMap.get('id');
    this._task.getTaskById(id)
      .subscribe((gorev: Task) => {
        if (!gorev) {
          this.title = "Görevlendirme detayları bulunamadı"
          this._router.navigate(['/angarya']);
        }
        else {
          this.gorev = gorev;
          this.title = this.gorev.title;
          this.gorevForm.patchValue(this.gorev);
          this.parseTime(this.gorev)

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
    })


    // this._busy.deleteBusy()
    //   .subscribe(() => {
    //   })

    this._task.delTaskById(this.gorev)
      .subscribe((res: msg) => {
         if (res.ok == 1){
            setTimeout(() => this._router.navigate(['/angarya']), 800);
         }
      });
  }

  createForm() : void {
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

  getPerson(id: string) : string {
    let p = this.kadro.find(x => x._id == id)
    return p.position + ' ' + p.fullname
  }

  parseTime(g) : void {
    var m = {
      gDate : moment(g.startDate).format('YYYY-MM-DD'),
      endDate : moment(g.endDate).format('YYYY.MM.DD'),
      startTime : moment(g.startDate).format('HH:mm'),
      endTime : moment(g.endDate).format('HH:mm')
    }
    this.gorevForm.patchValue(m)
  }

  enableGroup(): void {
    this.gorevForm.enable();
  }

  disableGroup(): void {
    this.gorevForm.disable();
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

        this.duration = moment.duration(ed.diff(sd));

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
            // If kisi id is not in NAids, add to available
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
