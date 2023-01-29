import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorComponent } from './color/color.component';
import { DateComponent } from './date/date.component';
import { TimeComponent } from './time/time.component';



@NgModule({
  declarations: [
    ColorComponent,
    DateComponent,
    TimeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PickerModule { }
