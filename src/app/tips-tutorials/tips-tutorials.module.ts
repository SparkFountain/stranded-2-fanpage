import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TipsTutorialsComponent } from './tips-tutorials.component';
import { EditorComponent } from './editor/editor.component';
import { ScriptingComponent } from './scripting/scripting.component';
import { AdventureComponent } from './adventure/adventure.component';

const routes: Routes = [
  {
    path: '',
    component: TipsTutorialsComponent
  },
  {
    path: 'stranded-ii-editor',
    component: EditorComponent
  },
  {
    path: 'skripting',
    component: ScriptingComponent
  },
  {
    path: 'erstelle-dein-eigenes-adventure',
    component: AdventureComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class TipsTutorialsModule {}
