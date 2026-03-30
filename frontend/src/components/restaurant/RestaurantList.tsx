import type { Restaurant } from '@/types/restaurant';

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
  onSelect?: (restaurant: Restaurant) => void;
}

function RestaurantList({ restaurants, isLoading, onSelect }: RestaurantListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div
          className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent"
          style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
        />
        <span
          className="ml-2.5 text-sm"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          음식점 검색 중...
        </span>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div
        className="text-sm text-center py-8"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
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
          className="px-4 py-3.5 transition-colors cursor-pointer"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg)';
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-sm truncate"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {restaurant.name}
              </h3>
              <span
                className="inline-block px-2 py-0.5 text-xs font-medium mt-1.5"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {restaurant.category}
              </span>
            </div>
            {restaurant.rating && (
              <div className="flex items-center ml-3 shrink-0">
                <span style={{ color: 'var(--color-rating)' }}>★</span>
                <span
                  className="ml-0.5 text-sm font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {restaurant.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <p
            className="text-xs mt-2 truncate"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {restaurant.address}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default RestaurantList;
