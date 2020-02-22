import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Button } from '../interfaces/button.interface';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  @Input() buttons: Button[];

  @Output() selectButton: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  handleSelectButton(buttonIndex: number): void {
    this.selectButton.emit(buttonIndex);
  }
}
