# 인프라 및 배포

## 포트 정리

| 서비스 | 포트 | 설명 |
|--------|------|------|
| Frontend (Vite dev) | 5173 | React 개발 서버 |
| Backend (Spring Boot) | 9090 | REST API 서버 |
| PostgreSQL + PostGIS | 5432 | 데이터베이스 |
| GeoServer | 8080 | GIS 레이어 발행 (선택적) |

## docker-compose.yml

> **구현 완료**: 볼륨 마운트 추가됨. `docker compose up -d`만 실행하면 DB 테이블 생성 + seed 데이터 삽입까지 자동 완료.

현재 `docker-compose.yml` 내용:

```yaml
services:
  db:
    image: postgis/postgis:16-3.4
    container_name: postgis
    environment:
      POSTGRES_DB: gisdb
      POSTGRES_USER: gisuser
      POSTGRES_PASSWORD: gispass
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d    # 추가
    ports:
      - "5432:5432"
    networks:
      - gis-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gisuser -d gisdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  geoserver:
    image: kartoza/geoserver:2.27.0
    container_name: geoserver
    environment:
      GEOSERVER_ADMIN_USER: admin
      GEOSERVER_ADMIN_PASSWORD: geoserver
    volumes:
      - geoserver-data:/opt/geoserver/data_dir
    ports:
      - "8080:8080"
    networks:
      - gis-net
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:
  geoserver-data:

networks:
  gis-net:
    driver: bridge
```

**핵심 설정**: `db` 서비스의 `./db/init:/docker-entrypoint-initdb.d` 볼륨 마운트.

> PostGIS Docker 이미지는 `/docker-entrypoint-initdb.d/` 내 `.sql` 파일을 알파벳 순서로 자동 실행.

## DB 초기화 스크립트

### 디렉토리 구조

```
db/
└── init/
    ├── 01-create-tables.sql      # 테이블 + 인덱스 생성
    └── 02-seed-restaurants.sql   # 초기 음식점 데이터
```

### 01-create-tables.sql ✅

- PostGIS 확장 활성화
- `users`, `polygons`, `restaurants` 테이블 생성
- GIST 공간 인덱스 생성

### 02-seed-restaurants.sql ✅

- 서울 지역 음식점 **60건** INSERT
- 11개 지역, 8개 카테고리 분포
- `user_id`는 NULL (시스템 데이터)

### 동작 방식

- **pgdata 볼륨 없을 때** (최초 실행): SQL 파일 알파벳순 자동 실행 → DDL + DML 완료
- **pgdata 볼륨 있을 때** (이미 실행됨): SQL 파일 무시 (재실행 안 됨)
- **초기화 다시 하려면**: `docker compose down -v && docker compose up -d`

## 환경변수 관리

### 필수 환경변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | (없음 — 필수) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 | (없음 — 필수) |

### 설정 방법

**방법 1: 환경변수 직접 설정**

```bash
export GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
export GOOGLE_CLIENT_SECRET=your-client-secret
```

**방법 2: IntelliJ Run Configuration**

Run/Debug Configuration → Environment Variables에 설정.

**방법 3: .env 파일 (gitignore에 추가)**

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

> `.env` 파일은 `.gitignore`에 반드시 포함하여 버전 관리에서 제외.

## Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. "API 및 서비스" → "OAuth 동의 화면" 설정
   - 사용자 유형: 외부
   - 앱 이름, 이메일 설정
   - 범위: `email`, `profile`
   - 테스트 사용자 추가
4. "사용자 인증 정보" → "사용자 인증 정보 만들기" → "OAuth 2.0 클라이언트 ID"
   - 애플리케이션 유형: 웹 애플리케이션
   - 승인된 JavaScript 원본: `http://localhost:5173`
   - 승인된 리디렉션 URI: `http://localhost:9090/login/oauth2/code/google`
5. 생성된 Client ID, Client Secret을 환경변수로 설정

## 개발 환경 구동 순서

```bash
# 1. Docker 컨테이너 실행 (PostgreSQL + GeoServer)
docker compose up -d

# 2. DB 초기화 확인 (최초 실행 시 자동)
docker exec -it postgis psql -U gisuser -d gisdb -c "SELECT count(*) FROM restaurants;"

# 3. 환경변수 설정
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret

# 4. 백엔드 실행 (프로젝트 루트에서)
cd backend && ./gradlew bootRun

# 5. 프론트엔드 실행 (별도 터미널)
cd frontend && npm run dev
```

접속: `http://localhost:5173`

## GeoServer 설정 가이드 (선택적)

MVP에서는 선택적. 핵심 공간 쿼리는 REST API로 직접 수행.

### Workspace 생성

1. GeoServer 관리 콘솔 접속: `http://localhost:8080/geoserver`
   - 계정: admin / geoserver
2. "Workspaces" → "Add new workspace"
   - Name: `toyproject`
   - Namespace URI: `http://toyproject.com/gis`

### Store 생성 (PostGIS 연결)

1. "Stores" → "Add new Store" → "PostGIS"
   - Workspace: `toyproject`
   - Data Source Name: `postgis`
   - host: `db` (Docker 네트워크 내부 호스트명)
   - port: `5432`
   - database: `gisdb`
   - user: `gisuser`
   - passwd: `gispass`

### Layer 발행

1. "Layers" → "Add a new layer"
   - Store: `toyproject:postgis`
   - 발행할 테이블 선택 (`restaurants` 등)
   - "Publish" 클릭
   - SRS: EPSG:4326
   - Bounding Box: "Compute from data" 클릭

### WMS/WFS 사용 (프론트엔드에서)

```
WMS: http://localhost:8080/geoserver/toyproject/wms
WFS: http://localhost:8080/geoserver/toyproject/wfs
```

> OpenLayers에서 `TileWMS` 또는 `ImageWMS` 소스로 레이어 추가 가능. 현재 MVP에서는 미사용.
