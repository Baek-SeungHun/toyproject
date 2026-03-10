import type { PolygonData } from '@/types/polygon';

interface PolygonListProps {
  polygons: PolygonData[];
  onSelect?: (polygon: PolygonData) => void;
  onDelete?: (polygon: PolygonData) => void;
}

function PolygonList({ polygons, onSelect, onDelete }: PolygonListProps) {
  if (polygons.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center py-4">
        저장된 영역이 없습니다.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {polygons.map((polygon) => (
        <li
          key={polygon.id}
          className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
        >
          <div
            className="cursor-pointer"
            onClick={() => onSelect?.(polygon)}
          >
            <h3 className="font-medium text-gray-900 text-sm">{polygon.name}</h3>
            {polygon.description && (
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                {polygon.description}
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => onSelect?.(polygon)}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              보기
            </button>
            <button
              onClick={() => onDelete?.(polygon)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PolygonList;
