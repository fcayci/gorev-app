import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

	// Is a user logged in?
	authenticated: boolean;

	constructor() { }

	ngOnInit() {
		this.authenticated = false;
	}
	signIn(): void {
		// Temporary
		this.authenticated = true;
	}

	signOut(): void {
		// Temporary
		this.authenticated = false;
	}
}
