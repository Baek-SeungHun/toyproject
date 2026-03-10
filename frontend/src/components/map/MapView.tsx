import { useRef } from 'react';
import { useMapInit } from '@/hooks/useMapInit';
import { useDrawing } from '@/hooks/useDrawing';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import type { Coordinates } from '@/types/map';
import 'ol/ol.css';

interface MapViewProps {
  center?: Coordinates;
  zoom?: number;
  onPolygonDrawn?: (feature: Feature<Geometry>) => void;
}

function MapView({ center, zoom, onPolygonDrawn }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useMapInit(containerRef, { center, zoom });
  const { isDrawing, toggleDrawing } = useDrawing({ onDrawEnd: onPolygonDrawn });

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <MapControls isDrawing={isDrawing} onToggleDrawing={toggleDrawing} />
    </div>
  );
}

interface MapControlsProps {
  isDrawing: boolean;
  onToggleDrawing: () => void;
}

function MapControls({ isDrawing, onToggleDrawing }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <button
        onClick={onToggleDrawing}
        className={`px-4 py-2 rounded-lg shadow-lg font-medium transition-colors ${
          isDrawing
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        {isDrawing ? '취소' : '영역 그리기'}
      </button>
    </div>
  );
}

export default MapView;
