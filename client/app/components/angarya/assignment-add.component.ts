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

// import models
import { Task, TASK_GROUPS, TASK_STATES} from '../../models/TaskModel';
import { Faculty } from '../../models/FacultyModel';
import { Busy, Time } from '../../models/BusyModel';

// import services
import { TaskService } from '../../services/tasks.service';
import { UserService } from '../../services/facultys.service';
import { BusyService } from '../../services/busys.service';
import { ToasterService } from '../../services/toaster.service';

// import pipes
import { FSortPipe } from '../../pipes/fsort.pipe';

@Component({
	selector: 'assignment-add',
	templateUrl: './assignment-add.component.html'
})

export class AssignmentAddComponent implements OnInit {

	title = 'Yeni Görev Oluştur';

	// holder for the whole kadro
	kadro: Faculty[] = [];
	// all busy times
	busies: Busy[] = [];
	// all tasks that are open
	tasks: Task[] = [];

	// holder for task date
	startdate = moment();
	enddate = moment();

	availablePeople: Faculty[] = [];
	busyPeople: Faculty[] = [];

	// chosen from assignment before finalization
	chosens: Faculty[] = [];
	// hmmm.. FIXME
	filteredPeople: Observable<Faculty[]>;

	gorevForm: FormGroup;

	gorev: Task;
	gorev_state = TASK_STATES;
	groups = TASK_GROUPS;
	// create weights and numbers for people / load weight
	numbers: Array<number> = Array(7).fill(0).map((x, i) => i + 1);
	weights: Array<number> = Array(41).fill(0).map((x, i) => i / 4);

	//gorevInfo: string;
	// for dialog popup errors
	formTimeValid = false;
	showTimeError = false;

	constructor(
		public dialogRef: MatDialogRef<AssignmentAddComponent>,
		private _fsort: FSortPipe,
		private _fb: FormBuilder,
		private _router: Router,
		private _user: UserService,
		private _busy: BusyService,
		private _task: TaskService
	) {}

	ngOnInit() {
		this.createGorevForm();

		// Get busy times of all the people
		this._busy.getBusyAll()
		.subscribe((res: Busy[]) => {
			// FIXME: remove
			console.log(res);
			this.busies = res;
		});

		// Get currently open tasks for additional busy times
		this._task.getTasks()
		.subscribe((res: Task[]) => {
			// FIXME: remove
			console.log(res);
			this.tasks = res;
		});
		
		// Get people
		this._user.getKadro()
		.subscribe((res: Faculty[]) => {
			// FIXME: remove
			console.log(res);
			this.kadro = res;
		});

		this.validateInputDate();


		// Find the available people based on the busy times.
		//this.validateTimeAndFindAvailable();

    // this.filteredPeople = this.gorevForm.get('selectedPerson').valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );
  }

	validateInputDate(): void {
		// subscribe and check the time validity
		this.gorevForm.get('when').statusChanges
		.subscribe(status => {
			if (status === 'VALID') {
				// FIXME: remove
				console.log('checking time...');
				const t = this.gorevForm.get('when').value;

				// get date as is. if dateOnly() method is used,
				//   timezone is lost
				let sd = moment(t.sd);
				let ed = moment(t.sd);
				// combine the date & times
				sd = sd.add(t.stime.slice(0, 2), 'h');
				sd = sd.add(t.stime.slice(-2), 'm');
				ed = ed.add(t.etime.slice(0, 2), 'h');
				ed = ed.add(t.etime.slice(-2), 'm');

				// check if the time is correct
				if (sd.isSameOrAfter(ed)) {
					this.formTimeValid = false;
					t.duration = 0; 
				} else {
					this.formTimeValid = true;
					t.duration = Math.trunc(moment.duration(ed.diff(sd)).as('minutes'));
				}

				// write the start / end date to local cache
				this.startdate = sd;
				this.enddate = ed;

				// update tables
				this.updateAvailablePeople(sd, ed);

				// TODO: 
				// update taskdate once task is assigned
				// this.taskdate.startdate = sd.format();
				// this.taskdate.enddate = ed.format();
				// this.taskdate.recur = 0;
			}
		});
	}

  // private _filter(value: String): Faculty[] {
  //   const filterValue = value.toLowerCase();
  //   return this.available.filter(option => option.fullname.toLowerCase().indexOf(filterValue) === 0);
  // }
  //
  // onSubmit() {
  //   const gorev: Task = this.gorevForm.value;
  //   // Add the task to the db
  //   this._task.addTask(gorev)
  //     .subscribe(res => {
  //       // FIXME: Add error handling
  //       for (let i = 0; i < gorev.peoplecount; i++) {
  //         const p = this.kadro.filter(faculty => faculty._id === gorev.choosenPeople[i])[0];
  //
  //         // Add task to the each of the assigned people
  //         this._user.addTaskAndIncrementLoadToKisi(p, res)
  //           .subscribe((kisi: Faculty) => {
  //             // FIXME: Add error handling
  //           });
  //       }
  //
  //       this.dialogRef.close(res);
  //   });
  // }
  //
  // addToChoosenPeople(x?: Faculty) {
  //   let p: Faculty;
  //
  //   if (!x) {
  //     p = this.gorevForm.get('selectedPerson').value;
  //   } else {
  //     p = x;
  //   }
  //
  //   if (this.choosenPeople.indexOf(p) === -1) {
  //     this.choosenPeople.push(p);
  //     this.gorevForm.value.choosenPeople.push(p._id);
  //   }
  //
  //   // Remove choosen from available
  //   const index = this.available.indexOf(p);
  //   if (index > -1) {
  //     this.available.splice(index, 1);
  //   }
  //
  //   // Disable form if good to go.
  //   if (this.gorevForm.value.peoplecount <= this.choosenPeople.length) {
  //     this.gorevForm.controls['selectedPerson'].disable();
  //   }
  //
  //   // Reset form
  //   this.gorevForm.controls['selectedPerson'].setValue('');
  // }
  //
  // removeFromChoosenPeople(p) {
  //   // Remove choosen from available
  //   const index = this.choosenPeople.indexOf(p);
  //   if (index > -1) {
  //     this.choosenPeople.splice(index, 1);
  //     this.gorevForm.value.choosenPeople.splice(index, 1);
  //   }
  //
  //   this.available.push(p);
  //   this.available = this._fsort.transform(this.available, 'load');
  //
  //   // Enable form
  //   if (this.choosenPeople.length < this.gorevForm.get('peoplecount').value) {
  //     this.gorevForm.controls['selectedPerson'].enable();
  //   }
  //
  //   // Reset form
  //   this.gorevForm.controls['selectedPerson'].setValue('');
  // }
  //
  // autoAssignPeople(): void {
  //   const g = this.gorevForm.value;
  //
  //   for (let i = this.choosenPeople.length; i < g.peoplecount; i++) {
  //     if (g.selector === '0') {
  //       const p = this.available.filter(
  //         people => people.position === 'Araştırma Görevlisi')
  //       if (p.length > 0) {
  //         this.addToChoosenPeople(p[0]);
  //       }
  //     } else if (g.selector === '1') {
  //       const p = this.available.filter(
  //         people => people.position === 'Dr.');
  //       if (p.length > 0) {
  //         this.addToChoosenPeople(p[0]);
  //       }
  //     } else {
  //       const p = this.available;
  //       if (p.length > 0) {
  //         this.addToChoosenPeople(p[0]);
  //       }
  //     }
  //   }
  // }
  //
  // clearAssignedPeople(): void {
  //   this.choosenPeople = [];
  //   this.gorevForm.controls['choosenPeople'].setValue([]);
  //   this.gorevForm.patchValue({peoplecount: ''});
  // }
  //
  
	createGorevForm(): void {
		this.gorevForm = this._fb.group({
			name: [, Validators.required],
			group: [, Validators.required],
			when: this._fb.group({
				sday: [, Validators.required],
				//eday: [, Validators.required],
				stime: [moment('0800', 'hmm').format('HH:mm'), Validators.required],
				etime: [moment('1000', 'hhmm').format('HH:mm'), Validators.required],
				duration: [2],
				//recur: [0]
			}),
			weight: [1, Validators.required],
			peoplecount: [1, [Validators.required, Validators.pattern('[1-7]')]],
			owners: [[], ],
			state: [0],
			//load: [2],
			// these are temporary holders
			sel: ['0', Validators.required],
			showallpeople: [false, Validators.required],
			selectedPerson: [],
		});
	}

	updateAvailablePeople(sdate, edate) {
		// arrays to hold busy/available id
		let busyIds = [];
		let availablePeople = [];

		const { range } = extendMoment(moment);
		const gorevrange = range(sdate, edate);
		// merge two arrays to have a unified busy object for searching
		const busymaster = Object.assign(this.busies, this.tasks);

		for (const b of busymaster) {
			// if recur is set, evaluate differently
			if (b.recur) {
				// create an interval from startdate to enddate
				//const interval = moment(b.startdate).recur().every(b.recur).days();
				//const interval = moment(b.startdate).recur(b.enddate).every(b.recur).days();
				const interval = moment().recur(b.startdate, b.enddate).every(b.recur).days();
				// sdate and edate should be the same for this case
				//   so if interval dates match sdate, check the time
				if (interval.matches(sdate)) {
					const bs = moment(sdate.format('YYYY-MM-DD') + 'T' + moment(b.startdate).format('HH:mm'));
					const be = moment(sdate.format('YYYY-MM-DD') + 'T' + moment(b.enddate).format('HH:mm'));
					const busyrange = range(bs, be);

					if (busyrange.overlaps(gorevrange)) {
						// this person is busy, add it to the array if 
						//  she is not already included
						if (busyIds.indexOf(b.owner) === -1) {
							busyIds.push(b.owner);
						}
					}
				}

			} else {
				// if recur is not set
				const bs = moment(b.startdate);
				const be = moment(b.enddate);
				const busyrange = range(bs, be);

				// This can be both busytimes and tasks
				if (busyrange.overlaps(gorevrange)) {
					// owner only exists in busytimes
					if (b.owner) {
						if (busyIds.indexOf(b.owner) === -1) {
							busyIds.push(b.owner);
						}
					} else {
						// this is for open tasks
						for (let i = 0; i < +b.peoplecount; i++) {
							if (busyIds.indexOf(b.owners[i]) === -1) {
								busyIds.push(b.owners[i]);
							}
						}
					}
				}
			}
		}

		// zero out lists before the storm
		this.availablePeople = [];
		this.busyPeople = [];
		// FIXME: integrate vacation in other places
		for (const k of this.kadro) {
			if (k.vacation === false) {
				if (busyIds.indexOf(k._id) === -1) {
					this.availablePeople.push(k);
				} else {
					this.busyPeople.push(k);
				}
			}
		}
		console.log('available', this.availablePeople);
		console.log('busies', this.busyPeople);

		this.availablePeople = this._fsort.transform(this.availablePeople, 'load');
		// Just a hack to activate observable.
		//this.gorevForm.controls['selectedPerson'].setValue('');
	}

  // validateTimeAndFindAvailable(): void {
  //   this.gorevForm.get('weight').valueChanges.subscribe(value => {
  //     if ( this.gorevForm.value.when ) {
  //       this.gorevForm.controls['load'].setValue(this.gorevForm.value.when.duration * value);
  //     }
  //   });
  //   this.gorevForm.get('when').statusChanges.subscribe(status => {
  //     if (status === 'VALID') {
  //       const t = this.gorevForm.get('when').value;
  //       const g = this.gorevForm.value;
  //       this.available = [];
  //
  //       // Get the dates as is. if .dateOnly() method is used, we lose timezone.
  //       let sd = moment(t.gDate);
  //       let ed = moment(t.gDate);
  //
  //       // Combine the date & times
  //       sd = sd.add(t.startTime.slice(0, 2), 'h');
  //       sd = sd.add(t.startTime.slice(-2), 'm');
  //       ed = ed.add(t.endTime.slice(0, 2), 'h');
  //       ed = ed.add(t.endTime.slice(-2), 'm');
  //
  //       // Calculate load based on duration and weight
  //       t.duration = moment.duration(ed.diff(sd)).as('hours');
  //       this.gorevForm.controls['load'].setValue(t.duration * g.weight);
  //
  //       // Make sure start date is after end.
  //       if (sd.isSameOrAfter(ed)) {
  //         this.formTimeValid = false;
  //       } else {
  //         t.startDate = sd.format();
  //         t.endDate = ed.format();
  //
  //         this.formTimeValid = true;
  //
  //         const busyIds = this.findBusies(sd, ed);
  //
  //         for (const k of this.kadro ) {
  //           if (k.vacation === false) {
  //             if (busyIds.indexOf(k._id) === -1) {
  //               this.available.push(k);
  //             }
  //           }
  //         }
  //         this.available = this._fsort.transform(this.available, 'load');
  //         // Just a hack to activate observable.
  //         // this.gorevForm.controls['selectedPerson'].setValue('');
  //       }
  //     }
  //   });
  // }
}
