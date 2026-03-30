-- PostGIS 확장 활성화 (postgis/postgis 이미지에서 자동 활성화되지만 명시적으로 선언)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 사용자 테이블
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    profile_image   VARCHAR(500),
    provider        VARCHAR(20)  NOT NULL DEFAULT 'google',
    provider_id     VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),

    UNIQUE (provider, provider_id)
);

-- 폴리곤 테이블
CREATE TABLE polygons (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    geom        GEOMETRY(Polygon, 4326) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_polygons_user_id ON polygons(user_id);
CREATE INDEX idx_polygons_geom ON polygons USING GIST(geom);

-- 음식점 테이블
CREATE TABLE restaurants (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    name        VARCHAR(200) NOT NULL,
    category    VARCHAR(50)  NOT NULL,
    address     VARCHAR(500) NOT NULL,
    rating      DECIMAL(2,1),
    geom        GEOMETRY(Point, 4326) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX idx_restaurants_geom ON restaurants USING GIST(geom);
CREATE INDEX idx_restaurants_category ON restaurants(category);
