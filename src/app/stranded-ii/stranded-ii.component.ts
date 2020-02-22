import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stranded-ii',
  templateUrl: './stranded-ii.component.html',
  styleUrls: ['./stranded-ii.component.scss']
})
export class StrandedIiComponent implements OnInit {
  public subpage: string;

  constructor() {}

  ngOnInit() {
    this.subpage = 'survival';
  }
}
