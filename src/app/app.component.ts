import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public tab: string;
  public tabs: string[];

  constructor(private i18n: TranslateService) {
    this.tab = 'news';
    this.tabs = [
      'news',
      'stranded-ii',
      'download-content',
      'modifications',
      'tips-and-tutorials'
    ];

    this.i18n.addLangs(['en', 'de']);
    this.i18n.setDefaultLang('en');

    const browserLang = this.i18n.getBrowserLang();
    this.i18n.use(browserLang.match(/en|de/) ? browserLang : 'en');
  }
}
