import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrandedSliderComponent } from './slider.component';
import { StrandedPipesModule } from '../pipes/stranded-pipes.module';

@NgModule({
  declarations: [StrandedSliderComponent],
  imports: [
    CommonModule,

    // Pipes
    StrandedPipesModule,
  ],
  exports: [StrandedSliderComponent],
})
export class StrandedSliderModule {}
