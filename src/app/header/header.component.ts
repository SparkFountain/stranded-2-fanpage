import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() tabs: string[];
  @Input() activeTab: string;
  @Output() selectTab: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  handleSelectTab(tabName: string): void {
    this.selectTab.emit(tabName);
  }
}
