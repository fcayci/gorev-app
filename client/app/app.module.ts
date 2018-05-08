import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { KadroComponent } from './components/kadro/kadro.component';
import { KisiDetailComponent } from './components/kisi-detail/kisi-detail.component';
import { KisiAddComponent } from './components/kisi-add/kisi-add.component';

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
    path: 'kadro/:id',
    component: KisiDetailComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KadroComponent,
    KisiDetailComponent,
    KisiAddComponent
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
