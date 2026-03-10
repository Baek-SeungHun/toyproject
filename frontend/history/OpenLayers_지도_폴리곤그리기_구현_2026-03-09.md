# 변경사항 요약 (2026-03-09)

## 주요 변경점
1. OpenLayers 기반 지도 화면 구현 및 폴리곤 그리기/저장 기능 개발
2. **SOLID 원칙 기반 아키텍처 리팩토링**

---

## 설치된 패키지
- `ol` (OpenLayers) - 지도 라이브러리
- `tailwindcss`, `@tailwindcss/vite` - CSS 프레임워크

---

## 프로젝트 구조 (리팩토링 후)

```
src/
├── contexts/                # 전역 상태 (Context API)
│   └── MapContext.tsx       # 지도 인스턴스 + VectorSource 관리
├── hooks/                   # 커스텀 훅 (로직 분리)
│   ├── useMapInit.ts        # 지도 초기화 로직
│   ├── useDrawing.ts        # 그리기 인터랙션 로직
│   ├── usePolygons.ts       # 폴리곤 CRUD 로직
│   └── useRestaurants.ts    # 음식점 조회 로직
├── components/              # Presentation 컴포넌트
│   ├── map/MapView.tsx
│   ├── layout/Sidebar.tsx
│   ├── polygon/
│   │   ├── PolygonForm.tsx
│   │   └── PolygonList.tsx
│   └── restaurant/RestaurantList.tsx
├── types/                   # 타입 정의
│   ├── map.ts
│   ├── polygon.ts
│   └── restaurant.ts
├── utils/
│   └── geoUtils.ts          # GeoJSON 변환 유틸
└── App.tsx                  # Composition Root
```

---

## SOLID 원칙 적용

| 원칙 | 적용 내용 |
|------|----------|
| **SRP** | 각 훅은 하나의 책임만 담당 (지도 초기화, 그리기, 폴리곤 관리, 음식점 조회) |
| **OCP** | 새 기능 추가 시 기존 코드 수정 없이 새 훅/컴포넌트 추가 가능 |
| **DIP** | MapContext를 통한 의존성 주입, 컴포넌트는 추상화에 의존 |

---

## 생성된 파일

### Context
| 파일 | 설명 |
|------|------|
| `src/contexts/MapContext.tsx` | 지도 인스턴스 및 VectorSource 전역 관리 |

### Hooks
| 파일 | 설명 |
|------|------|
| `src/hooks/useMapInit.ts` | 지도 초기화 (레이어, 뷰 설정) |
| `src/hooks/useDrawing.ts` | 폴리곤 그리기 인터랙션 관리 |
| `src/hooks/usePolygons.ts` | 폴리곤 CRUD (추가, 삭제, 상태 관리) |
| `src/hooks/useRestaurants.ts` | 영역 내 음식점 조회 |

### 컴포넌트
| 파일 | 설명 |
|------|------|
| `src/components/map/MapView.tsx` | 지도 Presentation 컴포넌트 |
| `src/components/layout/Sidebar.tsx` | 좌측 사이드바 레이아웃 |
| `src/components/polygon/PolygonForm.tsx` | 폴리곤 저장 폼 |
| `src/components/polygon/PolygonList.tsx` | 저장된 폴리곤 목록 |
| `src/components/restaurant/RestaurantList.tsx` | 영역 내 음식점 목록 |

### 타입 정의
| 파일 | 설명 |
|------|------|
| `src/types/map.ts` | 지도 관련 타입 (Coordinates, MapConfig 등) |
| `src/types/polygon.ts` | 폴리곤 타입 (PolygonData, PolygonFormData 등) |
| `src/types/restaurant.ts` | 음식점 타입 (Restaurant) |

### 유틸리티
| 파일 | 설명 |
|------|------|
| `src/utils/geoUtils.ts` | GeoJSON 변환 (GeoJsonGeometry, GeoJsonFeature 타입 포함) |

---

## 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/App.tsx` | Composition Root로 역할 변경 (MapProvider 래핑, 훅 조합) |
| `src/styles/globals.css` | Tailwind CSS 적용 |
| `vite.config.ts` | Tailwind 플러그인 추가 |

---

## 구현된 기능

### 1. 지도 표시
- OpenLayers + OSM 타일 레이어
- 기본 중심: 서울 시청 (126.9780, 37.5665)

### 2. 폴리곤 그리기
- 우측 상단 "영역 그리기" 버튼
- 지도 클릭으로 꼭지점 지정
- 더블클릭으로 폴리곤 완성

### 3. 폴리곤 저장/삭제
- 영역 이름 (필수), 설명 (선택) 입력
- GeoJSON 형식으로 변환 (EPSG:4326)
- PostGIS 저장 준비 완료
- **삭제 시 지도에서도 폴리곤 제거**

### 4. 사이드바 UI
- 폴리곤 미완성 시: 안내 문구 + 저장된 영역 목록
- 폴리곤 완성 시: 저장 폼 + 영역 내 음식점 목록

---

## 화면 구조
```
┌─────────────────────────────────────────────────────┐
│ ┌─────────────┐ ┌─────────────────────────────────┐ │
│ │  Sidebar    │ │           MapView               │ │
│ │  (20%)      │ │           (80%)                 │ │
│ │             │ │                    [영역 그리기]│ │
│ │ - 폼/안내   │ │                                 │ │
│ │ - 목록      │ │         OpenLayers 지도         │ │
│ └─────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 데이터 흐름
```
[사용자 그리기] 
    → useDrawing (인터랙션)
    → MapContext (VectorSource에 Feature 추가)
    → usePolygons (상태 관리)
    → useRestaurants (음식점 조회)
    → UI 업데이트
```

---

## TODO (백엔드 연동 필요)
- [ ] 폴리곤 저장 API 연동
- [ ] 폴리곤 불러오기 API 연동
- [ ] 영역 내 음식점 조회 API 연동
- [ ] 음식점 데이터 저장/불러오기
