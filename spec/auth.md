# 인증 흐름

> ✅ 구현 완��

## 인증 방식

**세션 기반** (Spring Security OAuth2 Client + HttpSession)

- 근거: `spring-boot-starter-oauth2-client`가 기본적으로 세션 기반 동작. JWT 대비 구현 복잡도가 낮고, 단일 서버 환경에서 충분함.

## Google OAuth2 전체 흐름

```
1. 사용자가 "Google 로그인" 클릭
   → 프론트엔드에서 /oauth2/authorization/google 으로 리다이렉트

2. Spring Security가 Google Authorization URL로 리다이렉트

3. 사용자가 Google 로그인 및 동의

4. Google이 Authorization Code와 함께 콜백
   → GET /login/oauth2/code/google?code=...&state=...

5. Spring Security가 Authorization Code로 Access Token 교환

6. Access Token으로 사용자 정보 조회 (Google UserInfo Endpoint)

7. CustomOAuth2UserService에서 사용자 정보를 DB에 저장/업데이트
   → users 테이블에 email, name, profileImage, providerId 저장

8. OAuth2LoginSuccessHandler에서 프론트엔드로 리다이렉트
   → http://localhost:5173 (세션 쿠키 설정됨)
```

## 접근 제어

| 경로 패턴 | 접근 권한 | 비고 |
|-----------|----------|------|
| `GET /api/auth/me` | 모두 허용 | permitAll 설정하여 리다이렉트 방지. 비인증 시 컨트롤러에서 401 반환 |
| `POST /api/restaurants/search` | 모두 허용 | 비로그인 사용자도 검색 가능 |
| `/api/**` (나머지) | 인증 필수 | 폴리곤 CRUD, 맛집 CRUD 등 |
| `/oauth2/**`, `/login/**` | 모두 ��용 | Spring Security OAuth2 기본 경로 |

## SecurityConfig 주요 설정

- CORS: `corsConfigurationSource()` 빈으로 localhost:5173 허용 (credentials 포함)
- CSRF: 비활성화 (API 서버)
- 로그아웃: `/api/auth/logout` → JSON 응답 `{success, data, message}` + UTF-8 인코딩
- 인증 실패: `authenticationEntryPoint`에서 401 JSON 응답 반환

## CustomOAuth2UserService 동작

- `DefaultOAuth2UserService` 확장
- Google 사용자 속성: `sub`(providerId), `email`, `name`, `picture`(profileImage)
- DB에 사용자 없으면 insert, 있으면 name/profileImage update
- `DefaultOAuth2User` 반환 (nameAttributeKey: `"sub"`)

## OAuth2LoginSuccessHandler 동작

- `SimpleUrlAuthenticationSuccessHandler` 확장
- 로그인 성공 시 항상 `http://localhost:5173`으로 리다이렉트

## 프론트엔드 인증 상태 관리

```
1. App 마운트 → AuthProvider에서 GET /api/auth/me 호출
2. 200 응답 → user 상태 설정 (로그인)
3. 401 응답 → user = null (비로그인)
4. 로그인 클릭 → window.location.href = '/oauth2/authorization/google'
5. OAuth 완료 후 리다이렉트 → /api/auth/me 재호출하여 상태 갱신
```

## 환경변수

| 변수 | 설명 | 설정 위치 |
|------|------|-----------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | 환경변수 또는 `.env` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 | 환경변수 또는 `.env` |

> `application.properties`에서 `${GOOGLE_CLIENT_ID}`, `${GOOGLE_CLIENT_SECRET}`으로 참조.

### Google OAuth 설정 방법

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. "OAuth 동의 화면" 설정 (외부, 테스트 사용자 추가)
3. "사용자 인증 정보" → "OAuth 2.0 클라이언트 ID" 생성
   - 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI: `http://localhost:9090/login/oauth2/code/google`
4. 생성된 Client ID, Client Secret을 환경변수로 설정
