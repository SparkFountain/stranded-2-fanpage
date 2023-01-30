import { Component, Input } from '@angular/core';

@Component({
  selector: 'stranded-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class StrandedSliderComponent {
  @Input('width') width!: number;
  @Input('min') min!: number;
  @Input('max') max!: number;
  @Input('step') step!: number;
  @Input('value') value!: number;

  constructor() {}
}
