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
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { AssignmentListComponent, FinalizeDialog } from './components/angarya/assignment-list.component';
import { AssignmentAddComponent } from './components/angarya/assignment-add.component';

import { PersonelListesiComponent } from './components/personel-listesi/personel-listesi.component';
import { PersonelEkleComponent } from './components/personel-ekle/personel-ekle.component';
import { PersonelBilgisiComponent } from './components/personel-bilgisi/personel-bilgisi.component';

import { PositionSelectorPipe } from './pipes/position-selector.pipe';
import { FSortPipe } from './pipes/fsort.pipe';
import { peopleCountValidatorDirective } from './directives/peoplecount.directive';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProfileComponent } from './components/personel-bilgisi/profile/profile.component';
import { MesgulListesiComponent } from './components/personel-bilgisi/mesgul-listesi/mesgul-listesi.component';
import { MesgulEkleComponent } from './components/personel-bilgisi/mesgul-ekle/mesgul-ekle.component';
import { GorevlerComponent, LoadChangeDialog } from './components/personel-bilgisi/gorevler/gorevler.component';
import { AuthGuard } from './guards/auth.guard';

registerLocaleData(localeTr);

// define the routes
const ROUTES : Routes = [
{
	path: '',
	component: HomeComponent
},
{
	path: 'kadro',
	component: PersonelListesiComponent,
	canActivate: [AuthGuard]
},
{
	path: 'kisiekle',
	component: PersonelEkleComponent,
	canActivate: [AuthGuard]
},
{
	path: 'mesgulekle',
	component: MesgulEkleComponent,
	canActivate: [AuthGuard]
},
{
	path: 'kadro/:_id',
	component: PersonelBilgisiComponent,
	canActivate: [AuthGuard]
},
{
	path: 'angarya',
	component: AssignmentListComponent,
	canActivate: [AuthGuard]
},
{
	path: 'gorevekle',
	component: AssignmentAddComponent,
	canActivate: [AuthGuard]
},
{
	path: '**',
	redirectTo: ''
}
];


@NgModule({
declarations: [
	AppComponent,
	HomeComponent,
	NavBarComponent,
	AssignmentListComponent,
	AssignmentAddComponent,
	PositionSelectorPipe,
	peopleCountValidatorDirective,
	FSortPipe,
	PersonelListesiComponent,
	PersonelEkleComponent,
	PersonelBilgisiComponent,
	ProfileComponent,
	MesgulListesiComponent,
	MesgulEkleComponent,
	GorevlerComponent,
	LoadChangeDialog,
	FinalizeDialog
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
	{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
	FSortPipe
],
entryComponents: [LoadChangeDialog, FinalizeDialog],
bootstrap: [AppComponent]
})

export class AppModule { }
