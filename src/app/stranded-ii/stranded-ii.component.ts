import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-stranded-ii',
  templateUrl: './stranded-ii.component.html',
  styleUrls: ['./stranded-ii.component.scss']
})
export class StrandedIiComponent implements OnInit {
  public subpage: string;

  constructor(public translateService: TranslateService) { }

  ngOnInit() {
    this.subpage = 'survival';
  }

}
