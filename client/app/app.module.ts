import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatFormFieldModule, MatProgressSpinnerModule, MatInputModule, MatButtonModule,
  MatChipsModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatSelectModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatTooltipModule, MatDialogModule } from '@angular/material';

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
    KisiAddComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
