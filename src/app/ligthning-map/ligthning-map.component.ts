import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Feature, Map, View } from 'ol';
import { concatMap, map, scan, shareReplay, startWith, withLatestFrom, } from 'rxjs';
import { OSM, XYZ } from "ol/source";
import Tile from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import Vector from 'ol/source/Vector';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Geometry, Point } from "ol/geom";
import { LiteralStyle } from 'ol/style/literal';
import TileLayer from 'ol/layer/WebGLTile';
import { containsExtent } from 'ol/extent';
import { defaults as defaultControls, FullScreen, Attribution } from 'ol/control'
import Geolocation from 'ol/Geolocation'
import { defaults as defaultInteractions, PinchZoom } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { getVectorContext } from 'ol/render';
import { unByKey } from 'ol/Observable';
import {MediaMatcher} from '@angular/cdk/layout';
import { easeOut } from 'ol/easing';
import { LynMetService } from '../services/lyn-met.service';
@Component({
  selector: 'app-ligthning-map',
  templateUrl: './ligthning-map.component.html',
  styleUrls: ['./ligthning-map.component.scss']
})
export class LigthningMapComponent implements OnInit, AfterViewInit {
  timeNowInS = new Date().getTime() / 1000;

  lyn$ = this.lynMet.getServerSentEvent().pipe(shareReplay());
  lynFromLast10Min$ = this.lynMet.getLynHistory(10).pipe(shareReplay());
  accumulatedLynnedslag$ = this.lynFromLast10Min$.pipe(
    concatMap(history => this.lyn$.pipe(map(lyn => {
      return [...history, ...lyn]
    }))),
    scan((acc, curr) => [...acc, ...curr]),
  );


  private glStyle: LiteralStyle = {
    variables: {
      "10mAgo": this.timeNowInS - 600,
      "now": this.timeNowInS
    },
    /* filter: [
      '>',
      ['+', ['var', 'minTime'], ['*', ['time'], 1000]],
      ['*', ['time'], 1000],
    ], */
    symbol: {
      symbolType: "circle",
      size: 10,
      color: [
        "interpolate",
        [
          "linear"
        ],
        [
          "get",
          "time"
        ],
        ['+', ['var', '10mAgo'], ['time']], // 10 min ago
        "#ffffff", // white
        ['+', ['-', ['var', 'now'], 60 * 1.4], ['time']], // 3min ago
        "#009dff", // blue
        ['+', ['-', ['var', 'now'], 20], ['time']], // now
        "#ff0000" // red
      ],
      rotateWithView: true
    }
  };

  private lynLayer = new WebGLPointsLayer({
    source: new Vector<Point>({
      features: [],
      attributions: '</br>Lyndata fra <a href="https://lyn.met.no">lyn.met.no</a>/'
    }),
    style: this.glStyle,
    disableHitDetection: true,
  });

  private osmLayer = new Tile({
    source: new OSM()
  })
  private olMap = new Map({
    layers: [
      this.osmLayer,
      this.lynLayer
    ],
    interactions: defaultInteractions({
      altShiftDragRotate: false,
      pinchRotate: false,
      shiftDragZoom: false,
    }).extend([
      new PinchZoom()
    ]),
    view: new View({
      center: fromLonLat([20.5651, 68.7628]),
      zoom: 4
    }),
    controls: defaultControls().extend([
      new FullScreen(),
    ])
  });

  fxRainBg = new Audio('/assets/sounds/rain_bg.mp3');


  constructor(
    private lynMet: LynMetService
  ) { }
  ngAfterViewInit(): void {
    this.olMap.setTarget('olMap');
  }

  ngOnInit(): void {


    this.getUserLocationAndFlyToIt();

    this.lynLayer.getSource()!.on('addfeature', (e) => {
      const feature = e.feature!;
      if (feature.get('isLive') === true) {
        this.flash(feature);
      }
    })
    this.subscribeToRealtimeLyn();

    this.subscribeToLynHistory();

    // animate the map
    const animate = () => {
      this.olMap.render();
      window.requestAnimationFrame(animate);
    }
    animate();

    new Promise(resolve => setTimeout(resolve, 5000)).then(() => {
      this.playBgRainSounds();
    })
  }

  private playBgRainSounds() {
    this.fxRainBg.loop = true;
    this.fxRainBg.volume = 0.5;
    this.fxRainBg.play();
  }

  private subscribeToLynHistory() {
    this.lynFromLast10Min$.subscribe(lynEvent => {
      this.lynLayer.getSource()?.addFeatures(
        lynEvent.map(lyn => {
          const point = new Point(fromLonLat(lyn.point));
          const feature = new Feature({
            geometry: point
          });
          feature.set('time', lyn.datetime.getTime() / 1000);
          feature.set('addedAt', new Date().getTime() / 1000);
          feature.set('isLive', false);
          return feature;
        })
      );
    });
  }

  private subscribeToRealtimeLyn() {
    this.lyn$.subscribe(lynEvent => {
      this.lynLayer.getSource()?.addFeatures(
        lynEvent.map(lyn => {
          const point = new Point(fromLonLat(lyn.point));
          const feature = new Feature({
            geometry: point
          });
          this.playSoundIfWithinMapViewport(feature)
          feature.set('time', lyn.datetime.getTime() / 1000);
          feature.set('addedAt', lyn.datetime.getTime() / 1000);
          feature.set('isLive', true);
          return feature;
        })
      );
    });
  }

  private playSoundIfWithinMapViewport(feature: Feature<Point>) {
    var extentFeature = feature.getGeometry()?.getExtent();

    if (extentFeature && containsExtent(this.olMap.getView().calculateExtent(), extentFeature)) {

      let fx: HTMLAudioElement;
      const random = Math.floor(Math.random() * 3);
      switch (random) {
        case 0:
          fx = new Audio('./assets/sounds/lyn_long.mp3');
          break;
        case 1:
          fx = new Audio('./assets/sounds/lyn_blast.mp3');
          break;
        default:
          fx = new Audio('./assets/sounds/lyn.mp3');
          break;
      }
      fx.loop = false;
      fx.play();
    }
  }
  private flash(feature: Feature<Geometry>) {
    const duration = 3000;
    const start = Date.now();
    const flashGeom = feature.getGeometry()!.clone();
    const listenerKey = this.osmLayer.on('postrender', (event) => animate(event));

    const animate = (event: any) => {
      const frameState = event.frameState;
      const elapsed = frameState.time - start;
      if (elapsed >= duration) {
        unByKey(listenerKey);
        return;
      }
      const vectorContext = getVectorContext(event);
      const elapsedRatio = elapsed / duration;
      // radius will be 5 at start and 30 at end.
      const radius = easeOut(elapsedRatio) * 25 + 5;
      const opacity = easeOut(1 - elapsedRatio);

      const style = new Style({
        image: new CircleStyle({
          radius: radius,
          stroke: new Stroke({
            color: 'rgba(255, 0, 0, ' + opacity + ')',
            width: 0.25 + opacity,
          }),
        }),
      });

      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);
      // tell OpenLayers to continue postrender animation
      this.olMap.render();
    }
  }


  private getUserLocationAndFlyToIt() {
    navigator.geolocation.getCurrentPosition(position => {
      this.olMap.getView().animate({
        center: fromLonLat([position.coords.longitude, position.coords.latitude]),
        zoom: 10
      });
    });
  }

}
