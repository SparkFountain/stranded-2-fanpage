import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StrandedIiComponent } from './stranded-ii.component';
import { StoryComponent } from './story/story.component';
import { SurviveComponent } from './survive/survive.component';
import { AnimalsPlantsComponent } from './animals-plants/animals-plants.component';
import { ConstructionComponent } from './construction/construction.component';
import { CombinationsComponent } from './combinations/combinations.component';
import { WalkthroughComponent } from './walkthrough/walkthrough.component';
import { CompatibilityComponent } from './compatibility/compatibility.component';

const routes: Routes = [
  {
    path: '',
    component: StrandedIiComponent
  },
  {
    path: 'story',
    component: StoryComponent
  },
  {
    path: 'ueberleben',
    component: SurviveComponent
  },
  {
    path: 'tiere-und-pflanzen',
    component: AnimalsPlantsComponent
  },
  {
    path: 'bauen',
    component: ConstructionComponent
  },
  {
    path: 'kombinationen',
    component: CombinationsComponent
  },
  {
    path: 'komplettloesung',
    component: WalkthroughComponent
  },
  {
    path: 'kompatibilitaet',
    component: CompatibilityComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class StrandedIiModule {}
