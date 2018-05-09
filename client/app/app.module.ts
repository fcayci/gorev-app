import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { KadroComponent } from './components/kadro/kadro.component';
import { KisiComponent } from './components/kisi/kisi.component';
import { KisiProfileComponent } from './components/kisi/kisi-profile/kisi-profile.component';
import { BusyListComponent } from './components/kisi/busy-list/busy-list.component';
import { KisiAddComponent } from './components/kisi-add/kisi-add.component';
import { BusyAddComponent } from './components/kisi/busy-add/busy-add.component';

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
  }
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KadroComponent,
    KisiComponent,
    KisiProfileComponent,
    BusyListComponent,
    KisiAddComponent,
    BusyAddComponent
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
