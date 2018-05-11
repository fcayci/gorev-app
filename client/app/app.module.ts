import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { AngaryaComponent } from './components/angarya/angarya.component';
import { GorevAddComponent } from './components/gorev-add/gorev-add.component';

import { KadroComponent } from './components/kadro/kadro.component';
import { KisiComponent } from './components/kisi/kisi.component';
import { KisiProfileComponent } from './components/kisi/kisi-profile/kisi-profile.component';
import { KisiTasksComponent } from './components/kisi/kisi-tasks/kisi-tasks.component';
import { KisiAddComponent } from './components/kisi-add/kisi-add.component';

import { MesgulComponent } from './components/kisi/mesgul/mesgul.component';
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
    path: 'angarya',
    component: AngaryaComponent
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
    GorevAddComponent,
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
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
