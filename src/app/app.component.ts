import { Component, OnInit } from '@angular/core';
import { Feature, Map, View } from 'ol';
import { concatMap, map, scan, shareReplay, startWith, withLatestFrom, } from 'rxjs';
import { LynMetService } from './services/lyn-met.service';
import { OSM, XYZ } from "ol/source";
import Tile from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import Vector from 'ol/source/Vector';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Point } from "ol/geom";
import { LiteralStyle } from 'ol/style/literal';
import TileLayer from 'ol/layer/WebGLTile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  timeNow = new Date().getTime();
  lyn$ = this.lynMet.getServerSentEvent().pipe(shareReplay());
  lynFromLast10Min$ = this.lynMet.getLynHistory(10).pipe(shareReplay());
  accumulatedLynnedslag$ = this.lynFromLast10Min$.pipe(
    concatMap(history => this.lyn$.pipe(map(lyn => {
      return [...history, ...lyn]
    }))),
    scan((acc, curr) => [...acc, ...curr]),
  );
  private olMap!: Map
  private glStyle: LiteralStyle = {
    "symbol": {
      "symbolType": "circle",
      "size": 10,
      "color": [
        "interpolate",
        [
          "linear"
        ],
        [
          "get",
          "time"
        ],
        this.timeNow - 600_000,
        "#ff6a19",
        this.timeNow,
        "#5aca5b"
      ],
      "rotateWithView": true
    }
  };
  private lynLayer = new WebGLPointsLayer({
    source: new Vector<Point>({
      features: []
    }),
    style: this.glStyle,
    disableHitDetection: true,
  });



  constructor(
    private lynMet: LynMetService
  ) {}

  ngOnInit(): void {
    this.olMap = new Map({
      target: 'olMap',
      layers: [
        new Tile({
          source: new OSM()
        }),
        this.lynLayer
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
    });
    this.lyn$.subscribe(lynEvent => {
      this.lynLayer.getSource()?.addFeatures(
        lynEvent.map(lyn => {
          const point = new Point(fromLonLat(lyn.Point))
          return new Feature({
            geometry: point
          });
        })
      )
    });
    this.lynFromLast10Min$.subscribe(lynEvent => {
      this.lynLayer.getSource()?.addFeatures(
        lynEvent.map(lyn => {
          const point = new Point(fromLonLat(lyn.Point))
          const feature =  new Feature({
            geometry: point
          });
          feature.set('time',lyn.Epoch.getTime())
          return feature;
        })
      )
    });

  }
}
