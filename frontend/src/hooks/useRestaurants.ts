import { useState, useCallback } from 'react';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import { geometryToGeoJson } from '@/utils/geoUtils';
import { restaurantsApi } from '@/api/restaurants';
import type { Restaurant } from '@/types/restaurant';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRestaurantsInPolygon = useCallback(async (feature: Feature<Geometry>) => {
    setIsLoading(true);
    try {
      const geometry = geometryToGeoJson(feature);
      if (!geometry) return;
      const results = await restaurantsApi.search(geometry);
      setRestaurants(results);
    } catch {
      // 백엔드 미연결 시 빈 배열
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRestaurants = useCallback(() => {
    setRestaurants([]);
  }, []);

  return {
    restaurants,
    isLoading,
    fetchRestaurantsInPolygon,
    clearRestaurants,
  };
}
