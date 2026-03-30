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
        className="px-5 py-2.5 font-semibold text-sm text-white transition-all"
        style={{
          borderRadius: 'var(--radius-pill)',
          boxShadow: 'var(--shadow-md)',
          backgroundColor: isDrawing ? 'var(--color-error)' : 'var(--color-primary)',
        }}
        onMouseEnter={(e) => {
          if (!isDrawing) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDrawing
            ? 'var(--color-error)'
            : 'var(--color-primary)';
        }}
      >
        {isDrawing ? '취소' : '영역 그리기'}
      </button>
    </div>
  );
}

export default MapView;
