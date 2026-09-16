# v2 PDF(v14, 공식 최종판) 기준 전수 감사

**기준 정정**: 이 저장소의 `05_v2_part_1~4.md`, `09_v1_v2_master.md`가 "v2"로 분석했던 자료는 실제로는 `signup_view_concept_v2.html`(회원가입 화면 1개짜리 HTML 스니펫)이었다(`09_v1_v2_master.md` 0번 섹션에 직접 기록됨). 사용자가 이번에 제공한 `260913_FANGO_공통_디자인_가이드_v2.pdf`(59페이지, 내부 버전 표기 v14, "공식 최종판", 2026.09.13)가 **진짜이자 유일한 최신 기준**이다. 이 문서는 그 PDF를 기준으로 코드베이스를 재검증한 결과이며, 코드는 전혀 수정하지 않았다(감사 전용). `11_impact_plan.md`/`14_step3_partial_implementation.md`가 잘못된 근거로 이미 반영한 항목들도 PDF와 다시 대조했다.

조사 방법: `src/index.css` 토큰 전체, `AppHeader.jsx`/`.module.css` 전체, 그리고 `*.module.css`/`*.jsx` 전체에 대한 grep(타이틀 폰트크기, 버튼 라벨, 고정 배지, PartialErrorBox 사용처, 우선순위 카드 등)으로 후보를 찾은 뒤 실제 파일을 열어 확인. 지면 제약상 전 파일을 한 줄씩 읽지는 못했고, 구조적으로 중요한 파일(AppHeader, index.css, MyPageView, SignupSuccessView, EventSelectView, ScheduleTableView)은 직접 읽었으며 나머지는 grep 결과를 근거로 판단했다 — 표의 "근거"란에 각각 명시.

---

## Foundations

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| Primary 8단계 | 50/100/200/400/500/600/700/900 | `src/index.css:10-17` — 8단계 모두 존재. 단 100=`#E4DEFF`(PDF는 팔레트 표에 100 hex 명시 안 함, 디자인 이미지 색상표만 제공) | ✅ (구조 일치, 정확한 hex는 PDF가 스와치 이미지라 텍스트 대조 불가) | |
| Success/Warning/Danger/Info | `#2E9E5B`/`#E5A02E`/`#E5484D`/`#2E7CE9` | `src/index.css:19-23` 정확히 동일 | ✅ | |
| Ink 900/600/400/200 | `#17161F`/`#5C5D6E`/`#93949F`/`#E2E2E9` | `src/index.css:25-29` 정확히 동일 | ✅ | |
| 배경 원칙 | 화면 기본 배경 항상 `#FFFFFF`, Primary 전면채움은 스플래시만 | `--color-surface: #FFFFFF`(index.css:31). 로딩 화면(TripGeneratingView)도 PDF가 예외 허용(2. 로딩) — 코드도 Primary 배경 사용 중으로 추정(그 파일 안 읽음) | ⚠️ 부분일치 | 로딩 화면 배경 직접 미확인 |
| 다크시트 `#2B2A3A` | 시스템 피커 예외 허용 | `--sheet-bg-dark: #2B2A3A`(index.css:153) | ✅ | |
| 타이포 폰트 | 한글 IBM Plex Sans KR, 워드마크 Urbanist, 영문 Inter | `--font-kr`/`--font-brand`/`--font-en` 토큰 존재(index.css:41-43). 단 `14_step3_partial_implementation.md` 15번 — **Poppins/Pretendard로 전역 강제 복구**했다고 기록됨(`index.html`의 `!important` 폰트 강제) | ❌ 불일치 | 토큰은 맞는데 실제 렌더 폰트는 사용자 요청으로 Poppins/Pretendard로 덮어씀. PDF는 "맑은 고딕 아님"만 정정한 것이지 Poppins 허용 안 함 — **운영 규칙 충돌** |
| H1~Micro 스케일 | 22/18/15/14/12/11px | `--text-h1: 22px` 등 index.css:46-51에 토큰 존재 | ✅ (토큰) | 실사용은 아래 "헤더 아래 타이틀" 참고 |
| 화면 대제목 좌측 정렬 | 항상 좌측, 팝업만 중앙 예외 | 각 화면 `.title` 대부분 좌측(구조상 기본), 팝업(AgreementModal 등)은 별도 확인 필요 | ⚠️ 미확인 | |
| 8px 그리드 여백 | 2/4/8/12/16/20/24/32 | `--space-*` 토큰 index.css:63-71 정확히 일치 | ✅ | |
| 헤더 56px | 상단 고정 56px | index.css:87-91 주석에 **"실제 AppHeader는 48px로 다르게 유지하기로 확정"**이라고 명시(2단계에서 사용자가 "헤더가 너무 길어 보인다"며 축소 요청). AppHeader.module.css:7 `padding: calc(10px+safe-area) 16px 10px` → 실측 높이 약 40px대 | ❌ 불일치(의도적) | PDF 56px 고정 규칙과 정면 충돌하지만 **이미 사용자가 명시적으로 결정**한 사항 — 재변경 여부 확인 필요 |
| 카드 radius 16px / 패딩 16~20px | Large 16~20px | `--radius-lg-min/max: 16px/20px`(index.css:76-77) | ✅ (토큰) | |
| 리스트 행 최소 56px | | `--list-row-min-height: 56px`(index.css:92) | ✅ | |
| 버튼 48px/radius 12px | Medium 기준 | `--button-height-md: 48px`, `--button-radius: 12px`(index.css:117,115) | ✅ | |
| Radius Small/Medium/Large | 20/12/16~20px | `--radius-sm/md/lg-*`(index.css:74-77) 정확히 일치 | ✅ | |
| 구분선 1px `#ECECF2` / 포커스 1.5px Primary | | `--color-border: #ECECF2`(index.css:34), `--border-focus`(index.css:81) | ✅ | |
| 아이콘 선형 24px/1.5px | | `--icon-size-default: 24px`, `--icon-stroke-width: 1.5px`(index.css:110-111) | ✅ | |

---

## Components

### 헤더 · 고정 영역 (가장 비중 큰 항목)

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| 헤더 배경/구조 | 보라 전체 채움 바 + 중앙 로고, sticky | `AppHeader.module.css:1-13` `.top-bar { background: var(--header-bg) }`(Primary), 로고는 `position:absolute` 가운데 고정(`:52-61`) | ✅ | |
| 뒤로가기 | squircle 12px, 좌측, 하위 화면만 | `.top-bar-btn`이 `--menu-icon-radius`(12px) 재사용(AppHeader.module.css:18-23), `showBack` prop으로 조건부 렌더(AppHeader.jsx:129-135) | ✅ | |
| 언어 필 "KR ⌄" | 완전 라운드 pill, 흰 배경+Primary 텍스트, 높이22px/좌우패딩9~11px, **로그인 무관 항상 노출** | `.lang-pill`(AppHeader.module.css:77-93) — 흰 배경(`#fff`) + Primary 텍스트(`var(--color-primary-500)`)로 수정 완료(2026-09-15) | ✅ 반영 완료 | `showProfile` 무관하게 항상 렌더(AppHeader.jsx:144-171)도 ✅ |
| 메뉴 아이콘(계정) | squircle 12px, 28×28px, 흰22%불투명, **로그인 후만 노출** | `--menu-icon-size/radius/bg` 정확 일치(index.css:105-107). SignupSuccessView가 `showProfile={false}`였던 것을 `showProfile`(true)로 수정 완료(2026-09-15) | ✅ 반영 완료 | 호출부마다 수동으로 `showProfile`을 넘기는 구조 자체는 남아있어, 다른 로그인 후 화면에서도 누락이 없는지는 전수 확인은 아님 |
| 메뉴 탭 시 동작 | 마이페이지로 **즉시 이동**(드롭다운 아님) | `AppHeader.jsx:40-46` `handleProfile`이 `setIsProfileMenuOpen(prev=>!prev)` — **드롭다운 토글**, 클릭 시 `.profile-menu`(AppHeader.module.css:142-154)가 펼쳐짐(마이페이지/환경설정/여행히스토리/로그아웃 4항목) | ❌ 불일치 | PDF p22-24: "드롭다운이 아니라 전체 화면", "탭하면 마이페이지 화면으로 이동". 코드는 여전히 드롭다운 방식 — **가장 큰 구조적 격차**. `14_step3_partial_implementation.md` 남은 항목표에 "AppHeader 드롭다운 폐지 — 보류(사용자가 명시적으로 유지 요청)"로 이미 기록돼 있어 **운영 규칙 충돌**로 알려진 사안 |
| 헤더→타이틀 간격 24px | | `--header-title-gap: 24px`(index.css:96), 각 화면 `.header{padding-top:24px}` 다수 반영(11_impact_plan.md 2번 기록) | ✅ | |
| 타이틀 크기 | **전 화면 20px Bold**(p24, 가입하기 예시로 명시, 별도 예외 언급 없음) | grep 결과: `ArtistSelectView/ActivityPreferenceView/ConfirmView/PaceView/StaySearchView/TripDateView` = 20px, `CompareView/EventSelectView/ItineraryView/FeedbackView/ItineraryEditView/HistoryView/MyPageView/HomeView(.title)/SignupView/SignupSuccessView/ScheduleTableView/TripReadyView` = 22px | ❌ 불일치 | PDF는 마법사/일반 구분 없이 "화면 타이틀 20px"로 일괄 명시(헤더 섹션 전체가 이 하나의 규칙만 제시, 예외 없음). 기존 세션은 "마법사 화면만 20px, 나머지 22px"로 자체 결정(14번 문서)했는데 **이 PDF엔 그런 이원화 근거가 없음** — 재확인 필요한 운영 규칙 충돌 |

### 마이페이지

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| 진입 경로 통합 | 헤더 메뉴 아이콘과 하단내비 "마이" 탭이 **동일 화면**(`/account`)으로 | `MyPageView.jsx` 자체는 `/account`로 존재(라우트 확인은 00_project_structure.md 기준), BottomNav "마이" 탭도 여기로 연결 추정 | ✅ (화면 자체는 존재) | 단 헤더 메뉴는 위처럼 드롭다운을 거쳐야 이 화면 일부(마이페이지/환경설정)로 가므로 "즉시 이동"은 아님 |
| 행 구성 | 아이콘34px radius10px + 제목Bold + 부제Caption + chevron | `MyPageView.jsx:19-21` `MENU_ITEMS`엔 "여행 히스토리" 1개만 존재(마이페이지/환경설정/로그아웃 항목은 이 배열에 없음 — 화면 자체 구조가 PDF의 4행 리스트와 다를 가능성) | ⚠️ 부분일치 | MyPageView.jsx 전체를 60줄만 읽어 구조 단정 어려움, 나머지 렌더 부분 미확인 |
| 로그아웃 Danger 배경 `#FCEBEC` | | `--color-danger-bg: #FCEBEC`(index.css:22) 토큰 존재 | ✅ (토큰) | 실제 로그아웃 행 적용 여부 미확인 |

### 버튼

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| 화살표(→) 전 버튼 금지 | | grep 결과 `.jsx` 파일들의 "→" 매치는 전부 주석/코드 화살표(예: "API 호출 흐름")였고 버튼 라벨 문자열에서는 발견 안 됨 | ✅ (grep 기준) | 전수 확인은 아님 |
| 하단 버튼 최대 2개, WIZARD/ACTION 구분 | | `ScheduleTableView`/`ItineraryView`는 "동선보기"(구 "목록 열기"/"목록보기") 버튼이 **여전히 3번째 버튼으로 유지**되고 있음(주석상 `ItineraryView.jsx:52`, `ScheduleTableView.jsx:54`에 "동선보기"/"목록보기" 버튼 언급) | ❌ 불일치 | PDF p8-9 "9·복잡한 버튼 배치 단순화"가 명시적으로 3→2개 확정(v2 뱃지). `14_step3_partial_implementation.md` 5번에 "동선보기 버튼 유지는 이번 세션 사용자의 명시적 요청"이라고 기록됨 — **정면 충돌하는 운영 규칙 사안** |
| WIZARD/ACTION 재분류 | 화면 성격별 버튼 바 통일 | `14_step3_partial_implementation.md` 5번 "재분류 보류(6가지 결정 중 5번)"로 미반영 확정 | 🆕 미구현 | |
| 비활성 톤 `#D9D4F5` | | `--button-bg-disabled: #D9D4F5`(index.css:122) | ✅ | |
| "고정" 배지 강조 방식 | 좌측 액센트 바 + "고정✓" 배지, **배경은 흰색**(행 전체 Primary 채움 금지, p3 v2확정) | **⚠️ 이 표에서 오판정했던 항목** — `EventSelectView.module.css`의 `.event-row.pinned`는 PDF p.3의 "관리자 고정 이벤트" 규칙과 무관하게, 이 화면(마법사 1/4단계)에서 **사용자가 선택한 카드**를 나타내는 클래스였음(클래스 이름만 우연히 "pinned"). 화면1 참고본(`19_screen1_eventselect_audit.md`)으로 확인 후 배경 틴트를 원래대로 복원하고 정정함 | ✅ 정정 완료(`19_screen1_eventselect_audit.md` 참고) | 앱 코드 어디에도 "관리자가 이벤트를 고정 노출한다"는 실제 기능 자체가 없어, PDF의 이 규칙이 적용될 화면이 현재 없는 것으로 추정됨(대상 화면 미확인) |

### 입력 필드 · 검증

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| 보더 상태 4종 | 기본1.5px `#ECECF2`/Focus1.5px Primary/Error1.5px Danger/Disabled bg `#F6F6F9` | `--input-border-*`, `--input-bg-disabled`(index.css:130-133) 정확히 일치 | ✅ | |
| radius | 12px | `--input-radius: 12px`(index.css:129, 13번 단계에서 확정) | ✅ | |
| "!" 접두 삭제 | 색상만으로 경고 | `14_step3_partial_implementation.md` 11번에서 LoginView/SignupView/TripDateView 3곳 전수 확인 완료, "!" 없음으로 기록 | ✅ (이전 세션 확인 근거) | |
| 검증 노출 시점 | blur 또는 제출 시 | 위와 동일 근거로 ✅ | ✅ | |

### "다시 시도" 버튼

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| Outline, Danger 채움 금지 | | `14_step3_partial_implementation.md` 7-1 — `TripGeneratingView.module.css` `.btn-white`를 Outline(흰배경+`--button-border-outline`)으로 전환 완료 기록 | ✅ | |

### 배지&칩 / 우선순위 선택 카드

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| 우선순위 선택 카드(1/2/3순위, Blue/Primary/LightPurple) | 순위 배지 3단계 색상 고정, 항목명13.5px Bold, 부가설명11px Regular, 배지11px Bold White | **재확인 결과 이미 존재함(이전 감사의 오탐)**: `ActivityPreferenceView.jsx`의 "선호 카테고리" 랭킹 카드가 이 컴포넌트. `.category-card.rank-1/2/3`(ActivityPreferenceView.module.css:213-224)이 정확히 `#51A8FF`/`var(--color-primary-500)`/`#9747FF`(Blue/Primary/LightPurple)로 이미 일치. `.category-name`(13.5px/700), `.category-sub`(11px/400), `.rank-badge`(11px/700/흰색)도 전부 PDF값과 정확히 동일 | ✅ 이미 일치(수정 불필요) | 컴포넌트 이름이 "우선순위 카드"가 아니라 "category-card"라 grep 키워드로 못 찾았던 것 — 실제로는 이미 PDF 기준을 완전히 충족 |

### 팝업&모달 / 리스트&카드

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| 정보확인 팝업 X만, 결정모달 버튼2개만(X없음) | 중복 닫기 로직 제거(p4-5, v2확정) | 재확인 완료: `PlaceDetailModal.jsx`는 X 버튼 하나만 있고 하단 "확인" 버튼 없음(:116). `AgreementModal.jsx`는 X 없이 "닫기"/"동의하고 닫기" 2개만(:29-34), 오버레이 클릭 닫기도 없음(주석에 이미 "디자인 가이드 04번 규칙" 근거로 명시돼 있음) | ✅ 이미 일치(수정 불필요) | |
| 안내문 배경 없음 | 박스 배경 삭제 | `11_impact_plan.md`/`14_step3_partial_implementation.md`에서 `TripDateView.infoBanner`, `EditProfileView.infoBannerMuted` 배경 제거 완료 기록 | ✅ | |
| 부분 영역 에러 `#F7F7FA` | | `--color-partial-error-bg: #F7F7FA`(index.css:33), `src/PartialErrorBox.jsx` 컴포넌트 존재하지만 **어느 화면에도 연결 안 됨**(`14_step3_partial_implementation.md` 8번, 남은 항목표에도 재확인) | 🆕 컴포넌트만 존재, 미연결 | PDF는 이걸 구체 화면(지도 출발/도착지 조회 실패)에 적용된 예시로 제시(p52) — 실제 연결 필요 |
| 더보기(Load More) | 8~10개, Outline, "더보기"+▾ | `EventSelectView`/`HistoryView`는 PAGE_SIZE=8로 기존 구현, `ChatbotView`도 `14_step3` 10번에서 히스토리 더보기 추가 완료 기록 | ✅ | |

### 하단 내비 · 채팅(챗봇) · 완료 화면

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| 4탭(홈·일정·채팅·마이) | | `BottomNav` 기존부터 4탭 구조로 추정(00_project_structure.md 확인) | ✅ | |
| FAB vs 채팅탭 노출조건 | 표 전체(팝업/에러/로그인전 숨김 등) | `ChatbotFab.jsx`가 `isChatScreen` 등으로 조건부 숨김(11_impact_plan.md 15번 기록) — PDF의 세부 5개 조건 전부와 1:1 대조는 안 함 | ⚠️ 부분일치 | |
| 완료 화면 헤더 | 로그인 후 구성 그대로(언어필+메뉴) 유지 | `SignupSuccessView.jsx:15` `showProfile={false}` — 메뉴 아이콘 숨김 | ❌ 불일치 | 위 헤더 섹션과 동일 사안 |
| 완료 화면 하단내비 이 화면부터 활성화 | | `SignupSuccessView.jsx:55` `<BottomNav />` 렌더 확인(`14_step3` 9번 기록과 일치) | ✅ | |
| 헤드카피1줄+불릿2개, 카드형 금지 | | `SignupSuccessView.jsx:29-40` `headcopy` + `bullet-list`(2개, 라인아이콘) 구조로 재구성 완료 | ✅ | |
| 완료 화면 타이틀 | PDF는 "가입이 완료되었습니다" 헤드라인을 표시, 이전 단계 타이틀을 남기지 않음 | 확인 결과 `signup.title`="가입하기"가 실제로 재사용되고 있었음(버그 확인). 신규 `signupSuccess.title` 키("가입이 완료되었습니다", 7개 언어 전부 추가)로 교체하고, 완료 화면과 무관한 마법사용 `step-label`("01 — 01")도 함께 제거함(2026-09-15) | ✅ 반영 완료 | `translations.js`, `SignupSuccessView.jsx`, `.module.css` 수정 |

### Content

| 항목 | PDF 규칙 | 현재 코드 | 상태 | 비고 |
|---|---|---|---|---|
| 카피 표준화(일정 만들기/동선 보기/확인/숙소로 추가/가입하기 등) | | grep 결과 "동선보기"/"목록보기" 문구가 주석에 남아있어 실제 버튼 라벨도 옛 표현 가능성(위 버튼 섹션 참고) | ⚠️ 부분일치 | |
| "동선" 용어 통일 | | 별도 전수 검사 안 함 | ⚠️ 미확인 | |
| 접근성(터치44px, 최소11px, 줄간격1.5) | | `top-bar-btn::before{inset:-8px}`로 28px 버튼을 44px 히트박스로 확장(AppHeader.module.css:34-38) — 헤더 버튼은 ✅. 전체 전수 확인은 아님 | ⚠️ 부분일치 | |

---

## 2026-09-15 후속 조치 — 충돌 없는 항목 반영 결과

"즉시 반영 가능" 4건 + 재확인 과정에서 드러난 추가 항목을 처리했다. 코드 수정 후 `npm install` → `npx vite build`(97 modules, 성공) → `npx oxlint`(에러 0건, 기존 경고와 동일 수준) 확인 완료.

| 항목 | 처리 결과 |
|---|---|
| 언어 필 배경/텍스트색 | ✅ 반영 — `AppHeader.module.css` 흰 배경+Primary 텍스트로 수정 |
| SignupSuccessView 메뉴 아이콘 노출 | ✅ 반영 — `showProfile={false}` → `showProfile` |
| SignupSuccessView 타이틀(신규 발견 버그) | ✅ 반영 — "가입하기" 재사용 → `signupSuccess.title`("가입이 완료되었습니다") 신규 키, 마법사용 step-label 제거 |
| "고정" 이벤트 행 배경(신규 발견) | ✅ 반영 — `EventSelectView.module.css`의 `--color-primary-50` 틴트 배경 제거(액센트 바+배지는 이미 정확했음) |
| 우선순위 선택 카드 | ✅ 재확인 결과 이미 완전히 일치(오탐 정정) — `ActivityPreferenceView`가 해당 컴포넌트, 수정 불필요 |
| 정보확인 팝업 / 약관 모달 중복 닫기 | ✅ 재확인 결과 이미 완전히 일치(오탐 정정) — `PlaceDetailModal`/`AgreementModal` 수정 불필요 |
| PartialErrorBox 실제 화면 연결 | ⏸️ **보류** — 코드베이스 전체를 재검색했지만 "화면은 정상인데 한 구역만 실패하는" 실제 API 호출 지점(예: 이동 시간 조회)이 여전히 존재하지 않음. 없는 실패 케이스를 임의로 만들어 붙이는 건 범위 밖이라 판단해 컴포넌트만 유지하고 연결하지 않음 — 실제 부분 실패 지점이 생기거나 적용 화면을 지정해주면 그때 연결 |

### 운영 규칙 결정 필요(기존 세션 결정과 정면 충돌)
- **하단 버튼 3개→2개**: PDF가 v2로 명확히 확정("동선보기"/"목록보기" 제거)했는데, 이번 세션엔 사용자가 명시적으로 유지 요청한 상태 — 재확인 필요
- **화면 타이틀 20px 전면 적용 여부**: PDF는 예외 없이 20px, 기존 세션은 "마법사만 20px/나머지 22px"로 자체 결정 — PDF 문면상 이원화 근거 없음
- **AppHeader 드롭다운 폐지**: PDF는 "드롭다운 아니라 즉시 이동"인데 사용자가 드롭다운 유지를 명시적으로 요청한 상태(`14_step3_partial_implementation.md` 기록)
- **헤더 높이 56px vs 48px**: PDF 56px 고정, 기존 세션은 사용자 요청으로 48px로 의도적 축소

### 구조 변경 필요(영향 큰 것, 충돌 기록은 없음)
- 헤더 메뉴 클릭 시 드롭다운 대신 `/account` 직접 이동(위 운영규칙 항목과 사실상 동일 사안이나, 유지 요청이 최종 결정인지 재확인 후 진행)
- "고정" 이벤트 행이 여전히 Primary 배경 채움이라면 좌측 액센트 바 방식으로 교체(`EventSelectView.module.css` 확인 필요)
- 전역 폰트가 Poppins/Pretendard로 강제된 상태 — PDF 폰트(IBM Plex Sans KR/Urbanist/Inter)와 다름, 이 역시 사용자가 명시적으로 되돌린 결정이라 재확인 필요
