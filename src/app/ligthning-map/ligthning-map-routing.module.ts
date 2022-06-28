import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LigthningMapComponent } from './ligthning-map.component';

const routes: Routes = [{ path: '', component: LigthningMapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LigthningMapRoutingModule { }
