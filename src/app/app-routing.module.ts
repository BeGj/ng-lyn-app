import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'lightning', loadChildren: () => import('./ligthning-map/ligthning-map.module').then(m => m.LigthningMapModule)},
  { path: '', pathMatch: 'full', redirectTo: 'lightning' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
