# 프로젝트 구조 조사 (디자인 가이드 반영 전 베이스라인)

조사 대상: `ktp-frontend-react` (React 19 + Vite 8 SPA, "FAN:GO" 팬 여행 플래너)
조사 시점 기준 커밋: `e982a91` (main)
목적: 디자인 가이드를 앞으로 반영할 때 참고할 현재 구조 스냅샷. 이 문서 작성 시점에는
코드/디자인을 일절 수정하지 않았음.

---

## 1. 기존 디자인 토큰 파일 존재 여부와 경로

**별도의 `tokens.css` / `theme.js` / `design-tokens.json` 같은 전용 파일은 없음.**
디자인 토큰(색상 변수)은 전역 CSS 파일 안에 `:root` CSS 커스텀 프로퍼티로 정의되어 있음:

- `src/index.css` (1~59번째 줄) — 토큰이 정의된 유일한 위치
  - Primary 스케일: `--color-primary-50/100/200/400/500/600/700/900`
  - 시맨틱 컬러: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`
  - Ink(텍스트) 스케일: `--color-ink-900/700/600/400/200`
  - 기타: `--color-surface`, `--color-border`, `--color-screen-bg`
  - Vite 템플릿에서 남은 것으로 보이는 미사용/구식 변수도 섞여 있음: `--text`, `--text-h`, `--bg`,
    `--border`, `--code-bg`, `--accent`, `--accent-bg`, `--accent-border`, `--social-bg`, `--shadow`,
    `--sans`, `--heading`, `--mono` (다크모드 대응 `@media (prefers-color-scheme: dark)` 블록도
    이 구식 변수들만 재정의함 — Primary/Ink 스케일 등 실제 사용 중인 토큰은 다크모드 대응 없음)
  - 각 화면의 `*.module.css` 파일들은 `var(--color-*)` 형태로 이 토큰을 참조함(하드코딩 hex도
    일부 섞여 있음 — 아래 8번 참고)

- 별도 참고용 스타일 가이드 문서(런타임에 로드되지 않는 독립 HTML, 정적 프리뷰):
  - `styleguide.html` (루트) — 폰트/컬러 등을 눈으로 확인하는 정적 페이지
  - `redesign-preview.html`, `screen-audit.html` (루트) — 과거 리디자인/감사 작업 결과물로 추정,
    현재 앱 라우팅에는 연결되어 있지 않음

## 2. 전역 CSS 파일

- `src/index.css` — 전역 진입점. `main.jsx`에서 최초로 import됨. 토큰(`:root`) + 일부 전역 리셋
  (`p { margin:0 }`) + 최근 추가된 모바일 입력창 확대 방지 규칙(`@media (max-width:430px) { input, select, textarea { font-size:16px !important } }`) 포함
- `src/App.css` — Vite 템플릿에서 넘어온 카운터/히어로/next-steps 관련 스타일. **`App.jsx`
  어디서도 import하지 않음 → 사실상 미사용(죽은 CSS).**
- 각 화면 컴포넌트별 `*.module.css` (CSS Modules, 32개 파일) — 실질적인 화면별 스타일은 전부 여기 있음
- `index.html` 안에 인라인 `<style>` 블록 있음 (Google Fonts `Poppins` 로드 + `* { font-family... }`
  전역 강제 지정 — 실제 각 화면 CSS가 쓰는 `IBM Plex Sans KR`/`Urbanist`/`Inter`와 다른 폰트라
  우선순위 확인 필요)

## 3. 공통 컴포넌트 (여러 화면에서 재사용됨, `*View.jsx` 아닌 것들)

| 파일 | 역할 |
|---|---|
| `AppHeader.jsx` / `.module.css` | 모든 화면 상단 공통 헤더 (뒤로가기·로고·프로필 메뉴) |
| `BottomNav.jsx` / `.module.css` | 하단 고정 탭바 (홈·일정·채팅·마이) |
| `ChatbotFab.jsx` / `.module.css` | 화면 우하단 플로팅 챗봇 버튼 (JS로 위치 동적 계산) |
| `Icon.jsx` | 공용 SVG 아이콘 세트 (경로 데이터 인라인, 선형 단색 스타일) |
| `FenggoIcon.jsx` | 챗봇 마스코트 아이콘 |
| `PickerSheet.jsx` / `.module.css` | 네이티브 `<input type="date"/"time">`를 감싸는 다크 바텀시트 |
| `DateRangeSheet.jsx` / `.module.css` | 체크인~체크아웃처럼 기간을 달력 하나에서 고르는 바텀시트 |
| `LocationSearchModal.jsx` / `.module.css` | 지도 기반 장소 검색 공용 모달 |
| `PlaceDetailModal.jsx` / `.module.css` | 장소 상세 정보 팝업 |
| `AgreementModal.jsx` | 약관 동의 팝업 (자체 CSS 파일 없음, 인라인/공유 스타일 추정 — 확인 필요) |
| `RequireEvent.jsx` | 라우트 가드(선택된 이벤트 없으면 리다이렉트) — UI 없음 |
| `ScreenIndex.jsx` | 개발용 전체 화면 목록 라우트(`/screens`) — 실제 서비스 화면 아님 |

컨텍스트(Provider, UI 아님이지만 전역 상태 소스):
- `TripContext.jsx` — 여행 계획 데이터 (localStorage 영속)
- `ThemeContext.jsx` — 다크모드 토글 (`body.dark-mode` 클래스 토글 방식)
- `LanguageContext.jsx` — 다국어 문자열 (`translations.js`)

## 4. 화면 컴포넌트 (`*View.jsx`, 총 22개 라우트 컴포넌트)

`src/App.jsx`에 등록된 라우트 기준:

| 경로 | 컴포넌트 |
|---|---|
| `/` | `SplashView` |
| `/home` | `HomeView` |
| `/login` | `LoginView` |
| `/signup` | `SignupView` |
| `/signup/artists` | `ArtistSelectView` |
| `/signup/success` | `SignupSuccessView` |
| `/trip/events` | `EventSelectView` (4-1) |
| `/trip/date` | `TripDateView` (4-2, `RequireEvent` 가드) |
| `/trip/activities` | `ActivityPreferenceView` (4-3) |
| `/trip/pace` | `PaceView` (4-4) |
| `/trip/confirm` | `ConfirmView` (4-5) |
| `/trip/generating` | `TripGeneratingView` (`RequireEvent` 가드) |
| `/trip/ready` | `TripReadyView` (`RequireEvent` 가드) |
| `/trip/itinerary` | `ItineraryView` |
| `/trip/schedule` | `ScheduleTableView` |
| `/trip/itinerary/edit` | `ItineraryEditView` |
| `/trip/feedback` | `FeedbackView` |
| `/trip/history` | `HistoryView` |
| `/account` | `MyPageView` |
| `/account/edit` | `EditProfileView` |
| `/screens` | `ScreenIndex` (개발용) |
| `/chat` | `ChatbotView` |

**주의 — 라우트에 연결되지 않은 고아 파일 발견:**
- `src/StaySearchView.jsx` / `.module.css` — `App.jsx`에 더 이상 라우트가 없어 실제로 도달 불가능한
  화면(예전엔 `/trip/stay-search`였으나 삭제됨, 기능은 `TripDateView.jsx` 내부 모달로 흡수됨).
  파일만 남아있는 상태 — 삭제 여부 결정 필요.
- `src/CompareView.module.css`, `src/PlaceDetailView.module.css` — 대응하는 `.jsx` 컴포넌트 자체가
  없음(`CompareView.jsx`, `PlaceDetailView.jsx` 없음). CSS만 남은 죽은 파일로 추정.

## 5. theme / styles / variables 관련 파일

- `src/ThemeContext.jsx` — 유일한 "테마" 관련 코드. 다크모드 on/off만 관리하며, 실제 다크모드
  전용 색상 재정의는 `index.css`의 구식 변수(`--text`, `--bg` 등)에만 있고 화면 스타일이 쓰는
  Primary/Ink 토큰에는 다크모드 대응이 없음 (반영 시 확인 필요)
- 별도의 `variables.css`, `tokens.js`, styled-components 테마 객체 등은 없음
- 폰트는 각 `.module.css` 파일 상단에서 개별적으로 `@import url('https://fonts.googleapis.com/...')`
  하는 방식 (Google Fonts, 파일마다 반복 — 공통 폰트 로딩 지점 없음)

## 6. 이미지와 SVG 폴더

- `src/assets/` — 컴포넌트에서 `import`해서 쓰는 이미지
  - `fango-logo-mark.png` (헤더용 마크, `AppHeader.jsx`에서 사용)
  - `fango-logo.png` (풀 로고)
  - `hero.png`, `react.svg`, `vite.svg` (Vite 템플릿 기본 자산으로 추정 — 실사용 확인 필요)
- `public/` — 정적 서빙 파일(빌드 시 그대로 복사)
  - `favicon.svg`
  - `icons.svg` (스프라이트 추정 — 실제로는 `Icon.jsx`가 인라인 path 데이터 방식이라 이 파일이
    쓰이는지 확인 필요)
- 아이콘 자체는 대부분 `Icon.jsx` 안에 SVG path 문자열로 인라인되어 있고(선형 단색, 24×24,
  1.5px 굵기 통일), 별도 `.svg` 아이콘 폴더 체계는 없음

## 7. package.json에 표시된 기술 스택

```json
{
  "name": "ktp-frondend-react",
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.3"
  },
  "devDependencies": {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "oxlint": "^1.79.0",
    "vite": "^8.2.2"
  }
}
```

- 빌드 도구: **Vite 8** (`vite build`), React 플러그인은 `@vitejs/plugin-react`(Babel 기반, SWC 아님)
- UI 프레임워크: **React 19**, 라우팅은 **react-router-dom v7**
- 스타일링: 별도 CSS 프레임워크(Tailwind, styled-components 등) 없음 — **순수 CSS Modules**
- 상태관리: 별도 라이브러리 없음 — React Context(`TripContext`/`ThemeContext`/`LanguageContext`) +
  `localStorage` 영속
- 린트: `oxlint` (`.oxlintrc.json` 설정 존재), 타입 체크용 `@types/*`만 있고 **TypeScript 자체는
  미사용**(전부 `.jsx`)
- 외부 스크립트: `index.html`에 카카오맵 SDK(`dapi.kakao.com`) 스크립트 태그, Google Fonts
- `vite.config.js`에 `/api` → `http://192.168.0.203:8000` 프록시 설정(백엔드 로컬 개발 서버)

## 8. 디자인 가이드 반영 시 확인해야 할 예상 파일

**우선순위 1 — 전역 영향(한 곳을 고치면 전체 화면에 영향)**
- `src/index.css` — 토큰 정의 자체. 컬러 팔레트/타이포 스케일을 가이드 기준으로 바꾼다면 여기부터.
  단, 다크모드 재정의 블록이 실제 사용 토큰과 분리되어 있어 함께 정리 필요.
- `index.html` — 전역 `<style>` 블록(폰트 강제 지정)이 각 화면 CSS의 폰트 지정과 충돌 가능성 있음
- `src/AppHeader.module.css`, `src/BottomNav.module.css` — 모든 화면에 공통으로 들어가는
  헤더/하단바라, 가이드의 "일관성" 원칙 적용 시 여기 하나만 고치면 전체 화면에 반영됨
- `src/Icon.jsx` — 아이콘 전체 세트가 한 파일에 있어, 아이콘 스타일 가이드 반영 시 여기가 유일한 지점

**우선순위 2 — 반복 패턴이 화면마다 개별 CSS로 흩어져 있어 "일관성" 점검이 필요한 지점**
- 32개 `*.module.css` 각각에 `.screen`/`.card`/`.header`/`.footer`/`.btn-primary` 등 유사한
  클래스가 화면마다 따로 정의되어 있음(공용 버튼/카드 컴포넌트가 아니라 각 파일에 복붙된 구조).
  버튼 색상·라운드·그림자 같은 디자인 값이 화면마다 미세하게 다를 수 있어 전수 대조 필요.
- 각 화면 CSS 상단의 개별 `@import url(fonts.googleapis.com/...)` — 폰트가 파일마다 따로
  선언되어 있어, 가이드에서 폰트를 바꾼다면 32개 파일을 전부 찾아 고쳐야 함(공통 지점 없음)
- `PickerSheet.jsx`/`DateRangeSheet.jsx`의 다크 바텀시트 색(`#2B2A3A` 하드코딩) — `index.css`
  토큰을 안 쓰고 직접 hex를 쓰고 있어 토큰화 대상 후보

**우선순위 3 — 정리(가이드 반영 전 또는 반영과 별개로 정돈하면 좋은 것)**
- `src/App.css` — 미사용 확인됨, 삭제 후보
- `src/StaySearchView.jsx`/`.module.css` — 라우트 없는 고아 파일, 삭제 후보
- `src/CompareView.module.css`, `src/PlaceDetailView.module.css` — 대응 컴포넌트 없는 고아 CSS
- `public/icons.svg` — 실제 사용 여부 확인 필요 (Icon.jsx가 인라인 방식이라 중복/미사용 가능성)
- `redesign-preview.html`, `screen-audit.html`, `styleguide.html` — 앱 라우팅과 무관한 독립
  정적 문서. 최신 디자인 가이드 반영 결과와 내용이 어긋나 있을 수 있어 신뢰 기준으로 쓰기 전 확인 필요
