import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'stranded-ii',
    loadChildren: () => import('./stranded-ii/stranded-ii.module').then(m => m.StrandedIiModule)
  },
  {
    path: 'download-material',
    loadChildren: () => import('./download-content/download-content.module').then(m => m.DownloadContentModule)
  },
  {
    path: 'modifikationen',
    loadChildren: () => import('./modifications/modifications.module').then(m => m.ModificationsModule)
  },
  {
    path: 'tipps-und-tutorials',
    loadChildren: () => import('./tips-tutorials/tips-tutorials.module').then(m => m.TipsTutorialsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
