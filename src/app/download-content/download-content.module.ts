import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DownloadContentComponent } from './download-content.component';
import { MapsComponent } from './maps/maps.component';
import { ScriptsComponent } from './scripts/scripts.component';
import { CodeOptimizationsComponent } from './code-optimizations/code-optimizations.component';
import { ConfigToolsComponent } from './config-tools/config-tools.component';

const routes: Routes = [
  {
    path: '',
    component: DownloadContentComponent
  },
  {
    path: 'maps',
    component: MapsComponent
  },
  {
    path: 'skripte',
    component: ScriptsComponent
  },
  {
    path: 'code-optimierungen',
    component: CodeOptimizationsComponent
  },
  {
    path: 'konfigurations-tools',
    component: ConfigToolsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class DownloadContentModule {}
