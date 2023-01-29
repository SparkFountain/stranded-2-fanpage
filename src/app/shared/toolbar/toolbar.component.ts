import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Menu } from '../../interfaces/menu.interface';

@Component({
  selector: 'stranded-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() menus: Menu[];
  @Input() activeMenuIndex: number;
  @Output() selectMenu: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  handleSelectMenu(menuIndex: number): void {
    this.selectMenu.emit(menuIndex);
  }
}
