import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import { useMapContext } from '@/contexts/MapContext';
import type { Coordinates } from '@/types/map';

const DEFAULT_CENTER: Coordinates = [126.9780, 37.5665];
const DEFAULT_ZOOM = 12;

const polygonStyle = new Style({
  fill: new Fill({ color: 'rgba(59, 130, 246, 0.3)' }),
  stroke: new Stroke({ color: '#3b82f6', width: 2 }),
});

interface UseMapInitOptions {
  center?: Coordinates;
  zoom?: number;
}

export function useMapInit(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseMapInitOptions = {}
) {
  const { center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM } = options;
  const { mapRef, vectorSource } = useMapContext();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: polygonStyle,
    });

    const map = new Map({
      target: containerRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat(center),
        zoom,
      }),
    });

    mapRef.current = map;
    initializedRef.current = true;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
      initializedRef.current = false;
    };
  }, [containerRef, center, zoom, mapRef, vectorSource]);

  return mapRef;
}
