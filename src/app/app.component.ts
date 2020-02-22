import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from './interfaces/menu.interface';
import { Button } from './interfaces/button.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public menus: Menu[];
  public activeMenuIndex: number;

  public buttons: Array<Button[]>;
  public activeButtonIndex: number;

  constructor(private router: Router) {
    this.menus = [
      { name: 'Neuigkeiten', route: '' },
      { name: 'Stranded II', route: 'stranded-ii' },
      { name: 'Download-Material', route: 'download-material' },
      { name: 'Modifikationen', route: 'modifikationen' },
      { name: 'Tipps und Tutorials', route: 'tipps-und-tutorials' }
    ];
    this.activeMenuIndex = 0;

    this.buttons = [
      [],
      [
        { name: 'Story', route: 'story' },
        { name: 'Überleben', route: 'ueberleben' },
        { name: 'Tiere und Pflanzen', route: 'tiere-und-pflanzen' },
        { name: 'Bauen', route: 'bauen' },
        { name: 'Kombinationen', route: 'kombinationen' },
        { name: 'Komplettlösung', route: 'komplettloesung' },
        { name: 'Kompatibilität', route: 'kompatibilitaet' }
      ],
      [
        { name: 'Maps', route: 'maps' },
        { name: 'Skripte', route: 'skripte' },
        { name: 'Code-Optimierungen', route: 'code-optimierungen' },
        { name: 'Konfigurations-Tools', route: 'konfigurations-tools' }
      ],
      [
        { name: 'Extension Mod', route: 'extension-mod' },
        { name: 'Lost in Space', route: 'lost-in-space' },
        { name: 'Titanium', route: 'titanium' },
        { name: 'Multiplayer', route: 'multiplayer' }
      ],
      [
        { name: 'Stranded II Editor', route: 'stranded-ii-editor' },
        { name: 'Skripting', route: 'skripting' },
        { name: 'Erstelle dein eigenes Adventure', route: 'erstelle-dein-eigenes-adventure' }
      ]
    ];
    this.activeButtonIndex = 0;
  }

  selectMenu(menuIndex: number) {
    this.activeMenuIndex = menuIndex;
    this.router.navigateByUrl(this.menus[menuIndex].route);
  }

  selectButton(buttonIndex: number) {
    this.activeButtonIndex = buttonIndex;
    this.router.navigateByUrl(
      `${this.menus[this.activeMenuIndex].route}/${this.buttons[this.activeMenuIndex][this.activeButtonIndex].route}`
    );
  }
}
