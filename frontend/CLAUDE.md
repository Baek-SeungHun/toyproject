# 프로젝트 스펙
Backend: Spring boot 4
DB: PostgreSQL + postGIS
Java Persistence: Mybatis
GeoServer
frontend: Vite + React + typescript
CSS: tailwind

# 프로젝트 목표
- MVP: 폴리곤 영역 그리기/저장하기/불러오기 + 맛집 데이터 저장하기/불러오기 + 폴리곤 영역에서 맛집 찾아주기
- 포인트: 폴리곤, 맛집 지역 데이터 등 GIS 데이터 사용 및 학습 목적의 프로젝트
- PostGIS, GeoServer 등을 통해 폴리곤 영역 벡터 타입(GeoJson, shp 등)의 GIS 데이터 다뤄보기
- ST 내장 펑션 등 사용해보기 

## 변경사항
1. 변경사항 "저장" 요청 시 대화 및 대화로 인한 코드 변경사항을 요약 저장. 저장 시 해당 폴더 바로 아래의 history 폴더에 저장. 폴더가 존재하지 않을 시, 생성하고 저장
   네이밍 룰: (주요 변경점 요약)_(오늘 날짜).md

## 프로젝트 개발 시 유의점
1. SOLID 원칙을 지킨다.
2. 항상 확장을 염두에 둔다.
3. 객체 지향 원칙을 지킨다.