import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import type VectorSource from 'ol/source/Vector';
import type OlMap from 'ol/Map';

export type Coordinates = [number, number];

export interface MapConfig {
  center: Coordinates;
  zoom: number;
}

export interface MapInstance {
  map: OlMap | null;
  vectorSource: VectorSource;
}

export interface DrawingState {
  isDrawing: boolean;
  currentFeature: Feature<Geometry> | null;
}
