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
	signIn(): void {
		// Temporary
		this.authenticated = true;
		this._router.navigate(['/kadro']);
	}

	signOut(): void {
		// Temporary
		this.authenticated = false;
		this._router.navigate(['/']);
	}

	gotoProfile(): void {
	}
}
