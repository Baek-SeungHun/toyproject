# GIS 데이터를 활용한 맛집찾기

내가 원하는 영역을 그리고 그 안의 맛집을 찾아보자!

## 주요 기능

1. **회원가입** - 구글 OAuth를 통한 간편 로그인
2. **영역 관리** - 지도에 원하는 영역 그리기/저장하기/불러오기
3. **맛집 조회** - 그려진 영역 내부의 맛집 데이터 조회하기

## 기술 스택

### Backend
- **Framework**: Spring Boot 4.0.3
- **Language**: Java 17
- **Database**: PostgreSQL + PostGIS
- **Mapper**: MyBatis 4.0.1
- **GIS Server**: GeoServer

### Frontend
- **Build Tool**: Vite 7.3.1
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **CSS**: Tailwind CSS 4.2.1
- **Map Library**: OpenLayers 10.8.0

## 프로젝트 구조

```
toyproject/
├── backend/
│   └── src/main/java/com/toyproject/backend/
│       ├── common/          # 공통 DTO, 예외 처리, 유틸리티
│       ├── config/          # 설정 클래스
│       └── domain/          # 도메인별 Controller, Service, Mapper
│
└── frontend/
    └── src/
        ├── components/      # UI 컴포넌트 (map, polygon, restaurant 등)
        ├── contexts/        # React Context (전역 상태 관리)
        ├── hooks/           # Custom Hooks (비즈니스 로직)
        ├── types/           # TypeScript 타입 정의
        └── utils/           # 유틸리티 함수
```
