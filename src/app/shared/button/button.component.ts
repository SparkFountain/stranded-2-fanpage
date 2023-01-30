import { Component, Input } from '@angular/core';

@Component({
  selector: 'stranded-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class StrandedButtonComponent {
  @Input('shape') shape!: 'default' | 'raised' | 'stroked' | 'flat';
  @Input('fab') fab!: boolean;

  constructor() {}
}
