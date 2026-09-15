# 3단계 부분 구현 보고 — 운영 규칙 결정 사항 6건 반영

- `13_step2_implementation.md` 6번 섹션에서 "지금 결정해야 하는 사항"으로 제시한 6건에 대해 사용자가 각각 결정한 내용을 반영함
- 결정: 1) 동선보기 버튼만 살리고 나머지는 추천대로 2) 타이틀 22→20px 반영 3) input-radius 12px 4) 헤더-타이틀 간격 24px 반영 5) Wizard/Action 재분류 보류 6) BottomNav 값 반영
- **2번(타이틀 크기)은 작업 중 새로운 사실이 발견되어 반영하지 않고 보류함** — 아래 1번 항목 참고
- 라우팅·API·인증·데이터 로직 변경 없음, 파일 삭제 없음

---

## 1-추가. 반영 — 화면 타이틀 22px→20px (2026-09-14 최종 결정)

가이드 원본(`02_v1_pages_11_25.md` V1-P14-009, `05_v2_part_1.md` V2-004/V2-025, `09_v1_v2_master.md` M-T-002)을 다시 확인한 결과:
- V1-P14-009(v1 H1 22px)는 **앱 전체에 적용되는 일반 H1 표준**으로 제시된 예시
- V2-025(20px)는 v2가 **`SignupView` 한 화면을 새로 디자인하며 제시한 값**이지 "전체 20px로" 라는 명시적 지시가 아님
- M-T-002 자체가 "이 화면만 20px로 할지, 전체 스케일을 낮출지 결정 필요"로 남아있던 사안 — 가이드만으로는 답이 정해지지 않음

코드 확인 결과 이미 `ActivityPreferenceView`/`PaceView`/`ArtistSelectView`(여행 만들기 단계별 "마법사" 화면, 헤더에 `.step-label` 진행 단계 표시가 있음) 3개가 20px를 쓰고 있었고, 같은 마법사 흐름인 `ConfirmView`/`StaySearchView`/`TripDateView`(마찬가지로 `.step-label` 있음)만 22px로 남아있어 **마법사 화면끼리도 이미 일관성이 깨진 상태**였습니다.

**결정**: "여행 만들기 단계별(마법사, `.step-label` 있는) 화면은 20px로 통일, 그 외 일반 화면(목록·상세·완료 화면)은 22px 유지"로 반영했습니다. 새 규칙을 만드는 대신, 이미 코드에 나 있던 기준을 완성하는 쪽을 택했습니다.

| 파일 | 이전 | 이후 |
|---|---|---|
| `ConfirmView.module.css` `.title` | 22px | **20px** |
| `StaySearchView.module.css` `.title` | 22px | **20px** |
| `TripDateView.module.css` `.title` | 22px | **20px** |

`SignupView`("가입하기")는 `.step-label`/단계 표시 구조가 없는 단일 폼 화면이라 마법사 기준에 해당하지 않는다고 판단해 22px로 유지했습니다(v2가 제시한 20px는 이 화면 전용 디자인 제안으로 보고 채택하지 않음).

빌드/lint 재확인: `npx vite build` 성공(96 modules), `npx oxlint` 경고 60건(기존과 동일), 에러 0건.

---

## 1. (경과 기록) 최초 보류 — 화면 타이틀 22px→20px (사용자 확인 필요)

작업 전 "반영"으로 결정됐지만, 실제 코드를 열어보니 **이미 이 결정이 부분적으로 내려져 있는 상태**를 발견해서 그대로 진행하지 않고 보류했습니다.

- `ActivityPreferenceView.module.css`에 다음 주석과 함께 이미 20px가 적용돼 있음:
  ```css
  /* 화면 타이틀은 20px Bold (일반 H1 22px과 별도 기준) */
  .title { font-size: 20px; ... }
  ```
- `PaceView.module.css`, `ArtistSelectView.module.css`도 이미 20px(마법사형 단계 화면들)
- 반면 `CompareView`/`ConfirmView`/`EventSelectView`/`HistoryView`/`ItineraryView`/`ItineraryEditView`/`PlaceDetailView`/`ScheduleTableView`/`SignupSuccessView`/`SignupView`/`StaySearchView`/`TripDateView`/`FeedbackView`/`HomeView`/`MyPageView`(15개, "일반 화면") 은 22px

`09_v1_v2_master.md` M-T-002를 다시 확인해보니, 원래 쟁점이 정확히 이거였습니다:
> "다른 모든 화면이 22px를 쓰고 있어, **이 화면만(=마법사형 단계 화면) 20px로 낮출지 전체 H1 스케일을 20px로 낮출지** 확정 필요"

즉 이전 작업에서 이미 "마법사형 단계 화면만 20px, 나머지 일반 화면은 22px 유지"로 이 쟁점을 해소해서 코드에 반영해둔 것으로 보입니다. 제가 "2. 반영"을 "전체 화면을 20px로 통일"로 해석해서 그대로 진행했다면, 이미 의도적으로 나뉘어 있는 2단계 타이포그래피 체계를 깨뜨릴 뻔했습니다.

**확인이 필요한 것**: 요약본(#10)이 말하는 "20px"가 —
- (A) 이미 코드에 있는 "마법사형 단계 화면=20px" 구분을 재확인/유지하라는 뜻인지 (→ **코드 변경 불필요**, 이미 반영됨)
- (B) 정말로 일반 화면 15개까지 포함해서 앱 전체 타이틀을 20px로 통일하라는 뜻인지 (→ 15개 파일 `.title` font-size 22→20px 변경 필요)

둘 중 어느 쪽인지 알려주시면 바로 반영하겠습니다. **이번엔 코드를 건드리지 않았습니다.**

---

## 2. 반영 — 헤더→타이틀 간격 24px 통일

화면 상단 헤더(뒤로가기 버튼 줄 + 타이틀을 감싸는 컨테이너)의 **위쪽 패딩만** 24px로 통일했습니다. 나머지 패딩(좌우/아래)과 `border-bottom`/`gap`/`display` 등 구조는 그대로 뒀습니다 — 시각적으로는 "헤더 상단 여백이 조금 넓어짐" 정도의 변화입니다.

| 파일 | 이전 상단 패딩 | 이후 |
|---|---|---|
| `ActivityPreferenceView.module.css` `.header` | 14px | 24px |
| `ArtistSelectView.module.css` `.header` | 14px(상하동일) | 24px(하단 14px로 분리) |
| `ConfirmView.module.css` `.header` | 14px | 24px |
| `CompareView.module.css` `.header` | 14px | 24px |
| `HistoryView.module.css` `.header` | 14px | 24px |
| `EditProfileView.module.css` `.header` | 14px(상하동일) | 24px(하단 14px로 분리) |
| `EventSelectView.module.css` `.header` | 14px | 24px |
| `ItineraryEditView.module.css` `.header` | 12px | 24px |
| `ItineraryView.module.css` `.header` | 12px | 24px |
| `PaceView.module.css` `.header` | 14px | 24px |
| `ScheduleTableView.module.css` `.header` | 14px | 24px |
| `SignupSuccessView.module.css` `.header` | 16px | 24px |
| `StaySearchView.module.css` `.header` | 14px | 24px |
| `TripDateView.module.css` `.header` | 14px | 24px |
| `FeedbackView.module.css` `.titleBlock`(구조상 `.header`와 동일 역할) | 14px | 24px |
| `HomeView.module.css` `.body`(타이틀을 직접 감싸는 컨테이너라 여기가 사실상 헤더-타이틀 간격) | 20px | 24px |
| `SignupView.module.css` `.body`(위와 동일한 이유) | 16px | 24px |
| `MyPageView.module.css` `.title`(자체 `padding-top`으로 간격을 주는 구조) | 20px | 24px |

**적용하지 않은 파일**:
- `PlaceDetailView.module.css` — `.title-row { padding: 5px 16px 0 }`로 다른 16개 파일과 패턴이 달라(위에 이미지/캐러셀이 있는 구조로 추정), 24px를 그대로 적용하면 오히려 어색해질 수 있어 **확인 없이 임의로 바꾸지 않았습니다.**
- `ChatbotView.module.css`, `AgreementModal.module.css` — 둘 다 `.header`가 있지만 "화면 상단 타이틀" 패턴이 아니라 각각 채팅 툴바(아바타+이름), 모달 다이얼로그 헤더(가운데 정렬 타이틀+닫기 버튼)라 이번 규칙(스크린 타이틀 헤더) 대상이 아니라고 판단해 제외했습니다.

---

## 3. 반영 — `--input-radius` 12px로 확정

`src/index.css`의 `--input-radius`를 첨부 토큰 값 11px에서 **12px로 수정**했습니다. v1 PDF·v2 HTML·기존 코드(74곳)가 전부 12px로 일치하고, 1px 차이는 육안 구분이 어려워 74곳을 11px로 바꾸는 대신 토큰 쪽을 12px로 맞췄습니다.

이 토큰은 아직 어떤 화면의 실제 입력 필드에도 연결돼 있지 않습니다(1·2단계 모두 값 정의만 했음). 74곳의 입력 필드가 이미 하드코딩으로 12px를 쓰고 있어 시각적 변화는 없습니다. 실제 입력 필드 CSS를 이 토큰에 연결하는 작업은 여전히 개별 화면 수정 범위라 이번엔 하지 않았습니다.

---

## 4. 반영 — `BottomNav` padding-y 13px, 아이콘 stroke 1.6px

- `src/BottomNav.module.css`: `.bottom-tab { padding: 12px 0 }` → `padding: var(--nav-padding-y) 0`(13px)
- `src/BottomNav.jsx`: `<Icon name={tab.iconName} size={22} .../>` → `strokeWidth={1.6}` 명시적으로 추가(기존엔 `Icon.jsx` 기본값 1.5px를 그대로 썼음)
- `src/index.css`: `--nav-padding-y`/`--nav-icon-stroke-width` 토�큰 옆의 "⚠ 불일치" 경고 주석을 "반영 확정" 설명으로 교체

다른 화면 아이콘(기본 1.5px)과 `BottomNav`만 1.6px로 미세하게 달라지는 의도된 차이입니다.

---

## 5. 변경 없음 — 하단 CTA 3개(동선보기 유지), Wizard/Action 재분류

- `ScheduleTableView.jsx`/`ItineraryView.jsx`의 "동선보기" 버튼은 그대로 뒀습니다(수정 없음) — grep으로 재확인한 결과 두 파일 모두 문구가 남아있음을 확인했습니다.
- 하단 버튼 바 Wizard/Action 재분류는 보류 결정대로 진행하지 않았습니다.

---

## 6. 빌드 및 lint 결과

```
$ npx vite build
✓ 96 modules transformed.
✓ built in 380ms
```
빌드 성공, 모듈 수(96개) 동일, 에러 없음.

```
$ npx oxlint
경고 60건(1·2단계와 동일), 에러 0건
```
lint 통과. 경고 목록도 이전 단계와 완전히 같습니다(이번에 수정한 CSS/헤더-패딩/BottomNav 변경과 무관한 기존 경고).

---

## 7. 반영 — 낮은 위험 항목 2건 추가 진행 (2026-09-14)

`13_step2_implementation.md` 6번에서 "비교적 낮은 위험이라 3단계에서 바로 반영 가능"으로 분류했던 2건을 이어서 진행했습니다.

### 7-1. "다시 시도" 버튼 Outline 전환

`src/TripGeneratingView.module.css`의 `.btn-white`(다시 시도, 채움 스타일)와 `.btn-outline`(이전 화면으로) 둘 다 `var(--button-border-outline)`(1.5px solid Primary-100 — 1단계에서 정의한 토큰)을 쓰는 흰 배경 아웃라인 버튼으로 통일했습니다. Primary-100/200 hex가 1단계에서 이미 확정(`#E4DEFF`)돼 있어서, 그동안 "운영 규칙 - 토큰 확정 필요"로 막혀있던 항목이 자연스럽게 풀렸습니다.

| 파일 | 버튼 | 이전 | 이후 |
|---|---|---|---|
| `TripGeneratingView.module.css` `.btn-white`("다시 시도") | 배경 `var(--color-primary-500)`(보라 채움), 테두리 없음 | 배경 `#fff`, 테두리 `var(--button-border-outline)`(1.5px Primary-100) |
| `TripGeneratingView.module.css` `.btn-outline`("이전 화면으로") | 배경 `#fff`, 테두리 `1px solid var(--color-primary-200)` | 배경 `#fff`, 테두리 `var(--button-border-outline)`(1.5px Primary-100) |

두 버튼이 이제 시각적으로 동일한 스타일입니다(11_impact_plan.md가 "다시 시도만 Outline으로"라고만 명시하고 "이전 화면으로"에 대한 언급은 없었지만, 결과적으로 두 버튼 다 아웃라인이라 겹치게 됨 — 순서상 "다시 시도"가 먼저 나와 우선순위는 유지됩니다).

### 7-2. 안내문 박스 배경 제거

| 파일 | 이전 배경 | 이후 |
|---|---|---|
| `TripDateView.module.css` `.infoBanner` | `#EAF2FE`(파란 박스) | `#fff` |
| `EditProfileView.module.css` `.infoBannerMuted` | `#F7F7FA`(회색 박스) | `#fff` |

텍스트 색(`--color-info`, `--color-ink-600`)은 그대로 둬서 배경 없이도 안내문임을 구분할 수 있게 했습니다.

### 빌드/lint

`npx vite build` 성공(96 modules), `npx oxlint` 경고 60건(동일), 에러 0건.

---

## 8. 반영 — 부분 영역 에러 패턴 신규 구현 (재사용 컴포넌트만)

`src/PartialErrorBox.jsx` + `.module.css`를 새로 만들었습니다(V1-P37-005/006, V1-P38-001~004 규정: 회색 박스 `#F7F7FA`, Primary·Danger 색 사용 금지, "다시 시도" 버튼 1개만 Small/Outline).

- `src/index.css`에 `--color-partial-error-bg: #F7F7FA` 토큰 추가
- **어느 화면에도 아직 연결하지 않았습니다.** 11_impact_plan.md가 이미 "어느 화면에 적용할지부터 결정 필요"로 남겨뒀던 이유는, 실제로 "화면은 정상인데 구역 하나만 실패하는" 지점(예: 이동 시간 조회)이 지금 코드에 없어서입니다 — 있는 걸 찾아 고치는 게 아니라 없는 실패 케이스를 새로 만들어야 하는 상황이라, 임의로 화면을 골라 가짜 실패 상태를 끼워넣는 대신 **재사용 가능한 틀만 먼저 준비**했습니다. 실제 연결은 그런 부분 실패 지점이 실제로 생기거나(예: 카카오맵 API 연동), 어느 화면에 넣을지 알려주시면 그때 `<PartialErrorBox message="..." onRetry={...} />` 형태로 끼워넣으면 됩니다.
- 라우팅·API·데이터 로직은 건드리지 않았습니다(신규 파일 2개 추가만, 기존 파일엔 토큰 1줄만 추가).

## 9. 반영 — `SignupSuccessView` 구조 변경 + `BottomNav` 추가

| 변경 | 이전 | 이후 |
|---|---|---|
| 상단 텍스트 | `check-badge`(원형 체크 아이콘) + `success-title`(22px) + `success-subtitle`(2줄) 3단 구성 | `check-badge` + **헤드카피 1줄**("가입이 완료됐어요. FAN:GO와 함께 최고의 팬 여정을 시작해 보세요.") |
| 안내 목록 | `feature-card` 2개(연보라 배경 카드, 채움 사각 아이콘) | **불릿 리스트 2개**(배경·테두리 없이 라인아이콘 + 텍스트 한 줄) |
| 하단 | `footer`(CTA 버튼)만 있고 `BottomNav` 없음 | `footer`(CTA 버튼, `data-bottom-bar="true"` 유지) 아래에 `<BottomNav />` 추가 |

`ChatbotFab.jsx`가 `[data-bottom-bar="true"]` 전부를 관찰해서 그 중 가장 위에 있는 바 위로 챗봇 버튼을 띄우는 방식이라, `footer`의 `data-bottom-bar="true"`를 지우지 않고 그대로 뒀습니다(지웠다면 챗봇 FAB가 "홈으로 가기" 버튼과 겹쳤을 것). `BottomNav`는 이미 자체적으로 이 속성을 갖고 있어 별도 처리가 필요 없습니다.

빌드/lint 확인: `npx vite build` 성공(96 modules), `npx oxlint` 경고 60건(동일), 에러 0건.

## 10. 반영 — `ChatbotView` 대화 히스토리 더보기

`/chat/sessions` API가 전체 목록을 한 번에 반환하고 있었고, 화면은 이를 전부 렌더링하고 있어 히스토리가 많이 쌓이면 무한정 길어지는 상태였습니다. `EventSelectView`/`HistoryView`와 동일한 방식(`PAGE_SIZE=8`, "더보기" 버튼으로 8개씩 추가 노출)을 적용했습니다.

- `src/ChatbotView.jsx`: `historyVisibleCount` 상태 추가(초기 8개), 목록을 `sessions.slice(0, historyVisibleCount)`로 자르고, 남은 항목이 있으면 "더보기" 버튼 표시
- `src/ChatbotView.module.css`: `.historyLoadMoreBtn` 스타일 추가(`EventSelectView`의 `.load-more-btn`과 동일한 룩)
- API 호출 자체나 백엔드 요청 파라미터는 변경하지 않았습니다(클라이언트에서 잘라서 보여주는 방식 — 기존 두 화면과 동일한 패턴).

## 11. 확인 완료 — 검증 메시지 노출 시점 (코드 변경 없음)

실제 입력 검증 로직이 있는 화면 3곳(`LoginView`, `SignupView`, `TripDateView` — `StaySearchView`는 라우팅에 연결되지 않은 죽은 파일이라 제외)을 전수 확인했습니다.

| 화면 | 노출 시점 | "!" 아이콘 | 제출 시 재검증 |
|---|---|---|---|
| `LoginView.jsx` | `onBlur` | 없음(텍스트만) | 있음(`handleSubmit`에서 재검증 후 막음) |
| `SignupView.jsx` | `onBlur`(모든 필드 동일 패턴) | 없음(`.field-hint-warning` 텍스트만) | 있음 |
| `TripDateView.jsx` | `onConfirm`(달력/시간 피커를 닫는 시점 — 일반 입력의 blur에 대응하는 시점) | 없음 | 있음 |

세 화면 모두 이미 가이드 기준(blur 시점 노출, "!" 아이콘 없음, 제출 시 재검증)과 일치해서 **코드 변경 없이 확인만 완료**했습니다.

---

## 12. 반영 — 언어 필("KR ⌄") 추가 (드롭다운은 그대로 유지, 2026-09-14)

`AppHeader`에 언어 필을 추가했습니다. `≡` 메뉴 아이콘과 그 드롭다운은 요청대로 손대지 않았습니다.

- `src/LanguageContext.jsx`: `LANGUAGE_LABELS` 맵 추가(언어 코드별 필 표기 2자 + 선택 목록용 자체 언어명). 기존 `SUPPORTED_LANGUAGES`(ko/en/ja/zh-CN/zh-TW/th/id)를 그대로 사용
- `src/AppHeader.jsx`: `useLanguage()`(이미 앱 전역에 있던 `LanguageContext`)로 언어 필 구현. 로고 오른쪽에 "언어 필 + 메뉴 아이콘"을 나란히 배치하는 `.right-area` 컨테이너를 새로 만들고, 그 안에 언어 필을 `showProfile` 값과 무관하게 항상 렌더링(요약#15 "로그인 여부와 무관하게 헤더 우측 KR 필 위치 항상 고정")
- 클릭하면 프로필 메뉴와 같은 방식(흰 드롭다운, 바깥 클릭/Esc로 닫힘)으로 7개 언어 목록이 뜨고, 고르면 `setLanguage(code)`로 즉시 전환 — 새 다크시트 컴포넌트는 만들지 않고 기존 드롭다운 패턴을 재사용했습니다(더 가볍고, 이미 검증된 상호작용이라 위험이 적음)
- `src/AppHeader.module.css`: `.right-area`/`.lang-area`/`.lang-pill`/`.lang-menu`/`.lang-item*` 추가. 필 크기·라운드는 1단계에서 정의한 `--lang-pill-*` 토큰을 그대로 사용

**⚠️ 확인 필요한 부작용**: `LoginView.jsx`는 이미 자체적으로 지구본 아이콘 + `<select>` 언어 선택기를 갖고 있습니다(백엔드 `/langs` API 기반, `ko`/`en`/`ja` 3개만 지원). `AppHeader`는 로그인 화면에도 항상 렌더링되므로, 지금은 **로그인 화면에 언어 선택기가 2개(지구본+새 필) 나란히** 뜹니다. 요약본(#9)은 "지구본 아이콘 금지"를 명시하고 있어 원래는 지구본 쪽을 없애야 하지만, 이건 `/langs` API 호출과 `langNo`/`LANG_NO_TO_CODE` 상태를 걷어내는 작업이라 "라우팅·API·데이터 처리 로직 변경 금지" 지침에 걸릴 수 있어 **이번엔 건드리지 않고 그대로 뒀습니다.** 지구본 쪽을 없앨지, 두 선택기를 어떻게 합칠지 알려주시면 이어서 반영하겠습니다.

### 빌드/lint

`npx vite build` 성공(96 modules), `npx oxlint` 경고 61건(+1 — `LanguageContext.jsx`가 컴포넌트 외에 상수도 export해서 발생하는 기존 패턴의 `react(only-export-components)` 경고가 `LANGUAGE_LABELS` 추가로 하나 더 늘어난 것, 에러 아님), 에러 0건.

---

## 13. 반영 — 언어 필 API 연동 + 지구본 선택기 제거

- `src/LanguageContext.jsx`: `LanguageProvider`가 앱 최상단에서 `/langs`를 한 번만 불러와 `apiLanguages`로 노출(백엔드가 실제로 지원하는 언어 목록), `LANG_NO_TO_CODE` 매핑도 여기로 이동
- `src/AppHeader.jsx`: 언어 필 드롭다운 목록을 `apiLanguages`(있으면) 우선 사용, 없으면 `SUPPORTED_LANGUAGES` 7개로 대체
- `src/LoginView.jsx`: 지구본 아이콘 + `/langs` 직접 호출 + 자체 `<select>` 오버레이 전부 제거(중복이라 정리) — 화면 첫 진입 시 무조건 첫 언어로 강제 전환하던 부작용도 같이 없어짐(전역 헤더로 옮기면서 화면마다 사용자가 고른 언어가 리셋되는 문제가 생길 수 있어 그 로직은 가져오지 않음)

## 14. 헤더 레이아웃 버그 수정(테스트 도구 오탐 포함)

언어 필 추가 후 430px 폭에서 스크린샷 테스트를 여러 차례 돌렸는데 메뉴(≡) 아이콘이 화면 밖으로 잘려 보이는 문제가 있었습니다. 원인을 추적한 결과 **두 가지**가 겹쳐 있었습니다.

1. **실제 CSS 버그(수정함)**: 로고 이미지가 flex 항목으로 들어가 있어서 로고의 실제 렌더 폭이 좌/우 요소의 공간 계산에 영향을 주고 있었음 → 로고를 `position:absolute`로 가운데 고정해 flex 흐름에서 완전히 뺐습니다(`AppHeader.module.css` `.top-bar-logo-img`).
2. **테스트 도구 자체의 오차(실제 버그 아님)**: 헤드리스 브라우저에 430px 폭을 요청해도 실제로는 492px로 렌더링되는 걸 뒤늦게 발견했습니다(`window.innerWidth` 직접 측정으로 확인). 즉 제가 보던 "잘림"의 상당 부분은 실제 좁은 화면에서 벌어지는 일이 아니라 테스트 스크린샷 캡처 크기와 실제 렌더 폭이 어긋나서 생긴 착시였습니다. 이 사실을 확인하기 전까지 헤더 여백·언어 필 크기를 여러 차례 과도하게 줄였다가, 문제를 찾은 뒤 다시 원래 여백(16px 패딩, 6px 갭, `--lang-pill-*` 토큰 값)으로 되돌렸습니다.

최종적으로 `.top-bar-logo-img` 변경 1건만 실질적인 수정 사항이고, 나머지는 시행착오 끝에 원래 값으로 복귀했습니다. 빌드/lint 정상 확인, 넓은 창 스크린샷으로 언어 필+메뉴 아이콘이 정상적으로 나란히 표시되는 것도 확인했습니다.

## 15. 폰트 원복 — Poppins/Pretendard

1단계에서 제거했던 전역 폰트 강제(`index.html`의 `* { font-family: 'Poppins', 'Pretendard', sans-serif !important }`)를 사용자 요청으로 다시 복구했습니다. 디자인 가이드가 확정한 폰트(IBM Plex Sans KR 등)보다 기존에 쓰던 Poppins/Pretendard 조합이 실제 서비스 톤에 더 맞는다는 판단입니다. `index.html`의 Poppins Google Fonts·Pretendard CDN 링크, `h1/h2/h3`·`button`·`p/span/div` 굵기 규칙도 함께 복원했습니다.

---

## 남은 항목 (모두 사람 결정이 필요해 보류 중)

| 항목 | 상태 |
|---|---|
| `AppHeader` 드롭다운 폐지 | 보류(사용자가 명시적으로 유지 요청) |
| `LoginView`의 지구본 언어 선택기 정리 | 보류 — API/상태 로직에 걸려 확인 필요 |
| Wizard/Action 하단 버튼 재분류 | 보류(6가지 결정 중 5번) |
| `PartialErrorBox`를 실제 화면에 연결 | 대상 화면/실패 지점 결정 필요 |
