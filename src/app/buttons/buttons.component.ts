import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  @Input() tab?: string;

  sections: string[];  // TODO remove later again

  constructor() { }

  ngOnInit() {
    this.sections = [
      'Story',
      'Überleben',
      'Tiere und Pflanzen',
      'Bauen',
      'Kombinationen',
      'Komplettlösung',
      'Kompatibilität'
    ];
  }

}
