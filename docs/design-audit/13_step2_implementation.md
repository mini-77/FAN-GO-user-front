# 2단계 구현 보고 — 공통 컴포넌트

- 범위: `docs/design-audit/11_impact_plan.md`에서 승인받은 4단계 중 **2번(공통 컴포넌트)**
- 수정 전 재확인한 근거 문서: `09_v1_v2_master.md`, `10_token_mapping.md`, `11_impact_plan.md`, `12_step1_implementation.md`(1단계에서 정의한 토큰)
- 개별 화면(`.jsx`/`.module.css`, `AppHeader`·`BottomNav`·`PickerSheet`·`DateRangeSheet`·`Icon` 제외)은 이번 단계에서도 **손대지 않음**
- 라우팅·API·인증·데이터 로직 변경 없음, 파일 삭제 없음

---

## 0. 진행 전 확인한 두 가지 — 사용자가 "보류"로 답변

작업 시작 전, `11_impact_plan.md`가 "운영 규칙(사람 결정 필요)"으로 남겨둔 항목 중 `AppHeader`에 직접 걸리는 두 가지를 먼저 확인했고, 둘 다 **이번 단계에서는 보류**하기로 확인받았습니다.

| 확인한 항목 | 결정 |
|---|---|
| `AppHeader` 우측 메뉴(≡) 클릭 시 드롭다운 폐지 + `/account` 즉시 이동(요약#11) | **보류** — 드롭다운 유지, 이번 단계에서 구조 변경 없음 |
| 헤더에 언어 표시 필("KR ⌄") 신규 추가 + 다크시트 컴포넌트 신규 구현(요약#1/9/15) | **보류** — 이번 단계 범위에서 제외 |

따라서 이번 단계는 **시각적으로 동일한 결과를 유지하면서, 이미 1단계에서 정의해둔 토큰에 실제로 연결하는 작업**으로 범위를 좁혀 진행했습니다. 헤더 높이(`--header-height: 56px`)도 같은 이유로 이번 단계에서 적용하지 않았습니다(현재 `AppHeader` 실측 약 48~50px 그대로 유지 — 값을 바꾸면 전 화면 레이아웃이 바뀌는 구조 변경이라 별도 결정 필요).

---

## 1. 수정한 파일

| 파일 | 내용 |
|---|---|
| `src/index.css` | 신규 토큰 1개 추가(`--sheet-bg-dark`) |
| `src/AppHeader.module.css` | 하드코딩된 값 4곳을 1단계에서 정의한 토큰 참조로 교체(값 변경 없음) |
| `src/PickerSheet.module.css` | 다크 시트 배경·라운드를 토큰 참조로 교체(값 변경 없음) |
| `src/DateRangeSheet.module.css` | 위와 동일 |

`src/BottomNav.jsx`/`.module.css`, `src/Icon.jsx`는 검토했으나 아래 3번 이유로 **수정하지 않았습니다.**

---

## 2. 변경한 토큰의 이전 값과 새 값

이번 단계는 **컬러/치수 값 자체를 바꾸지 않았습니다.** 전부 "이미 같은 값을 하드코딩으로 쓰고 있던 곳"을 1단계에서 만든 토큰으로 연결한 것이라, 화면에 보이는 결과는 이전과 동일합니다.

| 파일 | 속성 | 이전(하드코딩) | 이후(토큰 참조) | 값 변경 여부 |
|---|---|---|---|---|
| `AppHeader.module.css` `.top-bar` | `background` | `var(--color-primary-500)` | `var(--header-bg)` | 없음(`--header-bg`가 `--color-primary-500`을 가리킴) |
| `AppHeader.module.css` `.top-bar-btn` | `width`/`height`/`min-width` | `28px` | `var(--menu-icon-size)` | 없음(28px) |
| 〃 | `border-radius` | `12px` | `var(--menu-icon-radius)` | 없음(12px) |
| 〃 | `background` | `rgba(255,255,255,0.22)` | `var(--menu-icon-bg)` | 없음 |
| `AppHeader.module.css` `.top-bar-spacer` | `width`/`height`/`min-width` | `28px` | `var(--menu-icon-size)` | 없음 |
| `AppHeader.module.css` `.profile-menu` | `border-radius` | `20px` | `var(--radius-lg-max)` | 없음 |
| `PickerSheet.module.css`/`DateRangeSheet.module.css` `.sheet` | `background` | `#2B2A3A` | `var(--sheet-bg-dark)` | 없음 |
| 〃 | `border-radius` | `20px 20px 0 0` | `var(--radius-lg-max) var(--radius-lg-max) 0 0` | 없음 |

---

## 3. 새로 추가한 토큰

| 토큰 | 값 | 이유 |
|---|---|---|
| `--sheet-bg-dark` | `#2B2A3A` | `PickerSheet`/`DateRangeSheet`의 다크 시트 배경 — 첨부된 `design-tokens_v1.css`에는 대응하는 값이 없어(1단계 보고서에서 이미 gap으로 지목됨), 기존 코드 값을 그대로 토큰화해서 두 파일이 같은 값을 한 곳에서 관리하게 함 |

언어 선택용 다크시트(요약#15)는 이번 단계에서 보류했으므로, 그 컴포넌트를 위한 토큰은 아직 만들지 않았습니다.

---

## 4. 기존 구조를 변경한 부분과 이유

**구조 변경 없음.** 이번 단계는 값→토큰 참조 치환만 진행했고, 컴포넌트의 마크업·레이아웃·상호작용 방식은 전혀 바꾸지 않았습니다.

- `BottomNav.jsx`/`.module.css`를 수정하지 않은 이유: 아이콘 크기(22px)는 이미 `--nav-icon-size`와 일치해 문제가 없지만, `padding: 12px`(실제)와 `--nav-padding-y: 13px`(토큰), `Icon` 기본 `strokeWidth: 1.5px`와 `--nav-icon-stroke-width: 1.6px`(토큰)는 1단계에서부터 **불일치가 있다고 명시적으로 경고해둔 값**입니다. 이 값을 토큰대로 13px/1.6px로 바꾸면 실제 화면에 보이는 결과가(비록 미세하더라도) 바뀌는 것이라, 이번엔 "구조 유지 + 값 그대로"인 다른 항목들과 성격이 달라 반영하지 않았습니다. 반영 여부는 사용자 확인 후 별도로 진행하는 게 안전하다고 판단했습니다.
- `Icon.jsx`를 수정하지 않은 이유: 기본값(`size=24`, `strokeWidth=1.5`)이 `--icon-size-default`/`--icon-stroke-width` 토큰과 이미 정확히 일치합니다. 다만 이 값들은 SVG 엘리먼트의 `width`/`height`/`strokeWidth` **속성**(attribute)으로 쓰이고 있어서, CSS 변수를 참조하려면 속성을 인라인 `style`로 바꾸는 구조 변경이 필요합니다. 값이 이미 맞아서 얻는 이득 없이 코드 구조만 바뀌는 변경이라 이번엔 보류했습니다.
- `AppHeader.jsx`(드롭다운 메뉴, 언어 필)는 0번 항목에서 정리한 대로 사용자 결정에 따라 보류했습니다.

---

## 5. 빌드 및 lint 결과

```
$ npx vite build
✓ 96 modules transformed.
✓ built in 406ms
```
**빌드 성공.** 모듈 수(96개) 그대로, 에러 없음.

```
$ npx oxlint
경고 60건(1단계와 동일), 에러 0건
```
**lint 통과.** 경고 60건은 1단계 보고서와 완전히 같은 목록으로, 이번에 수정한 4개 CSS 파일과 무관한 기존 경고입니다.

---

## 6. 다음 단계(3번: 개별 화면)에서 확정해야 할 것

이번 단계에서 보류한 항목들은 대부분 "공통 컴포넌트"보다 큰 범위(여러 화면에 영향)이거나 아직 결정되지 않은 값이라, 3단계 진행 전 아래를 먼저 확정하는 게 필요합니다.

| 항목 | 내용 | 비고 |
|---|---|---|
| 화면 타이틀 22px → 20px 전면 변경 | `11_impact_plan.md` 3번 섹션 — 16개 이상 화면 `.title` 영향 | 운영 규칙(사람 결정 필요)로 남아있음 |
| 하단 고정 CTA 3개 vs 2개 | `ScheduleTableView`/`ItineraryView` — 이번 세션 중 사용자가 "동선보기" 복원을 명시적으로 요청한 것과 충돌 | 운영 규칙, 반드시 먼저 확인 |
| `--input-radius: 11px` vs 기존 코드 12px(74곳) | 1단계에서 값만 정의, 실제 입력 필드 스타일은 아직 어디서도 참조하지 않음 | 화면별 적용 전 최종 값 확정 필요 |
| 헤더→타이틀 간격 24px 통일 | 화면마다 제각각인 `.header` 상단 패딩 재검토 | 다수 파일 영향 |
| 하단 버튼 바 Wizard/Action 재분류 | 여행 만들기 단계별 7개 화면 | 분류 기준 신설 필요 |
| "다시 시도" 버튼 Outline 전환 | `TripGeneratingView` 등 | 비교적 낮은 위험, 3단계에서 바로 반영 가능 |
| 안내문 박스 배경 제거 | `TripDateView`/`EditProfileView` | 비교적 낮은 위험 |
| `SignupSuccessView` 구조 변경(+`BottomNav` 추가) | 완료 화면 재구성 | 구조 변경 |
| `BottomNav` padding-y(12→13px)·icon stroke(1.5→1.6px) 반영 여부 | 이번 단계에서 값 변경 없이 보류함 | 사용자 확인 후 결정 |

**2번 작업을 마쳤습니다. 다음 단계로 넘어가지 않고 여기서 멈추겠습니다.**
