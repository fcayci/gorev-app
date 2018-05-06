import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { PeopleComponent } from './components/people/people.component';
import { PersonComponent } from './components/person/person.component';

@NgModule({
  declarations: [
    AppComponent,
    DummyComponent,
    PeopleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
