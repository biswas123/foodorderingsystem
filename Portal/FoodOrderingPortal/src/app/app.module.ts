import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { CategoryComponent } from './components/category/category.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './providers/auth-guard/auth.guard';
import { APIService } from "./services/api/api.service";
import { Interceptor } from "./services/interceptor";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

import { GenericDialogComponent } from './dialogs/generic-dialog/generic-dialog.component';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatDialogRef,
  MAT_DIALOG_DATA,

} from '@angular/material';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { ItemsComponent } from './components/items/items.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { LoadingComponent } from './components/loading/loading.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    DashBoardComponent,
    LoginComponent,
    GenericDialogComponent,
    CategoryDetailComponent,
    ConfirmDialogComponent,
    ItemsComponent,
    ItemDetailComponent,
    LoadingComponent,
    EmployeesComponent,
    EmployeeDetailComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.cubeGrid,
      backdropBackgroundColour: 'rgba(0,0,0,0.2)',
      backdropBorderRadius: '4px',
      primaryColour: '#3f51b5',
      secondaryColour: '#f0f',
      tertiaryColour: '#fff'
    })
  ],
  entryComponents: [GenericDialogComponent, ConfirmDialogComponent],
  providers: [AuthGuard, [APIService, {
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true
  }], { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
