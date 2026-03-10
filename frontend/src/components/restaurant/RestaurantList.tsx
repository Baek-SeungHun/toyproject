import type { Restaurant } from '@/types/restaurant';

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
  onSelect?: (restaurant: Restaurant) => void;
}

function RestaurantList({ restaurants, isLoading, onSelect }: RestaurantListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
        <span className="ml-2 text-sm text-gray-500">음식점 검색 중...</span>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center py-4">
        해당 영역에 음식점이 없습니다.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {restaurants.map((restaurant) => (
        <li
          key={restaurant.id}
          onClick={() => onSelect?.(restaurant)}
          className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate">
                {restaurant.name}
              </h3>
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded mt-1">
                {restaurant.category}
              </span>
            </div>
            {restaurant.rating && (
              <div className="flex items-center text-amber-500 text-sm ml-2">
                <span>★</span>
                <span className="ml-0.5">{restaurant.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-2 truncate">{restaurant.address}</p>
        </li>
      ))}
    </ul>
  );
}

export default RestaurantList;
