import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugRoutingModule } from './debug-routing.module';
import { DebugComponent } from './debug.component';
import { StrandedButtonModule } from '../shared/button/button.module';
import { StrandedSliderModule } from '../shared/slider/slider.module';

@NgModule({
  declarations: [DebugComponent],
  imports: [
    CommonModule,
    DebugRoutingModule,

    // Material Modules
    StrandedButtonModule,
    StrandedSliderModule,
  ],
})
export class DebugModule {}
