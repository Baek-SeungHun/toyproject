import { request } from './client';
import type { GeoJsonGeometry } from '@/utils/geoUtils';

export interface PolygonCreateRequest {
  name: string;
  description: string;
  geoJson: GeoJsonGeometry | null;
}

export interface PolygonResponse {
  id: string;
  name: string;
  description: string;
  geoJson: GeoJsonGeometry;
  createdAt: string;
}

export const polygonsApi = {
  list: () => request<PolygonResponse[]>('/polygons'),
  create: (data: PolygonCreateRequest) =>
    request<PolygonResponse>('/polygons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  get: (id: string) => request<PolygonResponse>(`/polygons/${id}`),
  delete: (id: string) =>
    request<void>(`/polygons/${id}`, { method: 'DELETE' }),
};
