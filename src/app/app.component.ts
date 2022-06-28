import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Feature, Map, View } from 'ol';
import { concatMap, map, scan, shareReplay, startWith, withLatestFrom, } from 'rxjs';
import { LynMetService } from './services/lyn-met.service';
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
import { defaults as defaultInteractions } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { getVectorContext } from 'ol/render';
import { unByKey } from 'ol/Observable';
import {MediaMatcher} from '@angular/cdk/layout';
import { easeOut } from 'ol/easing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
}
