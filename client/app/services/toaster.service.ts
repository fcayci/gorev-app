import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
	providedIn: 'root',
})
export class ToasterService {

	constructor(public snackBar: MatSnackBar) {}

	info(message: string) {
		this.snackBar.open(message, null, {
			duration: 2000,
		});
	}
}
