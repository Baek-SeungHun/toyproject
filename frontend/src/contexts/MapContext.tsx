import { createContext, useContext, useRef, useMemo, type ReactNode } from 'react';
import VectorSource from 'ol/source/Vector';
import type OlMap from 'ol/Map';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';

interface MapContextValue {
  mapRef: React.RefObject<OlMap | null>;
  vectorSource: VectorSource;
  addFeature: (feature: Feature<Geometry>) => void;
  removeFeature: (feature: Feature<Geometry>) => void;
  clearFeatures: () => void;
}

const MapContext = createContext<MapContextValue | null>(null);

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const mapRef = useRef<OlMap | null>(null);
  const vectorSource = useMemo(() => new VectorSource(), []);

  const value = useMemo<MapContextValue>(() => ({
    mapRef,
    vectorSource,
    addFeature: (feature) => vectorSource.addFeature(feature),
    removeFeature: (feature) => vectorSource.removeFeature(feature),
    clearFeatures: () => vectorSource.clear(),
  }), [vectorSource]);

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}
