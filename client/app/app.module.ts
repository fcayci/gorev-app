import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { KadroComponent } from './components/kadro/kadro.component';
import { KisiComponent } from './components/kisi/kisi.component';
import { KisiProfileComponent } from './components/kisi/kisi-profile/kisi-profile.component';
import { KisiTasksComponent } from './components/kisi/kisi-tasks/kisi-tasks.component';
import { MesgulComponent } from './components/kisi/mesgul/mesgul.component';
import { KisiAddComponent } from './components/kisi-add/kisi-add.component';
import { MesgulFindComponent } from './components/kisi/mesgul/mesgul-find/mesgul-find.component';

// define the routes
const ROUTES : Routes = [
  {
    path: '',
    component: HomeComponent
  },
    {
    path: 'kisiekle',
    component: KisiAddComponent
  },
  {
    path: 'kadro',
    component: KadroComponent
  },
  {
    path: 'kadro/:username',
    component: KisiComponent
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TasksComponent,
    KadroComponent,
    KisiComponent,
    KisiProfileComponent,
    MesgulComponent,
    MesgulFindComponent,
    KisiAddComponent,
    KisiTasksComponent
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
