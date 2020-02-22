import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() menus: Menu[];
  @Input() activeMenuIndex: number;
  @Output() selectMenu: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  handleSelectMenu(menuIndex: number): void {
    this.selectMenu.emit(menuIndex);
  }
}
