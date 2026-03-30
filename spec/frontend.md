# 프론트엔드 통합 명세

> 최종 업데이트: 2026-03-30 (구현 완료)

## 구현 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Vite Proxy 설정 | ✅ 완료 | `/api`, `/oauth2`, `/login` 프록시 |
| API 클라이언트 | ✅ 완료 | client, auth, polygons, restaurants 4개 모듈 |
| AuthContext | ✅ 완료 | useAuth 훅 제공 |
| usePolygons API 연동 | ��� 완료 | 서버 연동 + 로컬 폴백 |
| useRestaurants API 연동 | �� 완료 | Mock 제거, API 호출 |
| 토스 스타일 디자인 | ✅ 완료 | CSS 변수 기반 디자인 시스템 |
| 컴포넌트 리디자인 | ✅ 완료 | 5개 컴포넌트 토스 스타일 적용 |
| 신규 컴포넌트 | ✅ 완료 | LoginButton, RestaurantForm |
| App.tsx 통합 | ✅ 완료 | AuthProvider 래핑, LoginButton 배치 |
| 폴리곤 개별 표시 토글 | ✅ 완료 | 저장된 영역 목록에서 개별 폴리곤 지도 표시/숨김 |
| 로그아웃 시 세션 초기화 | ✅ 완료 | 폴리곤·지도 feature·음식점 리스트 전체 초기화 |

## 1. Vite Proxy 설정

`frontend/vite.config.ts`에 백엔드 프록시 설정 완료:

```typescript
server: {
  proxy: {
    '/api': { target: 'http://localhost:9090', changeOrigin: true },
    '/oauth2': { target: 'http://localhost:9090', changeOrigin: true },
    '/login': { target: 'http://localhost:9090', changeOrigin: true },
  },
},
```

- `/api` — REST API 호출
- `/oauth2` — OAuth2 로그인 시작 (`/oauth2/authorization/google`)
- `/login` — OAuth2 콜백 (`/login/oauth2/code/google`)

## 2. API 클라이언트

### src/api/client.ts

공통 fetch 래퍼. `credentials: 'include'`로 세션 쿠키 자동 포함. 응답의 `result.data`를 반환.

```typescript
const BASE_URL = '/api';

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '요청 실패' }));
    throw new Error(error.message);
  }
  const result = await response.json();
  return result.data;
}
```

### src/api/auth.ts

User 인터페이스 정의 포함. `getMe()`는 실패 시 `null` 반환 (비로그인 상태).

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
}

export const authApi = {
  getMe: () => request<User | null>('/auth/me').catch(() => null),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  getLoginUrl: () => '/oauth2/authorization/google',
};
```

### src/api/polygons.ts

타입 정의(`PolygonCreateRequest`, `PolygonResponse`) 포함.

```typescript
export const polygonsApi = {
  list: () => request<PolygonResponse[]>('/polygons'),
  create: (data: PolygonCreateRequest) =>
    request<PolygonResponse>('/polygons', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: string) => request<PolygonResponse>(`/polygons/${id}`),
  delete: (id: string) => request<void>(`/polygons/${id}`, { method: 'DELETE' }),
};
```

### src/api/restaurants.ts

`RestaurantCreateRequest` 타입 정의 포함. 기존 `Restaurant` 타입은 `@/types/restaurant`에서 가져옴.

```typescript
export const restaurantsApi = {
  search: (geometry: GeoJsonGeometry) =>
    request<Restaurant[]>('/restaurants/search', { method: 'POST', body: JSON.stringify({ geometry }) }),
  create: (data: RestaurantCreateRequest) =>
    request<Restaurant>('/restaurants', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: RestaurantCreateRequest) =>
    request<Restaurant>(`/restaurants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/restaurants/${id}`, { method: 'DELETE' }),
};
```

## 3. AuthContext

파일: `src/contexts/AuthContext.tsx`. `MapContext` 패턴과 동일한 구조.

```typescript
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: () => void;   // window.location.href → Google OAuth
  logout: () => void;  // POST /api/auth/logout → user = null
}
```

- 마운트 시 `GET /api/auth/me` 호출하여 로그인 상태 확인
- 실패 시(백엔드 미연결 포함) `user = null`로 비로그인 상태 처리
- `useAuth()` 커스텀 훅으로 접근

## 4. 기존 훅 수정

### usePolygons.ts

- `loadPolygons()`: 마운트 시 `polygonsApi.list()` 호출, `clearFeatures()` 후 서버 폴리곤을 지도에 추가. React Strict Mode 중복 방지. 실패 시 빈 배열.
- `addPolygon()`: `polygonsApi.create()` 호출 → 서버 반환 ID 사용. **실패 시 `crypto.randomUUID()`로 로컬 폴백.**
- `removePolygon()`: `polygonsApi.delete()` 호출 → 실패해도 로컬 state에서 제거. side effect(`removeFeature`)는 setState 외부에서 실행.
- `togglePolygonVisibility(id)`: `hiddenPolygonIds` Set으로 숨김 상태 관리. vectorSource에서 feature를 add/remove하여 지도 표시 제어. side effect는 setState 외부에서 실행.
- `resetPolygons()`: `clearFeatures()` + 폴리곤·드로잉·숨김 state 전체 초기화. 로그아웃 시 호출.
- GeoJSON → Feature 변환: `geoJsonStringToFeature()` 활용.

### useRestaurants.ts

- `MOCK_RESTAURANTS` 상수 **제거 완료**.
- `fetchRestaurantsInPolygon()`: `geometryToGeoJson(feature)` → `restaurantsApi.search(geometry)` 호출.
- 실패 시 빈 배열로 폴백.

## 5. 토스 스타일 디자인 시스템

`src/styles/globals.css`에 CSS 변수로 정의.

### 컬러 팔레트

| 변수 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#3182F6` | 토스블루 (주 액션) |
| `--color-primary-hover` | `#1B64DA` | 호버 상태 |
| `--color-text-primary` | `#191F28` | 본문 텍스트 |
| `--color-text-secondary` | `#4E5968` | 부제/라벨 |
| `--color-text-tertiary` | `#8B95A1` | 보조 텍스트 |
| `--color-bg` | `#FFFFFF` | 배경 |
| `--color-bg-secondary` | `#F2F4F6` | 보조 배경 |
| `--color-border` | `#E5E8EB` | 테두리 |
| `--color-divider` | `#F2F4F6` | 구분선 |
| `--color-success` | `#3CCB7F` | 성공 |
| `--color-error` | `#F04452` | 에러 |
| `--color-warning` | `#FF9500` | 경고 |
| `--color-rating` | `#FFD754` | 별점 |

### 그림자 / 둥근 모서리

| 변수 | 값 |
|------|-----|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` |
| `--shadow-md` | `0 2px 8px rgba(0,0,0,0.08)` |
| `--shadow-lg` | `0 4px 16px rgba(0,0,0,0.12)` |
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `16px` |
| `--radius-pill` | `999px` |

### 디자인 원칙

- 흰 배경 + 연회색 보조 배경
- 넉넉한 패딩 (px-4~6, py-3~5)
- hover 시 배경색 전환 (border 변화 대신)
- 인풋 focus 시 토스블루 ring 효과
- 폰트: Pretendard

## 6. 컴포넌트 구조

### 수정된 컴포넌트

| 컴포넌트 | 주요 변경 |
|----------|-----------|
| `Sidebar.tsx` | `header` prop 추가 (LoginButton 배치), 토스 스타일 |
| `MapView.tsx` | 버튼 pill 형태 + 토스블루, hover 상태 처리 |
| `PolygonForm.tsx` | 토스 인풋 스타일 (focus ring), 둥근 버튼 |
| `PolygonList.tsx` | hover 배경 전환, 삭제 버튼 hover 시 빨간색, 보기 토글 버튼(눈 아이콘) 추가 |
| `RestaurantList.tsx` | 카테고리 뱃지, 별점 표시, hover 배경 전환 |

### 신규 컴포넌트

| 컴포넌트 | 설명 |
|----------|------|
| `LoginButton.tsx` | 비로그인: Google 아이콘 + 로그인 버튼. 로그인: 프로필 이미지 + 이름 + 로그아웃. 로딩: 스켈레톤. `onLogout` 콜백으로 로그아웃 시 세션 초기화 트리거. |
| `RestaurantForm.tsx` | 이름, 카테고리(select), 주소, 평점 입력. 카테고리: 한식/일식/중식/양식/카페/분식/치킨·피자/기타. |

## 7. App.tsx 구조

```typescript
function App() {
  return (
    <AuthProvider>        {/* 인증 상태 */}
      <MapProvider>       {/* 지도 상태 */}
        <AppContent />    {/* 실제 UI */}
      </MapProvider>
    </AuthProvider>
  );
}
```

Sidebar의 `header` prop에 `<LoginButton />`을 전달하여 사이드바 상단에 로그인/유저 정보 표시.

## 파일 구조

```
src/
├── api/
│   ├── client.ts              # 공통 fetch 래퍼
│   ├── auth.ts                # 인증 API (User 타입 포함)
│   ├── polygons.ts            # 폴리곤 CRUD API
│   └── restaurants.ts         # 맛집 검색/CRUD API
├── components/
│   ��── auth/
│   │   └── LoginButton.tsx    # 로그인/로그아웃 버튼
│   ├── layout/
│   │   └── Sidebar.tsx        # 사이드바 (header prop 추가)
│   ├── map/
│   │   └── MapView.tsx        # 지도 + 토스 스타일 컨트롤
│   ├── polygon/
│   │   ├── PolygonForm.tsx    # 영역 저장 폼
│   │   └── PolygonList.tsx    # 영역 목록
│   └── restaurant/
│       ├── RestaurantForm.tsx # 맛집 등록 폼
│       └── RestaurantList.tsx # 맛집 목록
├── contexts/
│   ├── AuthContext.tsx         # 인증 Context + useAuth
│   └── MapContext.tsx          # 지도 Context + useMapContext
├── hooks/
│   ├── useDrawing.ts          # 폴리곤 그리기
��   ├── useMapInit.ts          # 지도 초기화
│   ├── usePolygons.ts         # 폴리곤 상태 + API 연동
│   └── useRestaurants.ts     # 맛집 상태 + API 연동
├── styles/
│   └── globals.css            # 토스 디자인 시스템 변수
├── types/
│   ├── map.ts
│   ���── polygon.ts
│   ���── restaurant.ts
├── utils/
│   └── geoUtils.ts            # GeoJSON 변환 유틸
├── App.tsx                     # AuthProvider > MapProvider > AppContent
└── main.tsx
```

## 백엔드 미연결 시 동작

| 기능 | 폴백 동작 |
|------|-----------|
| 로그인 상태 확인 (`/api/auth/me`) | `user = null` (비로그인 상태) |
| 폴리곤 목록 로드 (`/api/polygons`) | 빈 배열 |
| 폴리곤 저장 (`POST /api/polygons`) | 로컬 `crypto.randomUUID()`로 ID 생성, 로컬 state에만 저장 |
| 폴리곤 삭제 (`DELETE /api/polygons/:id`) | 로컬 state에서 제거 |
| 맛집 검색 (`POST /api/restaurants/search`) | 빈 배열 |

## 미구현 / 향후 과제

| 항목 | 설명 |
|------|------|
| RestaurantForm 통합 | 맛집 등록 버튼 클릭 시 폼 표시 (컴포넌트 생성 완료, App에 미연결) |
| 좌표 선택 | RestaurantForm에서 지도 클릭으로 좌표 선택 (현재 하드코딩 `[0, 0]`) |
| 폴리곤 포커스 | 저장된 폴리곤 클릭 시 지도 이동/포커스 (onSelect 핸들러 console.log만 구현) |
| 맛집 마커 | 음식점 클릭 시 지도에 마커 표시 |
