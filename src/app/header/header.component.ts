import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() tabs: string[];
  @Output() tab: EventEmitter<string> = new EventEmitter();

  public activeTab: string;

  constructor() { }

  ngOnInit() {
    this.activeTab = 'nav-news';
  }

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
    this.tab.emit(tabName);
  }
}
