import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'route1',
    loadChildren: () =>
      import('./pathA/moduleA.module').then(
        (m) => m.moduleA
      ),
  },
  {
    path: 'route2',

    loadChildren: () =>
      import('./pathB/moduleB.module').then(
        (m) => m.moduleB
      ),
  },
  {
    path: 'route3',
    loadChildren: () =>
      import('./pathC/moduleC.module').then(
        (m) => m.moduleC
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
