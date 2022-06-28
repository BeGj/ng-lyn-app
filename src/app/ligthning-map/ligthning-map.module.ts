import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LigthningMapRoutingModule } from './ligthning-map-routing.module';
import { LigthningMapComponent } from './ligthning-map.component';


@NgModule({
  declarations: [
    LigthningMapComponent
  ],
  imports: [
    CommonModule,
    LigthningMapRoutingModule
  ]
})
export class LigthningMapModule { }
