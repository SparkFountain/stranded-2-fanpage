import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/debug',
  },
  {
    path: 'debug',
    loadChildren: () => import('./debug/debug.module').then((m) => m.DebugModule)
  },
  {
    path: 'spielen',
    loadChildren: () => import('./game/game.module').then((m) => m.GameModule)
  },
  {
    path: 'stranded-ii',
    loadChildren: () => import('./stranded-ii/stranded-ii.module').then((m) => m.StrandedIiModule)
  },
  {
    path: 'download-material',
    loadChildren: () => import('./download-content/download-content.module').then((m) => m.DownloadContentModule)
  },
  {
    path: 'modifikationen',
    loadChildren: () => import('./modifications/modifications.module').then((m) => m.ModificationsModule)
  },
  {
    path: 'tipps-und-tutorials',
    loadChildren: () => import('./tips-tutorials/tips-tutorials.module').then((m) => m.TipsTutorialsModule)
  },
  {
    path: 'links',
    loadChildren: () => import('./links/links.module').then((m) => m.LinksModule)
  },
  {
    path: 'haftungsausschluss',
    loadChildren: () => import('./disclaimer/disclaimer.module').then((m) => m.DisclaimerModule)
  },
  {
    path: 'impressum',
    loadChildren: () => import('./imprint/imprint.module').then((m) => m.ImprintModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
