import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ModificationsComponent } from './modifications.component';
import { ExtensionModComponent } from './extension-mod/extension-mod.component';
import { LostInSpaceComponent } from './lost-in-space/lost-in-space.component';
import { TitaniumComponent } from './titanium/titanium.component';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';

const routes: Routes = [
  {
    path: '',
    component: ModificationsComponent
  },
  {
    path: 'extension-mod',
    component: ExtensionModComponent
  },
  {
    path: 'lost-in-space',
    component: LostInSpaceComponent
  },
  {
    path: 'titanium',
    component: TitaniumComponent
  },
  {
    path: 'multiplayer',
    component: MultiplayerComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class ModificationsModule {}
