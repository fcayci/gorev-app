import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatFormFieldModule, MatProgressSpinnerModule,
  MatInputModule, MatButtonModule, MatChipsModule, MatSidenavModule,
  MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule,
  MatSelectModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatTooltipModule, MatDialogModule, MatSlideToggleModule, MatDatepickerModule,
  MatCheckboxModule, MatSnackBarModule, MatStepperModule, MatBadgeModule,
  MatButtonToggleModule, MatRadioModule, MatAutocompleteModule } from '@angular/material';

import {MatExpansionModule} from '@angular/material/expansion';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { AssignmentListComponent } from './components/angarya/assignment-list.component';
import { AssignmentAddComponent } from './components/angarya/assignment-add.component';

import { FacultyListComponent } from './components/kadro/faculty-list.component';
import { FacultyWrapperComponent } from './components/kadro/faculty-wrapper.component';
import { FacultyProfileComponent } from './components/kadro/faculty-profile.component';
import { FacultyTasksComponent } from './components/kadro/faculty-tasks.component';
import { FacultyBusyComponent } from './components/kadro/faculty-busy.component';
import { FacultyAddComponent } from './components/kadro/faculty-add.component';
import { FacultyBusyAddComponent } from './components/kadro/faculty-busy-add.component';
import { PositionSelectorPipe } from './pipes/position-selector.pipe';
import { FSortPipe } from './pipes/fsort.pipe';
import { peopleCountValidatorDirective } from './directives/peoplecount.directive';

registerLocaleData(localeTr);

// define the routes
const ROUTES : Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'kadro',
    component: FacultyListComponent
  },
  {
    path: 'kisiekle',
    component: FacultyAddComponent
  },
  {
    path: 'mesgulekle',
    component: FacultyBusyAddComponent
  },
  {
    path: 'kadro/:_id',
    component: FacultyWrapperComponent
  },
  {
    path: 'angarya',
    component: AssignmentListComponent
  },
  {
    path: 'gorevekle',
    component: AssignmentAddComponent
  },
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AssignmentListComponent,
    AssignmentAddComponent,
    FacultyListComponent,
    FacultyWrapperComponent,
    FacultyProfileComponent,
    FacultyBusyComponent,
    FacultyTasksComponent,
    FacultyAddComponent,
    FacultyBusyAddComponent,
    PositionSelectorPipe,
    peopleCountValidatorDirective,
    FSortPipe
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
    MatSnackBarModule,
    MatIconModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatMomentDateModule,
    HttpClientModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'tr-TR'},
    FSortPipe
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
