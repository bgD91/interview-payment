import {NgModule} from '@angular/core';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
  MatNativeDateModule,
  MatDatepickerModule,
} from '@angular/material';
import {CommonModule} from '@angular/common';

@NgModule({
  exports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ]
})
export class AngularMaterialModule {}
