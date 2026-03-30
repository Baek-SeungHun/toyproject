import type { PolygonData } from '@/types/polygon';

interface PolygonListProps {
  polygons: PolygonData[];
  hiddenPolygonIds?: Set<string>;
  onSelect?: (polygon: PolygonData) => void;
  onDelete?: (polygon: PolygonData) => void;
  onToggleVisibility?: (id: string) => void;
}

function PolygonList({ polygons, hiddenPolygonIds, onSelect, onDelete, onToggleVisibility }: PolygonListProps) {
  if (polygons.length === 0) {
    return (
      <div
        className="text-sm text-center py-8"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        저장된 영역이 없습니다.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {polygons.map((polygon) => (
        <li
          key={polygon.id}
          className="px-4 py-3.5 transition-colors cursor-pointer"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg)',
          }}
          onClick={() => onSelect?.(polygon)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg)';
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-sm truncate"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {polygon.name}
              </h3>
              {polygon.description && (
                <p
                  className="text-xs mt-1 line-clamp-1"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {polygon.description}
                </p>
              )}
            </div>
            <div className="flex items-center ml-3 gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility?.(polygon.id);
                }}
                className="px-2 py-1 text-xs font-medium transition-colors"
                style={{
                  color: hiddenPolygonIds?.has(polygon.id)
                    ? 'var(--color-text-tertiary)'
                    : 'var(--color-primary)',
                  borderRadius: 'var(--radius-sm)',
                  opacity: hiddenPolygonIds?.has(polygon.id) ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title={hiddenPolygonIds?.has(polygon.id) ? '지도에 표시' : '지도에서 숨기기'}
              >
                {hiddenPolygonIds?.has(polygon.id) ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(polygon);
                }}
                className="px-2 py-1 text-xs font-medium transition-colors"
                style={{
                  color: 'var(--color-text-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-error)';
                  e.currentTarget.style.backgroundColor = '#FFF0F1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-tertiary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PolygonList;
