import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import type { GeoJsonGeometry } from '@/utils/geoUtils';

export interface PolygonData {
  id: string;
  name: string;
  description: string;
  feature: Feature<Geometry>;
  geoJson?: GeoJsonGeometry;
}

export interface PolygonFormData {
  name: string;
  description: string;
}

export interface PolygonState {
  polygons: PolygonData[];
  currentDrawnFeature: Feature<Geometry> | null;
}

export interface PolygonActions {
  addPolygon: (data: PolygonFormData, feature: Feature<Geometry>) => PolygonData;
  removePolygon: (id: string) => void;
  setCurrentFeature: (feature: Feature<Geometry> | null) => void;
  clearCurrentFeature: () => void;
}
