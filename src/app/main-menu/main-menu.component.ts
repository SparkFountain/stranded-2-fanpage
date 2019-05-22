import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  @Output() action: EventEmitter<string> = new EventEmitter<string>();
  @Output() activeMenu: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
