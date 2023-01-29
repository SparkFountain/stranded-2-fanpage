import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { NewsComponent } from './news/news.component';
import { StrandedIiComponent } from './stranded-ii/stranded-ii.component';
import { DownloadContentComponent } from './download-content/download-content.component';
import { ModificationsComponent } from './modifications/modifications.component';
import { TipsTutorialsComponent } from './tips-tutorials/tips-tutorials.component';
import { HttpClientModule } from '@angular/common/http';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { PlayOnlineComponent } from './play-online/play-online.component';
import { StoryComponent } from './stranded-ii/story/story.component';
import { SurviveComponent } from './stranded-ii/survive/survive.component';
import { AnimalsPlantsComponent } from './stranded-ii/animals-plants/animals-plants.component';
import { ConstructionComponent } from './stranded-ii/construction/construction.component';
import { CombinationsComponent } from './stranded-ii/combinations/combinations.component';
import { WalkthroughComponent } from './stranded-ii/walkthrough/walkthrough.component';
import { CompatibilityComponent } from './stranded-ii/compatibility/compatibility.component';
import { MapsComponent } from './download-content/maps/maps.component';
import { ScriptsComponent } from './download-content/scripts/scripts.component';
import { CodeOptimizationsComponent } from './download-content/code-optimizations/code-optimizations.component';
import { ConfigToolsComponent } from './download-content/config-tools/config-tools.component';
import { ExtensionModComponent } from './modifications/extension-mod/extension-mod.component';
import { LostInSpaceComponent } from './modifications/lost-in-space/lost-in-space.component';
import { TitaniumComponent } from './modifications/titanium/titanium.component';
import { MultiplayerComponent } from './modifications/multiplayer/multiplayer.component';
import { ScriptingComponent } from './tips-tutorials/scripting/scripting.component';
import { AdventureComponent } from './tips-tutorials/adventure/adventure.component';
import { ImprintComponent } from './imprint/imprint.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { LinksComponent } from './links/links.component';
import { CardComponent } from './card/card.component';

import { TranslocoRootModule } from './transloco-root.module';
import { StrandedButtonModule } from './shared/button/button.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    ButtonsComponent,
    NewsComponent,
    StrandedIiComponent,
    DownloadContentComponent,
    ModificationsComponent,
    TipsTutorialsComponent,
    MainMenuComponent,
    PlayOnlineComponent,
    StoryComponent,
    SurviveComponent,
    AnimalsPlantsComponent,
    ConstructionComponent,
    CombinationsComponent,
    WalkthroughComponent,
    CompatibilityComponent,
    MapsComponent,
    ScriptsComponent,
    CodeOptimizationsComponent,
    ConfigToolsComponent,
    ExtensionModComponent,
    LostInSpaceComponent,
    TitaniumComponent,
    MultiplayerComponent,
    ScriptingComponent,
    AdventureComponent,
    ImprintComponent,
    DisclaimerComponent,
    LinksComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
