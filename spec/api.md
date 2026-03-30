# REST API 명세

> ✅ 1~4 구�� 완료 | 5. 공공데이터 연동 API 미구현 (2단계)

## 공통 사항

- **Base URL**: `http://localhost:9090/api`
- **Content-Type**: `application/json`
- **인증**: 세션 기반 (Spring Security OAuth2 + HttpSession). 세션 쿠키 자동 전송
- **응답 형식**: `{ "success": boolean, "data": T | null, "message": string | null }`

### HTTP 상태 코드

| 코드 | 의미 |
|------|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 500 | 서버 오류 |

---

## 1. 인증 API

### GET /api/auth/me

현재 로그인된 사용자 정보 조회.

- **로그인 상태**: `{ id, email, name, profileImage }`
- **비로그인 상태**: 401 Unauthorized

### POST /api/auth/logout

로그아웃 (세션 무효화). SecurityConfig의 logout 설정에서 처리.

- **응답**: `{ success: true, data: null, message: "로그아웃 되었습니다" }`

### OAuth2 리다이렉트

| 경로 | 설명 |
|------|------|
| `GET /oauth2/authorization/google` | Google 로그인 시작 |
| `GET /login/oauth2/code/google` | Google 콜백 처리 |

---

## 2. 폴리곤 API

모든 폴리곤 API는 **인증 필수**.

### POST /api/polygons → 201 Created

새 폴리곤 저장.

- **요청**: `{ name, description, geoJson: GeoJSON Geometry 객체 }`
- **응답**: `{ id(string), name, description, geoJson(object), createdAt }`

### GET /api/polygons

현재 사용자의 폴리곤 목록 조회. 최신순 정렬.

### GET /api/polygons/{id}

특정 폴리곤 상세 조회.

### DELETE /api/polygons/{id}

폴리곤 삭제. 본인 소유만 삭제 가능.

---

## 3. 맛집 검색 API

### POST /api/restaurants/search — permitAll

폴리곤 영역 내 맛집 검색. 비로그인도 가능.

- **요청**: `{ geometry: GeoJSON Geometry 객체 }`
- **응답**: `[{ id(string), name, category, address, rating, coordinates: [경도, 위도] }]`
- 백엔드에서 `ST_Contains(ST_GeomFromGeoJSON(:geoJson), geom)` 쿼리 실행

---

## 4. 맛집 CRUD API

모든 맛집 CRUD API는 **인증 필수**.

### POST /api/restaurants ��� 201 Created

- **요청**: `{ name, category, address, rating, coordinates: [경도, 위도] }`
- **응답**: 생성된 맛집 객체

### PUT /api/restaurants/{id}

본인이 등록한 맛집만 수정 가능. 요청 body는 POST와 동일.

### DELETE /api/restaurants/{id}

본인이 등록한 맛집만 삭제 가능.

---

## 5. 공공데이터 연동 API (2단계)

### POST /api/restaurants/import

공공데이터 수집 트리거. 서울시 일반음식점 인허가 데이터(공공데이터포털) 기반.

---

## 프론트엔드 타입 호환 매핑

| 프론트엔드 타입 | API 필드 | 비고 |
|----------------|----------|------|
| `Restaurant.id` (string) | `id` (string) | 서버에서 Long→String 변환 |
| `Restaurant.coordinates` ([number, number]) | `coordinates` ([lon, lat]) | DB에서 ST_X/ST_Y로 추출 |
| `PolygonData.id` (string) | `id` (string) | 서버에서 Long→String 변환 |
| `PolygonData.geoJson` | `geoJson` | ST_AsGeoJSON → ObjectMapper 파싱 |
