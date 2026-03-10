import { useState, useCallback } from 'react';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import { useMapContext } from '@/contexts/MapContext';
import { geometryToGeoJson } from '@/utils/geoUtils';
import type { PolygonData, PolygonFormData } from '@/types/polygon';

export function usePolygons() {
  const { removeFeature } = useMapContext();
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [currentFeature, setCurrentFeature] = useState<Feature<Geometry> | null>(null);

  const addPolygon = useCallback((data: PolygonFormData, feature: Feature<Geometry>): PolygonData => {
    const geoJson = geometryToGeoJson(feature);
    
    const newPolygon: PolygonData = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      feature,
      geoJson: geoJson ?? undefined,
    };

    setPolygons((prev) => [...prev, newPolygon]);
    setCurrentFeature(null);

    console.log('=== PostGIS 저장용 GeoJSON ===');
    console.log('백엔드 전송 데이터:', {
      name: data.name,
      description: data.description,
      geometry: geoJson,
    });

    return newPolygon;
  }, []);

  const removePolygon = useCallback((id: string) => {
    setPolygons((prev) => {
      const polygon = prev.find((p) => p.id === id);
      if (polygon) {
        removeFeature(polygon.feature);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, [removeFeature]);

  const cancelDrawing = useCallback(() => {
    if (currentFeature) {
      removeFeature(currentFeature);
      setCurrentFeature(null);
    }
  }, [currentFeature, removeFeature]);

  const setDrawnFeature = useCallback((feature: Feature<Geometry> | null) => {
    setCurrentFeature(feature);
  }, []);

  return {
    polygons,
    currentFeature,
    addPolygon,
    removePolygon,
    setDrawnFeature,
    cancelDrawing,
  };
}
