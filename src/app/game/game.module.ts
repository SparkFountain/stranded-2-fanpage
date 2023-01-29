import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { GameComponent } from './game.component';
import { RouterModule, Routes } from '@angular/router';
import { OptionsMenuComponent } from './options-menu/options-menu.component';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from './editor/editor.component';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

const routes: Routes = [
  {
    path: '',
    component: GameComponent,
  },
];

@NgModule({
  declarations: [GameComponent, OptionsMenuComponent, EditorComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule,
    TranslocoModule,
  ],
  exports: [GameComponent, OptionsMenuComponent, EditorComponent],
})
export class GameModule {}
