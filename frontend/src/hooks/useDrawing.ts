import { useState, useCallback } from 'react';
import Draw, { type DrawEvent } from 'ol/interaction/Draw';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import { useMapContext } from '@/contexts/MapContext';

interface UseDrawingOptions {
  onDrawEnd?: (feature: Feature<Geometry>) => void;
}

export function useDrawing({ onDrawEnd }: UseDrawingOptions = {}) {
  const { mapRef, vectorSource } = useMapContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);

  const startDrawing = useCallback(() => {
    const map = mapRef.current;
    if (!map || isDrawing) return;

    const draw = new Draw({
      source: vectorSource,
      type: 'Polygon',
    });

    draw.on('drawend', (event: DrawEvent) => {
      map.removeInteraction(draw);
      setDrawInteraction(null);
      setIsDrawing(false);
      onDrawEnd?.(event.feature as Feature<Geometry>);
    });

    map.addInteraction(draw);
    setDrawInteraction(draw);
    setIsDrawing(true);
  }, [mapRef, vectorSource, isDrawing, onDrawEnd]);

  const stopDrawing = useCallback(() => {
    const map = mapRef.current;
    if (!map || !drawInteraction) return;

    map.removeInteraction(drawInteraction);
    setDrawInteraction(null);
    setIsDrawing(false);
  }, [mapRef, drawInteraction]);

  const toggleDrawing = useCallback(() => {
    if (isDrawing) {
      stopDrawing();
    } else {
      startDrawing();
    }
  }, [isDrawing, startDrawing, stopDrawing]);

  return {
    isDrawing,
    startDrawing,
    stopDrawing,
    toggleDrawing,
  };
}
