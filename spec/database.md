# 데이터베이스 스키마

> ✅ 구현 완료 | DDL: `db/init/01-create-tables.sql`, Seed: `db/init/02-seed-restaurants.sql`

## PostGIS 확장

- `postgis/postgis:16-3.4` Docker 이미지 사용
- **EPSG:4326** (WGS84, ���경도) 좌표계
- 프론트엔드에서 EPSG:3857 → 4326 변환 후 전송, DB에는 항상 4326으로 저장

## 테이블 구조

### users

| 컬럼 | 타입 | 제약 |
|------|------|------|
| id | BIGSERIAL | PK |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| name | VARCHAR(100) | NOT NULL |
| profile_image | VARCHAR(500) | |
| provider | VARCHAR(20) | NOT NULL, DEFAULT 'google' |
| provider_id | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

- UNIQUE (provider, provider_id)

### polygons

| 컬럼 | 타입 | 제약 |
|------|------|------|
| id | BIGSERIAL | PK |
| user_id | BIGINT | NOT NULL, FK → users(id) ON DELETE CASCADE |
| name | VARCHAR(100) | NOT NULL |
| description | TEXT | |
| geom | GEOMETRY(Polygon, 4326) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

- 인덱스: `idx_polygons_user_id`, `idx_polygons_geom` (GIST)

### restaurants

| 컬럼 | 타입 | 제약 |
|------|------|------|
| id | BIGSERIAL | PK |
| user_id | BIGINT | FK → users(id) ON DELETE SET NULL |
| name | VARCHAR(200) | NOT NULL |
| category | VARCHAR(50) | NOT NULL |
| address | VARCHAR(500) | NOT NULL |
| rating | DECIMAL(2,1) | |
| geom | GEOMETRY(Point, 4326) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

- `user_id = NULL`: 시스템 데이터 (seed/공공데이터), `user_id` 있음: 사용자 등록 맛집
- 인덱스: `idx_restaurants_user_id`, `idx_restaurants_geom` (GIST), `idx_restaurants_category`

## 핵심 공간 쿼리 패턴

| 용도 | PostGIS 함수 |
|------|-------------|
| 폴리곤 내 맛집 검색 | `ST_Contains(ST_GeomFromGeoJSON(:geoJson), geom)` |
| 폴리곤 저장 | `ST_GeomFromGeoJSON(:geoJson)` |
| 폴리곤 조회 | `ST_AsGeoJSON(geom) AS geom_json` |
| 맛집 좌표 저장 | `ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)` |
| 맛집 좌표 조회 | `ST_X(geom) AS longitude`, `ST_Y(geom) AS latitude` |

## Seed 데이터

`db/init/02-seed-restaurants.sql` — 서울 지역 음식점 **60건**

- **카테고리**: 한식(15), 일식(8), 중식(6), 양식(9), 카페(8), 분식(5), 치킨/피자(5), 기타(3)
- **지역**: 강남/역삼(10), 종로/광화문(8), 마포/홍대(8), 이태원(5), 성수(5), 여의도(5), 잠실/송파(5), 신촌/연남(5), 건대/왕십리(3), 을지로/명동(3), 용산/삼각지(3)
- 모두 `user_id = NULL` (시스템 데이터)
- `docker compose up` 최초 실행 시 자동 적용
