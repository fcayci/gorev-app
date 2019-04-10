import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

	// Is a user logged in?
	authenticated: boolean;

	constructor(private _router: Router) { }

	ngOnInit() {
		this.authenticated = false;
	}

	// this will be moved to auth service
	signIn(): void {
		// Temporary
		this.authenticated = true;
		let user = 'furkan çaycı' + ':' + 'mysecretpass';
		localStorage.setItem('currentUser', JSON.stringify(user));
		this._router.navigate(['/kadro']);
	}

	signOut(): void {
		// Temporary
		this.authenticated = false;
		localStorage.removeItem('currentUser');
		this._router.navigate(['/']);
	}

	gotoProfile(): void {
	}
}
