import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/User';

@Injectable({
	providedIn: 'root',
})
export class ActiveService {

	// private kisi = new BehaviorSubject(' ');
	// activeKisi = this.kisi.asObservable();

	constructor() {}

	// setActiveKisi(kisi: Faculty) {
	// 	this.kisi.next(kisi);
	// }
}
