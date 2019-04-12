import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import * as moment from 'moment';
import 'moment-recur-ts';
import 'moment-duration-format';
import { extendMoment } from 'moment-range';

// import models
import { Task, TaskDate, TASK_GROUPS} from '../../models/Task';
import { User, Busy, ROLES } from '../../models/User';

// import services
import { TaskService } from '../../services/tasks.service';
import { UserService } from '../../services/user.service';

// import pipes
import { FSortPipe } from '../../pipes/fsort.pipe';

// import directives
import { peopleCountValidator } from '../../directives/peoplecount.directive';
import { validateDateValidator } from '../../directives/validatedate.directive';

@Component({
	selector: 'assignment-add',
	templateUrl: './assignment-add.component.html'
})

export class AssignmentAddComponent implements OnInit {

	title = 'Yeni Görev Oluştur';

	kadro: User[] = [];     // bütün bölüm üyelerini tutar
	busies: Busy[] = [];    // bütün mesgul zamanları tutar
	opentasks: Task[] = []; // bütün acık görevleri tutar

	whenFormGroup: FormGroup;
	whoFormGroup: FormGroup;

	task_groups = TASK_GROUPS;
	taskdescription = '';

	owners: User[] =[];
	mesgulkadro: User[] = [];
	taskdate: TaskDate = {
		startdate : "",
		enddate : "",
		duration : 0
	};

	// create weights and numbers for people / load weight
	numbers: Array<number> = Array(7).fill(0).map((x, i) => i + 1);
	weights: Array<number> = Array(41).fill(0).map((x, i) => i / 4);

	constructor(
		public dialogRef: MatDialogRef<AssignmentAddComponent>,
		private _fsort: FSortPipe,
		private _fb: FormBuilder,
		private _user: UserService,
		private _task: TaskService
	) {}

	ngOnInit() {
		this.whenFormGroup = this._fb.group({
			description: ['', Validators.required],
			taskgroup:   ['', Validators.required],
			peoplecount: [1, Validators.required],
			weight:      [1, Validators.required],
			sday:        ['', Validators.required],
			stime:       [moment('0800', 'hmm').format('HH:mm'), Validators.required],
			etime:       [moment('1000', 'hhmm').format('HH:mm'), Validators.required],
		}, { validators: validateDateValidator });

		this.whoFormGroup = this._fb.group({
			owners:      [[]],
			peoplecount: [], // just a hacky way to get validator work. addtoowners sets this
			sel:         ['1'],
			selectedPerson: [],
		}, { validators: peopleCountValidator(1)});

		// Get currently open tasks for additional busy times
		this._task.getTasks()
		.subscribe((tasks: Task[]) => {
			this.opentasks = tasks;
		});

		// // Get people
		this._user.getUsers()
		.subscribe((kadro: User[]) => {
			console.log('getUsers()', kadro);
			this.kadro = kadro;
			for (const k of this.kadro) {
				k['tempload'] = 0; // temporary load holder
				for (const b of k.busy) {
					this.busies.push(b);
				}
			}

		});

		this.whenFormGroup.statusChanges
		.subscribe( status => {
			if (status === 'VALID') {
				const t = this.whenFormGroup.value;
				const sday = t.sday;
				const stime = t.stime;
				const etime = t.etime;

				// get date as is. if dateOnly() method is used,
				//   timezone is lost
				let sd = moment(sday);
				let ed = moment(sday);

				// combine the date & times
				sd = sd.add(stime.slice(0, 2), 'h');
				sd = sd.add(stime.slice(-2), 'm');
				ed = ed.add(etime.slice(0, 2), 'h');
				ed = ed.add(etime.slice(-2), 'm');

				this.taskdate.duration = Math.trunc(moment.duration(ed.diff(sd)).as('minutes'));
				this.taskdate.startdate = sd.format();
				this.taskdate.enddate = ed.format();

				this.updateAvailablePeople(sd, ed);
			}
		});

	}

	onSubmit() {
		const g = this.whenFormGroup.value;
		const w = this.whoFormGroup.value;
		// calculate load
		const load = this.calculateload(this.taskdate.duration, g.weight);
		//console.log(load);
		const model: Task = {
			description: g.description,
			taskgroup: g.taskgroup,
			peoplecount: g.peoplecount,
			load: load,
			owners: [],
			startdate: this.taskdate.startdate,
			enddate: this.taskdate.enddate,
			duration: this.taskdate.duration,
			recur: 0,
			state: 0
		};

		for (const oid of w.owners){
			model.owners.push({
				id: oid,
				state: 0,
				newload: load
			});
		}

		// Set the task to the db
		this._task.addTask(model)
		.subscribe(res => {
			// // FIXME: Add error handling
			for (let i = 0; i < model.peoplecount; i++) {
				const p = this.kadro.filter(p => p._id === model.owners[i].id)[0];
				// Add task to the each of the assigned people
				// FIXME: remove
				console.log(res);
				this._user.addTaskToUser(p, res)
				.subscribe((kisi: User) => {
					// FIXME: remove
					console.log(kisi);
					// FIXME: Add error handling
				});
			}
			this.dialogRef.close(res);
		});
	}

	addToOwners(x?: User) {
		let p: User;

		// assign p depending on the parameter
		p = x ? x : this.whoFormGroup.get('selectedPerson').value;

		if (this.owners.indexOf(p) === -1) {
			this.owners.push(p);
			this.whoFormGroup.value.owners.push(p._id);
		}

		// tag candidate with selected
		p.isSelected = 1;

		// Disable form if good to go.
		if (this.whenFormGroup.value.peoplecount <= this.owners.length) {
			this.whoFormGroup.controls['selectedPerson'].disable();
		}

		// Reset form
		this.whoFormGroup.controls['selectedPerson'].setValue('');
	}

	removeFromOwners(p) {

		// Remove candidate from available
		const i = this.owners.indexOf(p);
		if (i > -1) {
			this.owners.splice(i, 1);
			this.whoFormGroup.value.owners.splice(i, 1);
		}

		// untag candidate with selected
		p.isSelected = 0;

		// Enable form
		if (this.owners.length < this.whenFormGroup.get('peoplecount').value) {
			this.whoFormGroup.controls['selectedPerson'].enable();
		}

		// Reset form
		this.whoFormGroup.controls['selectedPerson'].setValue('');
	}

	autoAssignPeople(): void {
		const pc = this.whenFormGroup.get('peoplecount').value;
		const sel = this.whoFormGroup.get('sel').value;
		for (let i = this.owners.length; i < pc; i++) {
			if (sel === '1') {
				const p = this.kadro.filter( x =>
					x.position === ROLES[2].position && x.isAvailable === 1 && x.isSelected === 0).sort(compareLoad);
				if (p.length > 0) {
					this.addToOwners(p[0]);
				}
			} else if (sel === '2') {
				const p = this.kadro.filter( x =>
					x.position === ROLES[0].position && x.isAvailable === 1  && x.isSelected === 0).sort(compareLoad);
				if (p.length > 0) {
					this.addToOwners(p[0]);
				}
			} else if (sel === '3') {
				const p = this.kadro.filter( x =>
					x.isSelected === 0).sort(compareLoad);
				if (p.length > 0) {
					this.addToOwners(p[0]);
				}
			}
		}
	}

	updateAvailablePeople(sd, ed) {
		// arrays to hold busy/available id
		let busyIds = [];
		this.mesgulkadro = [];
		let sdate = sd;//moment(sd);
		let edate = ed;//moment(ed);

		const { range } = extendMoment(moment);
		const gorevrange = range(sdate, edate);
		// merge two arrays to have a unified busy object for searching
		let busymaster = [];
		busymaster.push(...this.busies);
		busymaster.push(...this.opentasks);

		console.log('busymaster:',busymaster);
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
							let p = this.kadro.find( x => x._id === b.owner);
							p['excuse'] = b.description;
							this.mesgulkadro.push(p);
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
							let p = this.kadro.find( x => x._id === b.owner);
							p['excuse'] = b.description;
							this.mesgulkadro.push(p);
							busyIds.push(b.owner);
						}
					} else {
						// this is for open tasks
						for (let i = 0; i < +b.peoplecount; i++) {
							if (busyIds.indexOf(b.owners[i]) === -1) {
								let p = this.kadro.find( x => x._id === b.owners[i].id);
								p['excuse'] = b.description;
								this.mesgulkadro.push(p);
								busyIds.push(b.owners[i]);
							}
						}
					}
				}
			}
		}

		for (const k of this.kadro) {
			k.isSelected = 0;
			if (k.vacation === false) {
				if (busyIds.indexOf(k._id) === -1) {
					k.isAvailable = 1;
				} else {
					k.isAvailable = 0;
				}
			}
		}

	}

	// Here is where the load calculation happens
	calculateload(duration: number, weight: number) {
		return Math.round(duration * weight / 6) / 10;
	}

	createdescr(){
		const g = this.whenFormGroup.value;
		this.taskdescription = g.description;
		this.taskdescription += ' konulu görev için ';
		this.taskdescription += moment(g.sday).locale("tr").format('Do MMMM, dddd');
		this.taskdescription += ' günü ';
		this.taskdescription += g.stime;
		this.taskdescription += ' ile ';
		this.taskdescription += g.etime;
		this.taskdescription += ' arasında görevlendirildiniz. ';
	}

	updatepeoplecnt(){
		this.whoFormGroup.controls['peoplecount'].setValue(this.whenFormGroup.get('peoplecount').value);
		// calculate loads based on tasks
		for (const t of this.opentasks) {
			for (const k of t.owners) {
				const p = this.kadro.find( x => x._id === k.id);
				p['tempload'] += k.newload;
			}
		}
	}

}

function compareLoad (a, b) {
	if (a.load + a.tempload < b.load + b.tempload) { return -1; }
	if (a.load + a.tempload > b.load + b.tempload) { return 1; }
	return 0;
}

function compareName (a, b) {
	if (a.fullname < b.fullname) { return -1; }
	if (a.fullname > b.fullname) { return 1; }
	return 0;
}
