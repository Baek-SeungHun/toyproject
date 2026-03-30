# 프로젝트 개요

## 목표

GIS 기반 맛집 탐색 애플리케이션. 사용자가 지도에 폴리곤 영역을 그리고, 해당 영역 내 맛집을 조회한다.

## MVP 범위

1. **Google OAuth 로그인** - 구글 계정으로 간편 로그인/로그아웃
2. **폴리곤 CRUD** - 지도에 영역 그리기, 저장, 목록 조회, 삭제
3. **맛집 공간 쿼리** - 폴리곤 내부 맛집 검색 (PostGIS `ST_Contains`)
4. **맛집 CRUD** - 사용자 직접 맛집 등록/수정/삭제
5. **공공데이터 연동** - 서울시 음식점 데이터 수집 (관리용)

## 시스템 아키텍처

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│                 │     │                      │     │                      │
│   Browser       │────▶│   Spring Boot        │────▶│   PostgreSQL         │
│   (React +      │ API │   (REST API)         │ SQL │   + PostGIS          │
│    OpenLayers)   │◀────│   :9090              │◀────│   :5432              │
│   :5173         │     │                      │     │                      │
│                 │     │                      │     │                      │
└─────────────────┘     └──────────────────────┘     └──────────────────────┘
                               │                            │
                               │ (선택적)                     │
                               ▼                            │
                        ┌──────────────────────┐            │
                        │                      │            │
                        │   GeoServer          │────────────┘
                        │   :8080              │  PostGIS 연결
                        │                      │
                        └──────────────────────┘
```

- **브라우저**: React 19 + OpenLayers 10으로 지도 렌더링, 폴리곤 드로잉, API 호출
- **Spring Boot**: REST API 제공, OAuth2 인증, PostGIS 공간 쿼리 실행
- **PostgreSQL + PostGIS**: 공간 데이터 저장 및 쿼리 (`GEOMETRY` 타입, GIST 인덱스)
- **GeoServer**: WMS/WFS 레이어 발행 (MVP에서는 선택적 — 핵심 쿼리는 REST API로 직접 수행)

## 현재 구현 상태

| 영역 | 상태 | 설명 |
|------|------|------|
| 프론트엔드 UI | ✅ 완성 | 토스 스타일 디자인 시스템 적용, 전체 컴포넌트 리디자인 완료 |
| 프론트엔드 API 연동 | ✅ 완료 | API 클라이언트 4개 모듈, AuthContext, Vite proxy 설정 완료. 백엔드 미연결 시 graceful fallback |
| 프론트엔드 인증 UI | ✅ 완료 | Google 로그인/로그아웃 버튼, 사용자 프로필 표시 |
| 백엔드 | ❌ 초기 상태 | 진입점(`BackendApplication.java`)과 빈 패키지 구조만 존재 |
| 데이터베이스 | ❌ 미구현 | Docker로 PostGIS 컨테이너 실행 가능하나, 테이블/데이터 없음 |
| 인프라 | ⚠️ 부분 완성 | docker-compose.yml에 PostGIS + GeoServer 정의됨. DB 초기화 스크립트 없음 |

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| **Frontend** | React | 19.2.0 |
| | TypeScript | 5.9.3 |
| | Vite | 7.3.1 |
| | Tailwind CSS | 4.2.1 |
| | OpenLayers | 10.8.0 |
| **Backend** | Spring Boot | 4.0.3 |
| | Java | 17 |
| | MyBatis | 4.0.1 |
| | Spring Security OAuth2 Client | (Spring Boot 관리) |
| **Database** | PostgreSQL + PostGIS | 16 + 3.4 |
| **GIS Server** | GeoServer | 2.27.0 |
| **Infra** | Docker Compose | - |
