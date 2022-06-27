import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { scan, } from 'rxjs';
import { LynMetService } from './services/lyn-met.service';
import { OSM, XYZ } from "ol/source";
import Tile from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  lyn$ = this.lynMet.getServerSentEvent().pipe(
    scan((acc, curr) => [...acc, ...curr]),
  );
  private olMap!: Map

  constructor(
    private lynMet: LynMetService
  ) {}

  ngOnInit(): void {
    this.olMap = new Map({
      target: 'olMap',
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([20.5651,68.7628]),
        zoom: 4
      })
    });

    navigator.geolocation.getCurrentPosition(position => {
      this.olMap.getView().animate({
        center: fromLonLat([position.coords.longitude, position.coords.latitude]),
        zoom: 10
      });
    })

  }
}
