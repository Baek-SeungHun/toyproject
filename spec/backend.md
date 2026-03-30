# 백엔드 설계

> ✅ 구현 완료 | Spring Boot 4.0.3 + Jackson 3.0 + MyBatis 4.0.1

## 패키지 구조

```
com.toyproject.backend/
├── BackendApplication.java
├── common/
│   ├── dto/ApiResponse.java                  # 공통 응답 래퍼 {success, data, message}
│   └── exception/GlobalExceptionHandler.java # @RestControllerAdvice 전역 예외 처리
├── config/
│   ├── SecurityConfig.java                   # Spring Security + OAuth2 + CORS
│   └── CorsConfig.java                       # WebMvc CORS (localhost:5173)
└── domain/
    ├── auth/
    │   ├── controller/AuthController.java
    │   ├── entity/User.java
    │   ├── mapper/UserMapper.java
    │   └── service/
    │       ├── CustomOAuth2UserService.java
    │       └── OAuth2LoginSuccessHandler.java
    ├── polygon/
    │   ├── controller/PolygonController.java
    │   ├── dto/{PolygonRequest, PolygonResponse}.java
    │   ├── entity/Polygon.java
    │   ├── mapper/PolygonMapper.java
    │   └── service/PolygonService.java
    └── restaurant/
        ├── controller/RestaurantController.java
        ├── dto/{RestaurantRequest, RestaurantSearchRequest, RestaurantResponse}.java
        ├── entity/Restaurant.java
        ├── mapper/RestaurantMapper.java
        └── service/RestaurantService.java
```

MyBatis XML: `resources/mapper/{UserMapper, PolygonMapper, RestaurantMapper}.xml`

## 엔티티 필드 요약

| 엔티티 | 필드 | 비고 |
|--------|------|------|
| **User** | id, email, name, profileImage, provider, providerId, createdAt, updatedAt | |
| **Polygon** | id, userId, name, description, geomJson(String), createdAt, updatedAt | `geomJson`은 ST_AsGeoJSON 결과 |
| **Restaurant** | id, userId, name, category, address, rating(BigDecimal), longitude(Double), latitude(Double), createdAt, updatedAt | 좌표는 ST_X/ST_Y로 추출 |

## DTO 요약

| DTO | 주요 필드 | 비고 |
|-----|-----------|------|
| **ApiResponse\<T\>** | success(boolean), data(T), message | 정적 팩토리: `ok()`, `error()` |
| **PolygonRequest** | name, description, geoJson(Object) | GeoJSON Geometry 객체 |
| **PolygonResponse** | id(String), name, description, geoJson(Object), createdAt | Long→String 변환 |
| **RestaurantRequest** | name, category, address, rating, coordinates(double[]) | [경도, 위도] |
| **RestaurantSearchRequest** | geometry(Object) | GeoJSON Geometry 객체 |
| **RestaurantResponse** | id(String), name, category, address, rating, coordinates(double[]) | Long→String 변환 |

## PostGIS Geometry 처리 전략

GeoJSON 문자열로 주고받기 — 별도 TypeHandler 불필요.

```
[프론트엔드]                    [백엔드]                      [DB]
GeoJSON 객체  ──JSON 전송──▶  Object로 수신  ──문자열 변환──▶  ST_GeomFromGeoJSON(:geoJson)
              ◀──JSON 응답──  Object로 반환  ◀──문자열 파싱──  ST_AsGeoJSON(geom)
```

- **요청**: Service에서 `ObjectMapper.writeValueAsString()`으로 JSON 문자열 변환 → MyBatis 파라미터 전달
- **응답**: MyBatis에서 `ST_AsGeoJSON(geom)` String 수신 → `ObjectMapper.readValue()`로 Object 파싱
- MyBatis XML `resultType`은 FQCN 사용 (예: `com.toyproject.backend.domain.auth.entity.User`)

## 컨트롤러 설계 규칙

- 모든 컨트롤러는 `ResponseEntity<ApiResponse<T>>`로 HTTP 상태 코드를 명시적으로 제어
- OAuth2User → DB userId 변환은 `UserMapper`를 주입하여 컨트롤러에서 처리
- POST 생성 API는 `201 Created` 반환

| 컨트롤러 | 엔드포인트 | 인증 |
|----------|-----------|------|
| AuthController | `GET /api/auth/me` | permitAll (비인증 시 401 직접 반환) |
| PolygonController | `POST/GET/DELETE /api/polygons` | authenticated |
| RestaurantController | `POST /api/restaurants/search` | permitAll |
| RestaurantController | `POST/PUT/DELETE /api/restaurants` | authenticated |

> `/api/restaurants/import` (공공데이터 연동)은 2단계 구현 대상으로 미구현.

## 예외 처리

- `IllegalArgumentException` → 400 Bad Request
- 그 외 `Exception` → 500 Internal Server Error ("서버 오류가 발생했습니다")

## 주의사항

- Spring Boot 4.0.3은 **Jackson 3.0**을 사용 → import: `tools.jackson.databind.ObjectMapper` (기존 `com.fasterxml.jackson.databind` 아님)
- 빌드 시 **JDK 17+** 필요 (시스템 기본 JDK 8이면 `JAVA_HOME` 설정 필요)
