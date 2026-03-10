import { useState, useCallback } from 'react';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import type { Restaurant } from '@/types/restaurant';

// TODO: 백엔드 API 연동 시 제거
const MOCK_RESTAURANTS: Restaurant[] = [
  { id: '1', name: '맛있는 김치찌개', category: '한식', address: '서울시 강남구 역삼동 123-45', rating: 4.5, coordinates: [126.978, 37.566] },
  { id: '2', name: '스시 오마카세', category: '일식', address: '서울시 강남구 삼성동 456-78', rating: 4.8, coordinates: [126.979, 37.567] },
  { id: '3', name: '짜장면 천국', category: '중식', address: '서울시 강남구 대치동 789-12', rating: 4.2, coordinates: [126.977, 37.565] },
];

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRestaurantsInPolygon = useCallback(async (_feature: Feature<Geometry>) => {
    setIsLoading(true);
    
    // TODO: 백엔드 API 연동
    // const geoJson = geometryToGeoJson(feature);
    // const response = await api.getRestaurantsInPolygon(geoJson);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRestaurants(MOCK_RESTAURANTS);
    setIsLoading(false);
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
