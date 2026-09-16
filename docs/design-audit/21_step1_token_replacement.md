# 1단계: 디자인 토큰 값 교체 — 적용 기록

- 원본: `20260915_FANGO_design-tokens_v2.css` / `.ts`(기준 문서 "20260915_FANGO_공통디자인가이드_v39.html") — 저장 사본:
  `docs/design-audit/20_design-tokens_v2_ref.css` / `.ts`
- 대상: `src/index.css`(기존 토큰 파일, 구조·변수명 유지) + 화면별 `*.module.css`(하드코딩된 값)
- 범위: 컴포넌트 구조·화면 로직 변경 없음, 값 교체만(요청 문구 그대로)

## 반영한 값

| 항목 | 이전 | 이후 | 근거 |
|---|---|---|---|
| `--text-h1`(index.css) | 22px | **20px** | design-tokens_v2.css/.ts 명시 + 가이드 정정사항("22/20 혼재를 20으로 통일") |
| H1 실제 사용처 22개 파일 | `.title{font-size:22px}` | **20px** | 토큰만으론 반영 안 되는(어디서도 `var(--text-h1)` 참조 안 함) 구조라 화면별로 직접 교체. `CompareView`·`FeedbackView`·`HistoryView`·`HomeView`·`ItineraryEditView`·`ItineraryView`·`MyPageView`·`ScheduleTableView`·`SignupSuccessView`·`SignupView`·`TripReadyView` (11개, 기존에 이미 20px였던 마법사 화면 11개와 합쳐 전 화면 통일) |
| `--font-en`(index.css) | `'Inter', sans-serif` | **`'IBM Plex Sans KR', Roboto, sans-serif`** | Inter 삭제 요청. 변수는 구조 보존을 위해 남기고 값만 font-kr와 동일하게 맞춤 |
| `--font-kr` fallback(index.css) | `'Apple SD Gothic Neo', -apple-system` | **`Roboto`** | design-tokens_v2 fallback 값과 동일하게 |
| `'Inter'` 하드코딩(컴포넌트) | 20개 파일 · 59곳 | **`'IBM Plex Sans KR'`로 교체** | `font-family: 'Inter', sans-serif` 리터럴 전수 교체(AppHeader, EventSelectView, TripDateView 포함 최종 20개 파일 — 최초 조사 때 18개였으나 SignupSuccessView/FeedbackView의 미사용 `@import`도 추가로 발견해 포함) |
| Google Fonts `@import`의 Inter 세그먼트 | `&family=Inter:wght@...` | **삭제** | 실제 안 쓰는 폰트 네트워크 요청 제거 |
| `--input-radius`(index.css) | 12px(2026-09-14 결정) | **11px** | design-tokens_v2.css가 `--radius-md`(버튼 12px)와 별도로 `--input-radius: 11px`을 명시적으로 분리 정의 — 이번 첨부 자료로 재확정됨 |

## 반영하지 않은 것 / 확인 필요

- **`--input-radius` 토큰을 실제로 참조하는 화면은 5개뿐**(`EditProfileView`, `LoginView`, `PickerSheet`, `SignupView`, `TripDateView`) — 이 화면들만 자동으로 11px가 됩니다. 나머지 화면은 여전히 `12px`를 직접 하드코딩하고 있어 이번엔 건드리지 않았습니다(버튼 radius와 뒤섞여 있어 화면별 확인 필요 — 2단계 성격의 작업).
- **`index.html`의 `Poppins`/`Pretendard` 전역 강제(`!important`)** — 2026-09-14에 사용자가 결정했던 사항이라 처음엔 확인 없이 건드리지 않았으나, 사용자가 "첨부 파일 기준으로 그냥 진행해달라"고 확인해줘서 제거함(2026-09-15). `h1/h2/h3`·`button`·`p/span/div` 굵기 강제 규칙도 같은 결정에 묶여 있던 것이라 함께 제거 — 각 화면은 이미 자체 `.title`/`.btn-*` 등에서 디자인 토큰 기준 굵기(Bold 700/Medium 600 등)를 쓰고 있어 전역 강제가 없어도 굵기 위계가 깨지지 않음. 폰트 로드는 각 화면 `.module.css` 상단의 개별 `@import`(IBM Plex Sans KR/Urbanist)로 이미 되고 있어 `index.html`에 별도 폰트 링크를 추가하지 않음.
- 컬러 팔레트, 여백 스케일, 나머지 Radius(Small/Large), 버튼 높이(52/48/36), 아이콘·배지·내비 사이즈는 이미 일치해서 변경하지 않았습니다.
- `design-tokens_v2.css/.ts`에만 있고 이번엔 반영하지 않은 신규 토큰: 언어 선택 드롭다운 구조(다크 바텀시트→흰 드롭다운, v4), 하단 버튼 바 3종 체계(Wizard 이전·다음 타입 신규), 반응형/접근성/플랫폼 정책 토큰 — 파일 상단 주석에 "v3/v4 구조 변경"으로 명시돼 있어 "값 교체만" 범위를 벗어난다고 판단, `2단계`/`3단계` 요청 문서(프로젝트 루트에 이미 있음) 처리 시 다룰 것으로 보입니다.

## 빌드 확인

`npx vite build`(97 modules, 성공) / `npx oxlint`(에러 0건, 기존 경고만 유지) 확인 완료.
