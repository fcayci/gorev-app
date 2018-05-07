import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { PeopleComponent } from './components/people/people.component';
import { PersonDetailComponent } from './components/person-detail/person-detail.component';

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
    path: 'people/:id',
    component: PersonDetailComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DummyComponent,
    PeopleComponent,
    PersonDetailComponent
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
