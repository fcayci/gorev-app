import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { AngaryaComponent } from './components/angarya/angarya.component';
import { GorevComponent } from './components/gorev/gorev.component';
import { GorevAddComponent } from './components/gorev-add/gorev-add.component';

import { KadroComponent } from './components/kadro/kadro.component';
import { KisiWrapperComponent } from './components/kisi/kisi-wrapper.component';
import { ProfileComponent } from './components/kisi/profile.component';
import { TasksComponent } from './components/kisi/tasks.component';
import { MesgulComponent } from './components/kisi/mesgul.component';

import { KisiAddComponent } from './components/kisi-add/kisi-add.component';
import { MesgulFindComponent } from './components/kisi/mesgul-find/mesgul-find.component';

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
    component: KisiWrapperComponent
  },
  {
    path: 'angarya',
    component: AngaryaComponent
  },
  {
    path: 'angarya/:id',
    component: GorevComponent
  },
  {
    path: 'gorevekle',
    component: GorevAddComponent
  },
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AngaryaComponent,
    GorevComponent,
    GorevAddComponent,
    KadroComponent,
    KisiWrapperComponent,
    ProfileComponent,
    TasksComponent,
    MesgulComponent,
    MesgulFindComponent,
    KisiAddComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
