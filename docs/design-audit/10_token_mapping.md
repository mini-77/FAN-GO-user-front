# 디자인 토큰 매핑 — 기존 코드 vs 첨부 토큰 파일 vs v1·v2 가이드

- 비교 대상 3+1:
  1. **기존 프로젝트 토큰**: `src/index.css`의 `:root` 블록(유일하게 존재하는 토큰 파일)
  2. **첨부 토큰**: `20260913_FANGO_design-tokens_v1.css` / `.ts` (사용자가 이번에 새로 첨부)
  3. **v1·v2 가이드 최종값**: `docs/design-audit/09_v1_v2_master.md`(및 그 근거인 `01~08`)
  4. 참고: `docs/design-audit/00_project_structure.md`(기존 코드 구조 조사)
- 코드 수정 없음 — 비교·기록 전용 문서

---

## 0. ⚠️ 먼저 밝혀둘 것 — 첨부 토큰의 "기준 문서"가 지금까지 분석한 v1(v13)과 다름

첨부된 두 파일 모두 상단 주석에 **"기준 문서: `20260913_FANGO_공통디자인가이드_v29.html`"**라고 적혀 있습니다. 그런데 지금까지 `00`~`09` 문서에서 분석한 원본은 **`260913_FANGO_공통_디자인_가이드_v1 1.pdf`(표지 기준 버전 v13)**이었습니다.

- **파일명 버전(v29)과 제가 분석한 PDF 버전(v13)이 다릅니다.** 작성일(2026-09-13)은 같지만, "v29"라는 훨씬 높은 버전 번호가 붙어 있어 **제가 아직 못 본 더 최신 개정판(HTML 형식)이 별도로 존재할 가능성**이 있습니다.
- 이 v29 HTML 문서 자체는 이번에 전달받지 않았으므로, 그 문서의 내용을 추측해서 채우지 않았습니다. 대신 **첨부된 CSS/TS 토큰 파일에 실제로 적힌 값**과, 제가 이미 확인한 **v1(v13) PDF·v2 HTML 분석 결과(`09` 마스터)**를 대조하는 방식으로 이 문서를 작성했습니다.
- 흥미로운 점: 첨부 토큰 파일의 값 대부분이 **제가 v1(v13) PDF에서 읽은 값과 정확히 일치**합니다(색상 hex, 타이포 스케일, spacing 8배수, radius 등). 이건 v29가 v13의 내용을 상당 부분 그대로 이어받았거나, 혹은 제가 v13에서 읽은 값들이 애초에 최신판에서도 안 바뀐 "확정 기준"이었다는 뜻으로 보입니다. **다만 몇몇 값은 다릅니다** — 이 문서에서 전부 표시했습니다.
- 또한 두 파일 모두 **"이전 회차에 만들어진 design-tokens 파일을 찾을 수 없어 새로 구성했다"**고 스스로 밝히고 있습니다 — 즉 **이 첨부 파일 자체가 이번이 처음 만들어진 것이고, 기존 프로젝트의 `index.css`와는 애초에 구조를 맞춰볼 기회가 없었던 상태**입니다. 그래서 아래 비교에서 구조 차이가 많이 나타납니다.

---

## 1~4. 도메인별 비교표 (① 기존 변수·값 / ② 첨부 변수·값 / ③ v1·v2 최종값 / ④ 변경 필요 여부)

### 1) 컬러 — Primary

| 기존(`index.css`) | 첨부(CSS/TS) | v1·v2 최종값(`09` 마스터) | 변경 필요? |
|---|---|---|---|
| `--color-primary-500: #6D57FC` | `--color-primary: #6D57FC`(변수명에 -500 없음) | **#6D57FC**(M-C-001, v2 실측으로 재확인됨) | 값은 **동일**, **변수명 구조가 다름**(아래 6번 참고) |
| `--color-primary-600: #5A45E0` | `--color-primary-600: #5A46E0` | v1·v2 문서에 600 hex 명시 없음(참고 대상 아님) | ⚠️ **값이 미세하게 다름**(45E0 vs 46E0, 한 글자 차이) — 확인 필요 |
| `--color-primary-700: #4A3AC9` | `--color-primary-700: #4B36D6` | 명시 없음 | ⚠️ **값이 다름**(더 큰 차이) — 확인 필요 |
| `--color-primary-100: #F0EEFF` | *(첨부에 100 없음, 대신 다른 값 체계)* | 명시 없음 | 아래 참고 |
| `--color-primary-200: #E8E4FF` | `--color-primary-100: #E4DEFF`(첨부는 "100"이라는 이름에 이 값을 씀) | 명시 없음 | ⚠️ **같은 값 대역이 다른 변수명(200 vs 100)에 들어있고 hex도 다름** — 확인 필요 |
| `--color-primary-400: #A89BFF` | *(첨부에 400 없음)* | 명시 없음 | 아래 8번 "빠진 항목" 참고 |
| `--color-primary-50: #F8F7FF` | `--color-primary-50: #F5F3FF` | 명시 없음 | ⚠️ 값이 다름(v2 컨셉 파일의 #F4F1FF와도 또 다름 — 3개 값이 전부 제각각: 코드 F8F7FF / 첨부 F5F3FF / v2목업 F4F1FF) |
| `--color-primary-900: #2B2140` | *(첨부에 900 없음)* | 명시 없음 | 아래 8번 참고(코드에서 0회 사용 — 삭제 후보) |

**단계 개수 자체가 다름**: 기존은 8단계(50/100/200/400/500/600/700/900), 첨부는 5단계(DEFAULT/50/100/600/700)뿐 — **200·400·900이 첨부에서 통째로 빠짐**.

### 2) 컬러 — Ink(Neutral)/Surface/Border

| 기존 | 첨부 | v1·v2 최종값 | 변경 필요? |
|---|---|---|---|
| `--color-ink-900: #17161F` | `--color-ink-900: #17161F` | **#17161F**(V1-P12-007, 일치 확인됨) | 없음(완전 일치) |
| `--color-ink-700: #3F3F4D` | `--color-ink-700: #3A3B47` | 명시 없음 | ⚠️ 값이 다름 — 확인 필요 |
| `--color-ink-600: #5C5D6E` | `--color-ink-600: #5C5D6E` | **#5C5D6E**(V1-P12-008, 일치) | 없음 |
| `--color-ink-400: #93949F` | `--color-ink-400: #93949F` | **#93949F**(V1-P13-001, 일치) | 없음 |
| `--color-ink-200: #E2E2E9` | `--color-ink-200: #E2E2E9` | **#E2E2E9**(V1-P13-002, 일치) | 없음 |
| `--color-border: #ECECF2` | `--color-line: #ECECF2`(**변수명만 다름**, 값은 동일) | **#ECECF2**(V1-P19-007, 일치) | 값 동일, **이름 변경 여부만 결정 필요** |
| `--color-surface: #FFFFFF` | `--color-surface: #FFFFFF` | **#FFFFFF**(V1-P13-003, 일치) | 없음 |
| *(없음)* | `--color-bg: #FCFCFD` | 명시 없음 | **신규 토큰**(7번 참고) |
| `--color-screen-bg: #ECECEC` | *(첨부에 없음)* | 명시 없음 | 기존에만 있음(폰 목업 프레임 배경용, 8번 참고 아님 — 실사용 중이라 유지) |

### 3) 컬러 — Semantic

| 기존 | 첨부 | v1·v2 최종값 | 변경 필요? |
|---|---|---|---|
| `--color-success: #2E9E5B` | `--color-success: #2E9E5B` | **#2E9E5B**(V1-P12-003, 일치) | 없음 |
| `--color-warning: #E5A02E` | `--color-warning: #E5A02E` | **#E5A02E**(V1-P12-004, 일치) | 없음 |
| `--color-danger: #E5484D` | `--color-danger: #E5484D` | **#E5484D**(V1-P12-005, 일치) | 없음 |
| `--color-info: #2E7CE9` | `--color-info: #2E7CE9` | **#2E7CE9**(V1-P12-006, 일치) | 없음 |
| *(없음)* | `--color-danger-bg: #FCEBEC` | 명시 없음 | **신규 토큰**(7번 참고 — 에러 배경 등에 쓰일 것으로 추정) |

**Semantic 컬러 4종은 기존/첨부/v1 셋 다 완전히 일치** — 가장 신뢰도 높은 값.

### 4) 타이포그래피

| 기존 | 첨부 | v1·v2 최종값 | 변경 필요? |
|---|---|---|---|
| *(토큰 자체가 없음 — 컴포넌트마다 하드코딩)* | `--font-kr: 'IBM Plex Sans KR', 'Apple SD Gothic Neo', -apple-system, sans-serif` | **v1 PDF는 "맑은 고딕" 지정(V1-P14-001~003), 실제 코드/v2는 IBM Plex Sans KR 사용** — `09` 마스터 M-T-001에서 "결정 필요"로 남겼던 충돌 | ✅ **이 첨부 파일이 그 충돌을 해소함** — 주석에 "주의: 맑은 고딕 아님 — 실제 개발 화면 폰트 기준으로 확정된 값"이라고 명시. **구조 신규 추가 필요**(현재 토큰화 안 돼있고 각 `.module.css`가 개별 `@import` 중) |
| 없음 | `--font-brand: 'Urbanist', sans-serif` | 코드 실사용과 일치(25개 파일) | 신규 토큰화 필요 |
| 없음 | `--font-en: 'Inter', sans-serif` | 코드 실사용과 일치(18개 파일) | 신규 토큰화 필요 |
| 없음 | `--text-display: 28px` 등 7단계(28/22/18/15/14/12/11px) | **v1 타입 스케일과 정확히 일치**(V1-P14-008~011, V1-P15-001~003) | 신규 토큰화 필요 |
| 없음 | `--font-weight-regular:400 / medium:500(Inter 전용) / bold:700 / heavy:800` | v1은 "Regular 400·Bold 700~800 두 가지만"(V1-P14-001)이라 했는데, 첨부는 **500(Medium)을 Inter 전용으로 예외 허용** | ✅ 이것도 v1 규정을 **구체화(완화)**한 것으로 보임 — 코드에 실제로 `font-weight:500`이 10곳 있어(아래 9번) 이 예외 규정과 부합하는지 개별 확인 필요 |
| 없음 | `line-height-body:1.5 / title:1.3`, `letter-spacing-title:-0.3px` | v1과 정확히 일치(V1-P14-004/005) | 신규 토큰화 필요 |

### 5) 여백(Spacing) & 그리드

| 기존 | 첨부 | v1·v2 최종값 | 변경 필요? |
|---|---|---|---|
| *(토큰 없음)* | `--space-2/4/8/12/16/20/24/32` | **v1과 정확히 일치**(V1-P17-002) | 신규 토큰화 필요 |
| 없음 | `--screen-padding-x: 16px` | v1과 일치(V1-P18-001) | 신규 토큰화 필요 |

### 6) 라운드(Radius)

| 기존 | 첨부 | v1·v2 최종값 | 변경 필요? |
|---|---|---|---|
| *(토큰 없음, 대부분 컴포넌트가 `12px` 하드코딩)* | `--radius-sm:20px(칩·배지)` `--radius-md:12px(버튼·입력필드·squircle)` `--radius-lg-min:16px` `--radius-lg-max:20px(카드·모달)` | **v1과 정확히 일치**(V1-P19-001~003) | 신규 토큰화 필요 |

### 7) 보더 / 엘리베이션(그림자)

| 기존 | 첨부 | v1·v2 최종값 | 변경 필요? |
|---|---|---|---|
| 없음(각 컴포넌트가 `border:1px solid var(--color-border)` 개별 작성) | `--border-default: 1px solid var(--color-line)` | v1은 **기본 구분선 1px #ECECF2**(V1-P19-007) — 값은 일치하나 참조 변수명이 `--color-line`이라 기존 `--color-border`와 이름이 다름 | 신규 토큰화 + 이름 통일 필요 |
| 없음 | `--border-focus: 1.5px solid var(--color-primary)` | v1 포커스 보더 1.5px Primary와 일치(V1-P19-008) | 신규 토큰화 필요 |
| 없음(83곳에서 `box-shadow`를 개별 하드코딩 — 9번 참고) | `--elevation-0: none` `--elevation-1: 0 2px 8px rgba(20,10,50,.08)`(FAB·드롭다운) `--elevation-2: 0 20px 44px rgba(20,10,50,.14), 0 2px 6px rgba(20,10,50,.06)`(바텀시트·모달) | v1은 Elevation 0/1/2 **단계 구분만** 규정하고 구체적 그림자 수치는 없었음(V1-P19-004~006) | ✅ **v1보다 구체적인 신규 값** — 실제 83개 하드코딩 그림자를 이 3단계로 통합할지가 가장 큰 구조 변경 사안(6번 섹션 참고) |

### 8) 레이아웃 / 헤더

| 기존 | 첨부 | v1·v2 최종값 | 변경 필요? |
|---|---|---|---|
| 없음(AppHeader 패딩 `10px 16px`으로 하드코딩 — 실측 시 헤더 전체 높이 약 48~50px) | `--header-height: 56px` | v1 규정 **56px**(V1-P18-002), `09` 마스터 M-H-004에서 이미 "현재 코드가 8px 부족"으로 충돌 표시해둔 항목 | ⚠️ **이 첨부 토큰이 56px를 다시 한번 공식화** — 이번 세션 중 사용자 피드백으로 패딩을 줄인 조치(10px)와 정면으로 배치됨. 코드를 56px에 맞출지, 토큰을 현재 코드값에 맞출지 **결정 필요**(코드 수정은 이번엔 하지 않음) |
| 없음 | `--list-row-min-height: 56px` | v1과 일치(V1-P18-006) | 신규 토큰화 필요 |
| 없음(`AppHeader.module.css`가 `background: var(--color-primary-500)` 직접 사용) | `--header-bg: var(--color-primary)` | v1 원칙과 일치(항상 Primary) | 변수명 정합만 맞추면 그대로 사용 가능 |
| 없음 | `--header-title-gap: 24px`("헤더 → 화면 타이틀 간격") | v1·v2 어디에도 이 구체적 gap 값(24px)이 명시된 적 없음 | **신규 값** — 실제 코드의 헤더-타이틀 간격이 24px인지 개별 화면마다 확인 필요(예: `TripDateView.module.css` `.header{padding:12px 16px 10px}` 구조상 정확히 24px로 안 떨어질 수 있음) |

### 9) Language Pill ("KR ⌄") — v1·v2 문서 어디에도 없던 완전 신규 컴포넌트

| 기존 | 첨부 | v1·v2 최종값 | 변경 필요? |
|---|---|---|---|
| 없음(현재 `LoginView.jsx`는 지구본 아이콘 + 네이티브 `<select>` 오버레이 방식 — 알약형 "KR ⌄" 트리거 버튼이 아님) | `--lang-pill-height:22px` `--lang-pill-padding-x-min:9px` `--lang-pill-padding-x-max:11px` `--lang-pill-radius:20px`(완전 라운드) | **v1(1~43p)·v2(1~100)에 전혀 언급된 적 없음** | **신규 컴포넌트** — 7번 섹션 참고. 실제 구현하려면 `LoginView.jsx`의 언어 선택 UI를 이 알약형 트리거로 교체해야 함 |

### 10) 계정 메뉴 아이콘(헤더 우측 ≡)

| 기존(`AppHeader.module.css` 실측) | 첨부 | v1 최종값 | 변경 필요? |
|---|---|---|---|
| `.top-bar-btn { width:28px; height:28px; border-radius:12px; background:rgba(255,255,255,0.22) }` | `--menu-icon-size:28px` `--menu-icon-radius:12px` `--menu-icon-bg:rgba(255,255,255,.22)` | **v1과 정확히 일치**(V1-P21-004~006) | **없음 — 3자(기존 코드·첨부 토큰·v1 가이드)가 완전히 일치.** 토큰화만 하면 됨(값 변경 불필요) |

### 11) 아이콘(일반)

| 기존(`Icon.jsx` 실측) | 첨부 | v1 최종값 | 변경 필요? |
|---|---|---|---|
| `size=24, strokeWidth=1.5`(기본값) | `--icon-size-default:24px` `--icon-stroke-width:1.5px` | **일치**(V1-P20-001) | 없음, 토큰화만 하면 됨 |

### 12) 버튼

| 기존(실측) | 첨부 | v1 최종값 | 변경 필요? |
|---|---|---|---|
| `min-height:52px` 사용 파일 **17개**, `min-height:48px` 사용 파일 **0개**, `min-height:36px` 사용 파일 **4개** | `--button-height-lg:52px`(하단 CTA) `--button-height-md:48px`(일반) `--button-height-sm:36px`(리스트 내부) | v1과 일치(V1-P18-007, V1-P23-006~008) | ⚠️ **"Medium(48px)"이 실제 코드에 단 한 곳도 없음** — 화면 하단 CTA가 아닌 일반 버튼들이 48px 대신 다른 값(주로 52px 재사용 또는 padding만으로 크기 결정)을 쓰고 있다는 뜻. 실제로 48px가 필요한 자리가 있는지 전수 점검 필요 |
| `border-radius:12px` 압도적 다수(74곳) | `--button-radius:12px` | 일치(Medium) | 없음 |
| 배경 등 `#D9D4F5`(비활성) 10개 파일 | `--button-bg-disabled:#D9D4F5` | **정확히 일치**(V1-P24-003, 이번 세션에 사용자가 확정한 값과 동일) | 없음 — 가장 확실하게 검증된 토큰 |
| Outline 버튼 보더 색 대체로 `var(--color-primary-200)` 추정(개별 확인 필요) | `--button-border-outline: 1.5px solid var(--color-primary-100)` | 명시 없음 | ⚠️ 첨부는 "primary-100"(#E4DEFF)을 참조하는데, 이 값 자체가 기존 코드의 "primary-200"(#E8E4FF)과 더 비슷함(1번 표 참고) — **변수 체계가 다시 섞이면서 어느 토큰을 가리키는지 혼란 가능성**, 정리 필요 |
| 없음 | `--button-max-count-per-row: 2` | v1과 일치(V1-P24-005) | 신규 토큰화 필요 |

### 13) 입력 필드

| 기존(실측) | 첨부 | v1·v2 최종값 | 변경 필요? |
|---|---|---|---|
| `border-radius:12px` 74곳, `border-radius:11px` **1곳뿐** | `--input-radius: 11px` | v1은 **12px**(V1-P19-002, "Medium — 버튼·입력필드"), v2 목업도 12px(V2-039) | ⚠️⚠️ **가장 눈에 띄는 불일치** — v1도, v2도, 기존 코드 74곳도 전부 12px인데 이 신규 "공식" 토큰만 11px. 오타인지 의도적 변경인지 **추측하지 않고 확인 필요**로 남김 |
| 대부분 `border:1px solid var(--color-primary-200)` (연보라 톤) 또는 `1px solid var(--color-border)` 조합 사용(화면마다 다름) | `--input-border-default: 1.5px solid var(--color-line)` | **v1과 정확히 일치**(V1-P24-008: 1.5px #ECECF2) | ✅ **이 토큰이 v1↔v2 충돌을 v1 쪽으로 확정함** — `09` 마스터 M-F-001에서 "v2(1px #EFEDFA) vs v1(1.5px #ECECF2)" 충돌을 v2 우선으로 잠정 기록했었는데, 이 새 "공식" 토큰 파일이 **v1의 1.5px #ECECF2 쪽을 재확인**하고 있어 그 결론이 바뀔 근거가 됨 |
| 포커스 시 `1.5px solid var(--color-primary-500)` + box-shadow glow 패턴 다수 사용 | `--input-border-focus: 1.5px solid var(--color-primary)` | v1과 일치(V1-P24-009) | 없음(변수명 정합만) |
| `1.5px solid var(--color-danger)` 패턴 | `--input-border-error: 1.5px solid var(--color-danger)` | v1과 일치(V1-P24-010) | 없음 |
| `#F6F6F9` 1개 파일(EditProfileView) | `--input-bg-disabled: #F6F6F9` | v1과 일치(V1-P24-011) | 없음, 나머지 화면에도 확산 적용 검토 |
| 없음 | `--input-error-text-size: 11.5px` | v1·v2엔 이 구체적 크기 값 없음 | **신규 값** |

### 14) 배지 & 칩

| 기존 | 첨부 | v1 최종값 | 변경 필요? |
|---|---|---|---|
| `border-radius:20px` 27곳에서 사용 중(알약형 배지·버튼류 전반) | `--badge-radius: 20px` | v1과 일치(V1-P19-001 Small) | 없음, 토큰화만 필요 |
| 없음(패딩·폰트크기 컴포넌트별 하드코딩) | `--badge-padding: 4px 11px` `--badge-font-size: 11.5px` | v1엔 이 구체적 패딩·폰트크기 없음 | **신규 값** — 실제 배지들과 대조 필요 |

### 15) 하단 내비게이션

| 기존(`BottomNav.jsx`/`.module.css` 실측) | 첨부 | v1 최종값 | 변경 필요? |
|---|---|---|---|
| `<Icon size={22} .../>` | `--nav-icon-size: 22px` | v1엔 구체적 크기 없음(4탭 구성만 규정) | **정확히 일치** — 신규 값이지만 코드와 완전 부합 |
| `Icon` 기본 `strokeWidth` 미지정 → `Icon.jsx` 기본값 1.5px 적용 중 | `--nav-icon-stroke-width: 1.6px` | 명시 없음 | ⚠️ 첨부는 1.6px인데 실제로는 `strokeWidth` prop을 안 넘겨서 **1.5px가 적용되고 있음** — 코드에 명시적 prop 추가가 필요한 값 |
| `.bottom-tab{padding:12px 0}` | `--nav-padding-y: 13px` | 명시 없음 | ⚠️ 1px 차이(12 vs 13) — 미세하지만 불일치 |
| `TABS` 배열 4개(홈·일정·채팅·마이) | `--nav-tab-count: 4` | v1과 일치(V1-P33-003) | 없음 |

---

## 5. 기존 구조를 유지할 수 있는가

**부분적으로는 유지 가능, 전체적으로는 확장이 불가피합니다.**

- **컬러 토큰**: `index.css`의 `:root` 구조(변수명 패턴 `--color-{그룹}-{단계}`) 자체는 유지 가능. Semantic 4색·Ink 대부분·Surface·Border는 이미 값이 일치해서 **그대로 둬도 됨**. Primary만 값이 여러 군데(기존/첨부/v2목업)에서 조금씩 달라 **1곳으로 확정하는 결정**이 필요.
- **타이포·spacing·radius·border·elevation·헤더·버튼·입력필드·배지·내비**: `index.css`에 **토큰 자체가 아예 없고** 각 `.module.css` 파일에 값이 흩어져 하드코딩돼 있으므로, 첨부 토큰 파일 구조를 **그대로 새로 얹는 형태**가 됨(기존 걸 "바꾸는" 게 아니라 "새로 만드는" 것에 가까움) — 구조 충돌은 없지만 신규 작업량이 큼.

---

## 6. 구조 변경이 필요한 항목과 이유

| 항목 | 이유 |
|---|---|
| **Primary 변수명 체계**(`--color-primary-500` vs `--color-primary`) | 첨부 토큰은 기본색을 `--color-primary`(접미사 없음)로 쓰는데, 기존 코드는 `--color-primary-500`을 3300곳 넘게(추정) 참조 중 — 변수명을 통일하지 않으면 두 체계가 공존하며 혼란만 커짐. **이름을 하나로 합치는 마이그레이션 작업 필요** |
| **`--color-border` vs `--color-line`** | 값은 같은데(#ECECF2) 이름이 다름 — 마찬가지로 통일 필요 |
| **Primary 스케일 단계 수**(8단계 vs 5단계) | 첨부에 200·400·900이 없어서, 이 3단계를 쓰는 기존 코드(400은 3곳)가 첨부 체계로 넘어가면 값을 잃음 — **8단계 전부를 유지하며 첨부의 새 값(600/700/50/100)만 검토 후 반영하는 절충 구조** 필요 |
| **83곳의 하드코딩 `box-shadow` → Elevation 3단계로 통합** | 지금은 화면마다 그림자 수치가 제각각이라 "일관성" 원칙에 어긋남 — 첨부의 `--elevation-0/1/2` 3단계로 정리하려면 전 화면 재검토가 필요한 대규모 작업 |
| **헤더 높이 56px 재확정** | 이번 세션 중 사용자 요청으로 헤더를 압축(10px 패딩)했는데, 이 첨부 토큰이 다시 56px를 공식화 — 코드와 토큰 중 하나를 바꿔야 함(`09` 마스터 M-H-004와 동일 사안, 이번 첨부로 재확인됨) |
| **타이포·spacing·radius를 실제 CSS 변수로 승격** | 지금은 숫자가 각 `.module.css`에 그대로 박혀 있어 "한 곳만 고치면 전체 반영"이 안 됨 — 첨부 토큰 구조(`--text-h1`, `--space-16` 등)를 실제로 `index.css`에 추가하고 각 파일이 그걸 참조하도록 바꾸는 **전면 리팩터링 필요** |
| **Language Pill 컴포넌트 신설** | 지금 `LoginView.jsx`의 언어 선택 UI(지구본 아이콘+네이티브 select)를 첨부 토큰이 말하는 "KR ⌄" 알약형 트리거로 바꾸려면 **컴포넌트 자체를 새로 설계**해야 함 |

---

## 7. 추가해야 할 토큰 (기존에 전혀 없던 것)

- `--color-bg: #FCFCFD`, `--color-danger-bg: #FCEBEC`
- 타이포 전체(`--font-kr/brand/en`, `--text-*` 7단계, `--font-weight-*` 4종, `--line-height-*`, `--letter-spacing-title`)
- spacing 전체(`--space-2~32`, `--screen-padding-x`)
- radius 전체(`--radius-sm/md/lg-min/lg-max`)
- border/elevation 전체(`--border-default/focus`, `--elevation-0/1/2`)
- layout(`--header-height`, `--list-row-min-height`)
- header(`--header-bg`, `--header-title-gap`)
- **Language Pill 전체 4종**(완전 신규 컴포넌트, 6번 참고)
- menu-icon 3종(값은 이미 코드와 일치 — 토큰화만)
- icon 2종(값은 이미 일치 — 토큰화만)
- button 8종(2종은 코드에 이미 있는 값과 일치 — `--button-bg-disabled` 등)
- input 7종
- badge 3종
- nav 4종

---

## 8. 사용하지 않아도 되는 토큰 (삭제 후보)

| 토큰 | 근거 |
|---|---|
| `--color-primary-900: #2B2140`(기존 `index.css`) | 코드 전체에서 **0회 사용**(grep 확인) — 첨부 토큰에도 없음. 실사용도 없고 새 기준에도 없어 **삭제해도 안전** |
| 기존 `index.css`의 Vite 템플릿 잔재 토큰들(`--text`, `--text-h`, `--bg`, `--border`, `--code-bg`, `--accent`, `--accent-bg`, `--accent-border`, `--social-bg`, `--shadow`, `--sans`, `--heading`, `--mono`) | `00_project_structure.md`에서 이미 "Vite 템플릿에서 남은 미사용/구식 변수"로 지목됐던 것들. 첨부 토큰에도 대응 항목이 없고, 다크모드 재정의 블록도 이 구식 변수만 다룸(`00` 문서 1번 항목) — 신규 토큰 체계 도입 시 정리 대상 |

**주의**: `--color-primary-400`(3회 사용 중)은 사용되고 있으므로 삭제 후보가 아니라 **7번(추가해야 할 토큰) 쪽에 다시 포함시켜야 함** — 첨부 토큰에 없다고 삭제하면 실제로 쓰고 있는 3곳이 깨짐.

---

## 9. 기존 코드에서 하드코딩된 관련 값 (grep 실측)

| 값 | 발견 위치/개수 | 대응 토큰 후보 |
|---|---|---|
| `#D9D4F5` | 10개 `.jsx`/`.module.css` 파일 | `--button-bg-disabled` |
| `#F6F6F9` | `EditProfileView.module.css` 1곳 | `--input-bg-disabled` |
| `#2B2A3A` | `PickerSheet.module.css`, `DateRangeSheet.module.css` | (첨부 토큰엔 다크시트 색이 없음 — 7번에 추가 검토 필요, v1엔 있었음 V1-P30-005) |
| `rgba(255,255,255,0.22)` | `AppHeader.module.css`, `ChatbotView.module.css` | `--menu-icon-bg` |
| `border-radius: 12px` | 74곳 | `--button-radius` / `--radius-md` (입력필드는 첨부의 11px과 충돌, 위 13번 참고) |
| `border-radius: 11px` | 1곳뿐 | 첨부의 `--input-radius`와 우연히 일치하는 유일한 예외 케이스 — 어느 화면인지 추가 확인 권장 |
| `border-radius: 20px` | 27곳 | `--radius-sm` / `--badge-radius` |
| `min-height: 52px` | 17개 파일 | `--button-height-lg` |
| `min-height: 36px` | 4개 파일 | `--button-height-sm` |
| `min-height: 48px` | **0개 파일** | `--button-height-md` — 대응하는 실사용처가 없음(12번 참고) |
| `56px`(문자열 포함, 헤더/리스트 행 등) | 5개 파일 | `--header-height` / `--list-row-min-height` — 문맥별로 다시 확인 필요 |
| `font-weight: 500` | 10곳 | `--font-weight-medium`(Inter 전용 예외) — 실제로 Inter 텍스트에만 쓰였는지 개별 확인 필요 |
| `Urbanist` 폰트 `@import` | 25개 파일(파일마다 개별 `@import`) | `--font-brand` |
| `IBM Plex Sans KR` 폰트 `@import` | 26개 파일(파일마다 개별 `@import`) | `--font-kr` |
| `Inter` 폰트 `@import` | 18개 파일(파일마다 개별 `@import`) | `--font-en` |
| `box-shadow:` | 83곳(전부 개별 수치) | `--elevation-0/1/2`(6번 "구조 변경 필요" 참고 — 가장 큰 리팩터링 대상) |
| `padding: 24px 16px` 계열 | 27곳 | `--screen-padding-x` |
| `Icon size={22}`(BottomNav) | 1곳(BottomNav.jsx) | `--nav-icon-size`(값 일치) |
| `.bottom-tab{padding:12px 0}` | `BottomNav.module.css` | `--nav-padding-y`(13px과 1px 차이) |
| `.top-bar-btn{width:28px;height:28px;border-radius:12px;background:rgba(255,255,255,.22)}` | `AppHeader.module.css` | `--menu-icon-*` 3종(전부 정확히 일치) |

---

## 종합 결론

1. **가장 먼저 확인해야 할 것은 "v29" 원본 문서의 존재 여부**입니다(0번 섹션). 이번엔 첨부된 CSS/TS 토큰 파일만으로 비교했습니다.
2. **Semantic 컬러 4종, Ink 대부분, 메뉴 아이콘 3종, 아이콘 일반 2종, 비활성 버튼색, 입력필드 Focus/Error/Disabled 상태값, BottomNav 아이콘 크기**는 기존 코드·첨부 토큰·v1 가이드 **셋 다 일치**하는 가장 신뢰도 높은 값들입니다.
3. 반면 **Primary 색상 체계(단계 수·변수명·세부 hex), 헤더 높이(56px vs 실제 48~50px), 입력필드 radius(11px vs 12px)**는 소스마다 값이 달라 **사람이 결정해야 할 항목**으로 남겼습니다.
4. **타이포·spacing·radius·elevation 토큰 전체**는 기존 코드에 아예 없던 것이라, 값 충돌보다는 **"새로 토큰화하는 작업량"** 자체가 이번 변경의 핵심입니다.
5. Language Pill은 v1·v2 어디에도 없던 **완전 신규 컴포넌트**라, 디자인 의도를 사람에게 재확인하는 게 안전합니다.

이 문서는 코드를 전혀 수정하지 않았습니다. 실제 반영은 위 결정 필요 항목들이 정리된 뒤 별도로 진행하는 것을 권장합니다.
