import GeoJSON from 'ol/format/GeoJSON';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';

export interface GeoJsonGeometry {
  type: string;
  coordinates: number[] | number[][] | number[][][] | number[][][][];
}

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: GeoJsonGeometry;
  properties: Record<string, unknown> | null;
}

const geoJsonFormat = new GeoJSON();

/**
 * OpenLayers Feature를 GeoJSON 객체로 변환
 * EPSG:3857 (Web Mercator) → EPSG:4326 (WGS84) 변환 포함
 */
export function featureToGeoJson(feature: Feature<Geometry>): GeoJsonFeature {
  return geoJsonFormat.writeFeatureObject(feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  }) as GeoJsonFeature;
}

/**
 * OpenLayers Feature의 Geometry만 GeoJSON으로 변환
 */
export function geometryToGeoJson(feature: Feature<Geometry>): GeoJsonGeometry | null {
  const geometry = feature.getGeometry();
  if (!geometry) return null;
  
  return geoJsonFormat.writeGeometryObject(geometry, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  }) as GeoJsonGeometry;
}

/**
 * GeoJSON 문자열로 변환 (백엔드 API 전송용)
 */
export function featureToGeoJsonString(feature: Feature<Geometry>): string {
  return geoJsonFormat.writeFeature(feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });
}

/**
 * GeoJSON 문자열에서 OpenLayers Feature로 변환
 */
export function geoJsonStringToFeature(geoJsonString: string): Feature<Geometry> {
  return geoJsonFormat.readFeature(geoJsonString, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  }) as Feature<Geometry>;
}

/**
 * GeoJSON Feature 배열에서 OpenLayers Feature 배열로 변환
 */
export function geoJsonToFeatures(geoJson: string): Feature<Geometry>[] {
  return geoJsonFormat.readFeatures(geoJson, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  }) as Feature<Geometry>[];
}
