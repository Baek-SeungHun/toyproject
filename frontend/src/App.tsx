import { useCallback } from 'react';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import { MapProvider } from './contexts/MapContext';
import { usePolygons } from './hooks/usePolygons';
import { useRestaurants } from './hooks/useRestaurants';
import MapView from './components/map/MapView';
import Sidebar from './components/layout/Sidebar';
import PolygonForm from './components/polygon/PolygonForm';
import PolygonList from './components/polygon/PolygonList';
import RestaurantList from './components/restaurant/RestaurantList';

function AppContent() {
  const {
    polygons,
    currentFeature,
    addPolygon,
    removePolygon,
    setDrawnFeature,
    cancelDrawing,
  } = usePolygons();

  const {
    restaurants,
    isLoading: isLoadingRestaurants,
    fetchRestaurantsInPolygon,
    clearRestaurants,
  } = useRestaurants();

  const handlePolygonDrawn = useCallback((feature: Feature<Geometry>) => {
    setDrawnFeature(feature);
    fetchRestaurantsInPolygon(feature);
  }, [setDrawnFeature, fetchRestaurantsInPolygon]);

  const handleSave = useCallback((data: { name: string; description: string }) => {
    if (!currentFeature) return;
    addPolygon(data, currentFeature);
    clearRestaurants();
  }, [currentFeature, addPolygon, clearRestaurants]);

  const handleCancel = useCallback(() => {
    cancelDrawing();
    clearRestaurants();
  }, [cancelDrawing, clearRestaurants]);

  const handleSelectPolygon = useCallback((polygon: { id: string }) => {
    console.log('선택된 폴리곤:', polygon.id);
    // TODO: 지도에서 해당 폴리곤으로 이동/포커스
  }, []);

  const handleSelectRestaurant = useCallback((restaurant: { id: string }) => {
    console.log('선택된 음식점:', restaurant.id);
    // TODO: 지도에서 해당 음식점으로 이동/마커 표시
  }, []);

  return (
    <div className="w-screen h-screen flex">
      <Sidebar>
        <div className="flex flex-col h-full">
          {currentFeature ? (
            <>
              <PolygonForm onSave={handleSave} onCancel={handleCancel} />
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  영역 내 음식점 ({restaurants.length})
                </h2>
                <RestaurantList
                  restaurants={restaurants}
                  isLoading={isLoadingRestaurants}
                  onSelect={handleSelectRestaurant}
                />
              </div>
            </>
          ) : (
            <>
              <div className="text-gray-500 text-sm">
                <p>오른쪽 지도에서 "영역 그리기" 버튼을 클릭하여 새로운 영역을 그려보세요.</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">저장된 영역</h2>
                <PolygonList
                  polygons={polygons}
                  onSelect={handleSelectPolygon}
                  onDelete={(polygon) => removePolygon(polygon.id)}
                />
              </div>
            </>
          )}
        </div>
      </Sidebar>
      <main className="flex-1 h-full">
        <MapView onPolygonDrawn={handlePolygonDrawn} />
      </main>
    </div>
  );
}

function App() {
  return (
    <MapProvider>
      <AppContent />
    </MapProvider>
  );
}

export default App;
