import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

// import models
import { Task, TASK_GROUPS} from '../../models/TaskModel';
import { Faculty, ROLES } from '../../models/FacultyModel';
import { Busy, TaskDate } from '../../models/BusyModel';

// import services
import { TaskService } from '../../services/tasks.service';
import { UserService } from '../../services/facultys.service';
import { BusyService } from '../../services/busys.service';
import { ValidationService } from '../../services/validation.service';

// import pipes
import { FSortPipe } from '../../pipes/fsort.pipe';

// import directives
import { peopleCountValidator } from '../../directives/peoplecount.directive';

@Component({
	selector: 'assignment-add',
	templateUrl: './assignment-add.component.html'
})

export class AssignmentAddComponent implements OnInit {

	title = 'Yeni Görev Oluştur';

	kadro: Faculty[] = []; // holder for the whole kadro
	busies: Busy[] = []; // all busy times
	tasks: Task[] = []; // all tasks that are open

	gorevForm: FormGroup;

	taskdate: TaskDate; // holder for task dates
	task_groups = TASK_GROUPS;

	owners: Faculty[] =[];

	// create weights and numbers for people / load weight
	numbers: Array<number> = Array(7).fill(0).map((x, i) => i + 1);
	weights: Array<number> = Array(41).fill(0).map((x, i) => i / 4);

	constructor(
		public dialogRef: MatDialogRef<AssignmentAddComponent>,
		private _fsort: FSortPipe,
		private _fb: FormBuilder,
		private _user: UserService,
		private _busy: BusyService,
		private _task: TaskService,
		private _valiDate: ValidationService
	) {}

	ngOnInit() {
		// FIXME: remove default values
		this.gorevForm = this._fb.group({
			name: ['User Test',
				Validators.required],
			group: ['Sekreterlik', Validators.required],
			when: this._fb.group({
				sday: [, Validators.required],
				stime: [moment('0800', 'hmm').format('HH:mm'), Validators.required],
				etime: [moment('1000', 'hhmm').format('HH:mm'), Validators.required],
			}, {validators: this.validateDate.bind(this, this.taskdate)}),
			weight: [1, Validators.required],
			peoplecount: [1, Validators.required],
			owners: [[], ],
			state: [0],
			// these are temporary holders
			sel: [, Validators.required],
			selectedPerson: [],
		}, {validators: peopleCountValidator});


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

		this.gorevForm.get('when').statusChanges
		.subscribe( status => {
			if (status === 'VALID') {
				const t = this.gorevForm.get('when').value;
				this.taskdate = this._valiDate.validateDate(t.sday, t.sday, t.stime, t.etime);
				console.log('taskdate', this.taskdate);
				if (this.taskdate.valid) {
					this.updateAvailablePeople(this.taskdate.startdate, this.taskdate.enddate);
				}
			}
		});

		// reset selected person when selector changes
		this.gorevForm.get('sel').valueChanges
		.subscribe( _ => {
			// Reset form
			this.gorevForm.controls['selectedPerson'].setValue('');
		});

	}

	onSubmit() {
		const g = this.gorevForm.value;
		// calculate load
		const load = this.calculateload(this.taskdate.duration, g.weight);
		const model: Task = {
			name: g.name,
			group: g.group,
			peoplecount: g.peoplecount,
			weight: g.weight,
			load: load,
			owners: g.owners,
			startdate: this.taskdate.startdate,
			enddate: this.taskdate.enddate,
			duration: this.taskdate.duration,
			recur: 0,
			// FIXME: Think about state
			state: 0
		};

		// Set the task to the db
		this._task.setTask(model)
		.subscribe(res => {
			// // FIXME: Add error handling
			for (let i = 0; i < model.peoplecount; i++) {
				const p = this.kadro.filter(faculty => faculty._id === model.owners[i])[0];
				// Add task to the each of the assigned people
				// FIXME: remove
				console.log(res);
				this._user.addTaskToKisi(p, res)
				.subscribe((kisi: Faculty) => {
					// FIXME: remove
					console.log(kisi);
					// FIXME: Add error handling
				});
			}
			this.dialogRef.close(res);
		});
	}

	addToOwners(x?: Faculty) {
		let p: Faculty;

		// assign p depending on the parameter
		p = x ? x : this.gorevForm.get('selectedPerson').value;

		if (this.owners.indexOf(p) === -1) {
			this.owners.push(p);
			this.gorevForm.value.owners.push(p._id);
		}

		// Remove candidate from availablePeople
		p.isAvailable = 0;

		// Disable form if good to go.
		if (this.gorevForm.value.peoplecount <= this.owners.length) {
			this.gorevForm.controls['selectedPerson'].disable();
		}

		// Reset form
		this.gorevForm.controls['selectedPerson'].setValue('');
	}

	removeFromOwners(p) {

		// Remove candidate from available
		const i = this.owners.indexOf(p);
		if (i > -1) {
			this.owners.splice(i, 1);
			this.gorevForm.value.owners.splice(i, 1);
		}

		// add to available
		p.isAvailable = 1;

		// Enable form
		if (this.owners.length < this.gorevForm.get('peoplecount').value) {
			this.gorevForm.controls['selectedPerson'].enable();
		}

		// Reset form
		this.gorevForm.controls['selectedPerson'].setValue('');
	}

	autoAssignPeople(): void {
		const g = this.gorevForm.value;
		this.kadro = this._fsort.transform(this.kadro, 'load');

		for (let i = this.owners.length; i < g.peoplecount; i++) {
			if (g.sel === '1') {
				const p = this.kadro.filter( people =>
					people.position === ROLES[2].position)
				if (p.length > 0) {
					this.addToOwners(p[0]);
				}
			} else if (g.sel === '2') {
				const p = this.kadro.filter( people =>
					people.position === ROLES[0].position)
				if (p.length > 0) {
					this.addToOwners(p[0]);
				}
			} else {
				const p = this.kadro;
				if (p.length > 0) {
					this.addToOwners(p[0]);
				}
			}
		}
	}


	updateAvailablePeople(sd: string, ed: string) {
		// arrays to hold busy/available id
		let busyIds = [];
		let sdate = moment(sd);
		let edate = moment(ed);

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

		// FIXME: integrate vacation in other places
		for (const k of this.kadro) {
			if (k.vacation === false) {
				if (busyIds.indexOf(k._id) === -1) {
					k.isAvailable = 1;
					//this.availablePeople.push(k);
				} else {
					k.isAvailable = 0;
					//this.busyPeople.push(k);
				}
			}
		}

		// Reset form
		this.gorevForm.controls['selectedPerson'].setValue('');
	}

	// Here is where the load calculation happens
	calculateload(duration: number, weight: number) {
		return Math.trunc(duration * weight / 60);
	}

	// for when validation in the form
	validateDate(c: FormControl, t: TaskDate) {
		return t.valid ? null :  { timenotvalid : true };
	}

}
