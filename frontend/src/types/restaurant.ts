export interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  rating?: number;
  coordinates: [number, number];
}
