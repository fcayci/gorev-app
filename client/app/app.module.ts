import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { PeopleComponent } from './components/people/people.component';
import { AdderComponent } from './components/adder/adder.component';

// define the routes
const ROUTES : Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dummy',
    component: DummyComponent
  },
  {
    path: 'people',
    component: PeopleComponent
  },
  {
    path: 'add',
    component: AdderComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DummyComponent,
    PeopleComponent,
    AdderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
