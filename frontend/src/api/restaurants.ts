import { request } from './client';
import type { GeoJsonGeometry } from '@/utils/geoUtils';
import type { Restaurant } from '@/types/restaurant';

export interface RestaurantCreateRequest {
  name: string;
  category: string;
  address: string;
  rating?: number;
  coordinates: [number, number];
}

export const restaurantsApi = {
  search: (geometry: GeoJsonGeometry) =>
    request<Restaurant[]>('/restaurants/search', {
      method: 'POST',
      body: JSON.stringify({ geometry }),
    }),
  create: (data: RestaurantCreateRequest) =>
    request<Restaurant>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: RestaurantCreateRequest) =>
    request<Restaurant>(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/restaurants/${id}`, { method: 'DELETE' }),
};
