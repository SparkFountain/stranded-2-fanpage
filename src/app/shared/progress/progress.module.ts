import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarComponent } from './bar/bar.component';
import { SpinnerComponent } from './spinner/spinner.component';



@NgModule({
  declarations: [
    BarComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProgressModule { }
