import { useState, useCallback, useEffect } from 'react';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import { useMapContext } from '@/contexts/MapContext';
import { geometryToGeoJson, geoJsonStringToFeature } from '@/utils/geoUtils';
import { polygonsApi } from '@/api/polygons';
import type { PolygonData, PolygonFormData } from '@/types/polygon';

export function usePolygons() {
  const { addFeature, removeFeature, clearFeatures } = useMapContext();
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [currentFeature, setCurrentFeature] = useState<Feature<Geometry> | null>(null);
  const [hiddenPolygonIds, setHiddenPolygonIds] = useState<Set<string>>(new Set());

  const loadPolygons = useCallback(async () => {
    try {
      const serverPolygons = await polygonsApi.list();
      clearFeatures();
      const polygonDataList: PolygonData[] = serverPolygons.map((p) => {
        const feature = geoJsonStringToFeature(JSON.stringify({ type: 'Feature', geometry: p.geoJson, properties: {} }));
        addFeature(feature);
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          feature,
          geoJson: p.geoJson,
        };
      });
      setPolygons(polygonDataList);
    } catch {
      // 백엔드 미연결 시 빈 배열 유지
    }
  }, [addFeature, clearFeatures]);

  useEffect(() => {
    loadPolygons();
  }, [loadPolygons]);

  const addPolygon = useCallback(async (data: PolygonFormData, feature: Feature<Geometry>) => {
    const geoJson = geometryToGeoJson(feature);

    try {
      const response = await polygonsApi.create({
        name: data.name,
        description: data.description,
        geoJson,
      });

      const newPolygon: PolygonData = {
        id: response.id,
        name: response.name,
        description: response.description,
        feature,
        geoJson: response.geoJson,
      };

      setPolygons((prev) => [...prev, newPolygon]);
      setCurrentFeature(null);
      return newPolygon;
    } catch {
      // 백엔드 미연결 시 로컬 UUID 폴백
      const newPolygon: PolygonData = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        feature,
        geoJson: geoJson ?? undefined,
      };

      setPolygons((prev) => [...prev, newPolygon]);
      setCurrentFeature(null);
      return newPolygon;
    }
  }, []);

  const removePolygon = useCallback(async (id: string) => {
    try {
      await polygonsApi.delete(id);
    } catch {
      // 백엔드 미연결 시에도 로컬에서 제거
    }

    const polygon = polygons.find((p) => p.id === id);
    if (polygon) {
      removeFeature(polygon.feature);
    }
    setPolygons((prev) => prev.filter((p) => p.id !== id));
  }, [polygons, removeFeature]);

  const cancelDrawing = useCallback(() => {
    if (currentFeature) {
      removeFeature(currentFeature);
      setCurrentFeature(null);
    }
  }, [currentFeature, removeFeature]);

  const togglePolygonVisibility = useCallback((id: string) => {
    const polygon = polygons.find((p) => p.id === id);
    if (!polygon) return;

    const isCurrentlyHidden = hiddenPolygonIds.has(id);

    if (isCurrentlyHidden) {
      addFeature(polygon.feature);
    } else {
      removeFeature(polygon.feature);
    }

    setHiddenPolygonIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyHidden) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [polygons, hiddenPolygonIds, addFeature, removeFeature]);

  const resetPolygons = useCallback(() => {
    clearFeatures();
    setPolygons([]);
    setCurrentFeature(null);
    setHiddenPolygonIds(new Set());
  }, [clearFeatures]);

  const setDrawnFeature = useCallback((feature: Feature<Geometry> | null) => {
    setCurrentFeature(feature);
  }, []);

  return {
    polygons,
    currentFeature,
    hiddenPolygonIds,
    addPolygon,
    removePolygon,
    togglePolygonVisibility,
    resetPolygons,
    setDrawnFeature,
    cancelDrawing,
  };
}
