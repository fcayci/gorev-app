import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

import { Faculty } from '../../faculty';
import { Busy } from '../../busy';

import { Task, TYPES, GSTATES } from '../../task';
import { BusyService } from '../../services/busy.service';
import { UserService } from '../../services/user.service';
//import { TaskService } from '../../services/task.service';

@Component({
  selector: 'assignment-add',
  templateUrl: './assignment-add.component.html'
})

export class AssignmentAddComponent implements OnInit {

  kadro : Faculty[];
  available : Faculty[];
  notAvailable : Faculty[];
  choosenPeople : Faculty[];
  filteredAvailable : Observable<Faculty[]>;

  busytimes : Busy[];
  gorevForm : FormGroup;
  peopleForm : FormGroup;

  duration : any = 2;
  gorev : Task;
  gstates = GSTATES;
  types = TYPES;
  assigned = false;
  numbers;
  weights;
  gorevInfo : string = '';
  formTimeValid = false;
  showTimeError = false;

  title = 'Yeni Görev Oluştur';

  constructor(
    private _fb: FormBuilder,
    private _user: UserService,
    private _busy: BusyService) {
  }

  ngOnInit() {
    this.numbers = Array(7).fill(0).map((x,i)=>i+1);
    this.weights = Array(12).fill(0).map((x,i)=>(i+1)/4);
    this.choosenPeople = [];
    this.available = [];
    this.notAvailable = [];

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

    // this.filteredAvailable = this.peopleForm.get('selectedPerson').valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(val => this.filter(val))
    // );
  }

  // filter(val: string): Faculty[] {
  //   return this.available.filter(kisi =>
  //     kisi.fullname.toLowerCase().includes(val));
  // }

  // displayFn(kisi?: Faculty): string | undefined {
  //   return kisi ? kisi.fullname : undefined;
  // }

  // Security problem. Susceptible to XSS
  parseForm() {
    moment.locale('tr');
    let g = this.gorevForm.value;
    let x = moment(g.time.gDate);

    let info = 'Bilginize,<br/><br/>'
    info += '<b>' + g.title + '</b> icin <i>' + g.type + '</i> kapsaminda '
    info += x.format("LL, dddd") + ' gunu ' + g.time.startTime + ' ve ' + g.time.endTime + ' saatleri arasinda,'
    info += ' asagida eklenen ' + g.peopleCount + ' kisi gorevlendirilmistir.'
    info += '<br/><br/>'
    info += '<b>Gorevlendirilen kisiler:</b><br/>'
    for (let i = 0; i<this.choosenPeople.length; i++){
      info += this.choosenPeople[i].position + ' ' + this.choosenPeople[i].fullname + '<br/>'
    }

    this.gorevInfo = info;
  }

  addToChoosenPeople(x?: Faculty) {
    if (!x) {
      let p = this.peopleForm.value.selectedPerson;
      console.log(p)
    } else {
      let p = x;
    }

    if(this.choosenPeople.indexOf(p) === -1) {
      console.log('hede')
      this.choosenPeople.push(p);
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
    this.peopleForm.value.selectedPerson = '';
  }

  removeFromChoosenPeople(p) {
    // Remove choosen from available
    let index = this.choosenPeople.indexOf(p, 0);
    if (index > -1) {
      this.choosenPeople.splice(index, 1);
    }

    this.available.push(p);
    this.available.sort(this.compare);

    // Enable form
    this.peopleForm.controls['selectedPerson'].enable();

    // Reset form
    this.peopleForm.value.selectedPerson = '';
  }


  autoAssignPeople() {
    // Since available is sorted, just push the top x people
    for (let i = 0; i < this.gorevForm.value.peopleCount; i++){
      this.addToChoosenPeople(this.available[0])
    }
  }

  clearAssignedPeople() {
    this.choosenPeople = [];
    this.gorevForm.patchValue({peopleCount: ''});
  }

  // onSubmit() {
  //   var model = this.gorevForm.value;
  //   for ( let i = model.choosenPeople.length; i < model.peopleCount; i++){
  //     let pick : Faculty = this.pickKisi()
  //     console.log(i, 'picked', pick.fullname)
  //     model.choosenPeople.push(pick._id)
  //     this.available.splice(0, 1)
  //     this.notAvailable.push(pick)
  //   }
  //   console.log(' not picked', model.choosenPeople.length, model.peopleCount)

  //   // var gorev = this.createTask()
  //   // addTaskToDB(gorev);
  //   // addBusyToOE();
  //   // returnBackToInfinity();
  // }

  createGorevForm() {
    this.gorevForm = this._fb.group({
      title: ['asdf', Validators.required],
      type: ['asdf', Validators.required],
      time: this._fb.group({
        gDate: [ moment().startOf('day').format(), Validators.required],
        startTime: [ moment().startOf('hour').add(1,'hours').format('HH:mm'), Validators.required],
        endTime: [ moment().startOf('hour').add(3,'hours').format('HH:mm'), Validators.required]
      }),
      weight: [1, Validators.required],
      peopleCount: [1, [Validators.required, Validators.pattern('[1-7]')]],
      duration: [2, [Validators.required, Validators.pattern('[0-9]{1,2}')]]
    });
  }

  createPeopleForm() {
    this.peopleForm = this._fb.group({
      selectedPerson: [{disabled: false}]
      //choosenPeople: [Array, Validators.required, Array.length == this.gorevForm.value.peopleCount]
    });
  }

  findBusies(gs, ge) {
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

  validateTimeAndFindAvailable() {
    this.gorevForm.statusChanges.subscribe(status => {
      if (status == 'VALID') {

        this.available = [];
        this.notAvailable = [];
        var t = this.gorevForm.value.time;

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

          this.available.sort(this.compare);
          this.notAvailable.sort(this.compare);

        }
      }
    });
  }

  compare(a,b) {
    if (a.load > b.load)
      return -1;
    if (a.load < b.load)
      return 1;
    return 0;
  }


}
