# 1단계 구현 보고 — 디자인 토큰과 전역 스타일

- 범위: `docs/design-audit/11_impact_plan.md`에서 승인받은 4단계 중 **1번(디자인 토큰과 전역 스타일)만** 진행
- 수정 전 재확인한 근거 문서: `09_v1_v2_master.md`, `10_token_mapping.md`, `11_impact_plan.md`
- 공통 컴포넌트(`AppHeader`, `BottomNav` 등)·개별 화면 CSS는 이번 단계에서 **손대지 않음**
- 미사용/고아 파일 삭제 없음, 라우팅·API·인증·데이터 로직 변경 없음
- 승인된 영향 파일 목록(토큰/전역 스타일) 범위를 벗어나는 파일은 수정하지 않음

---

## 1. 수정한 파일

| 파일 | 내용 |
|---|---|
| `src/index.css` | 기존 컬러 토큰 5개 값 갱신 + 신규 토큰 약 60개 추가(`:root` 블록만 수정, 그 아래 다크모드/`body`/`#root`/`h1`/`h2`/입력 확대 방지/`code` 규칙 등은 그대로 유지) |
| `index.html` | `<head>`의 전역 폰트 강제 `<style>` 블록(Poppins/Pretendard `!important`) 제거, `body` 기본 폰트를 가이드 폰트(IBM Plex Sans KR)로 교체. 관련 Google Fonts(Poppins)·Pretendard CDN `<link>` 제거 |

`11_impact_plan.md`에서 승인된 "디자인 토큰과 전역 스타일" 범위와 정확히 일치하며, 그 외 파일은 건드리지 않았습니다.

---

## 2. 변경한 토큰의 이전 값 → 새 값

`10_token_mapping.md`에서 "값이 다름"으로 표시됐던 항목들을 **첨부된 `design-tokens_v1.css`(최종 가이드 값)** 기준으로 갱신했습니다.

| 토큰 | 이전 값 | 새 값 | 근거 |
|---|---|---|---|
| `--color-primary-50` | `#F8F7FF` | `#F5F3FF` | `10_token_mapping.md` 1) |
| `--color-primary-100` | `#F0EEFF` | `#E4DEFF` | 위와 동일 — 첨부 토큰이 "100" 단계로 명시한 값을 그대로 반영(기존 200 단계 `#E8E4FF`는 첨부에 없어 손대지 않음) |
| `--color-primary-600` | `#5A45E0` | `#5A46E0` | 위와 동일 |
| `--color-primary-700` | `#4A3AC9` | `#4B36D6` | 위와 동일 |
| `--color-ink-700` | `#3F3F4D` | `#3A3B47` | `10_token_mapping.md` 2) |

**값을 바꾸지 않고 그대로 둔 것**(첨부 토큰에 해당 단계가 아예 없거나, 이미 값이 일치해서):
- `--color-primary-200`(`#E8E4FF`), `--color-primary-400`(`#A89BFF`, 실사용 3곳), `--color-primary-900`(`#2B2140`, 미사용이지만 삭제 범위 아님이라 유지)
- `--color-primary-500`, Semantic 4색(success/warning/danger/info), `--color-ink-900/600/400/200`, `--color-surface`, `--color-border`, `--color-screen-bg` — 전부 첨부·v1·기존 코드가 이미 일치

---

## 3. 새로 추가한 토큰

기존 `index.css`에는 컬러 토큰만 있었고 타이포·spacing·radius 등은 전혀 없었으므로, `10_token_mapping.md` 7번 섹션 목록을 그대로 옮겨 추가했습니다(변수명은 첨부 파일 이름을 그대로 따르되, 다른 토큰을 참조하는 값은 기존 변수명(`--color-primary-500`, `--color-border` 등)을 가리키도록 맞춤 — 4번 항목 참고).

| 그룹 | 추가한 토큰 |
|---|---|
| 컬러(신규 2개) | `--color-danger-bg`, `--color-bg` |
| 타이포그래피(13개) | `--font-kr`, `--font-brand`, `--font-en`, `--text-display/h1/h2/subtitle/body/caption/micro`(7단계), `--font-weight-regular/medium/bold/heavy`(4종), `--line-height-body/title`, `--letter-spacing-title` |
| 여백(9개) | `--space-2/4/8/12/16/20/24/32`, `--screen-padding-x` |
| 라운드(4개) | `--radius-sm/md/lg-min/lg-max` |
| 보더·엘리베이션(5개) | `--border-default/focus`, `--elevation-0/1/2` |
| 레이아웃(2개) | `--header-height`, `--list-row-min-height` |
| 헤더(2개) | `--header-bg`, `--header-title-gap` |
| 언어 필(4개) | `--lang-pill-height/padding-x-min/padding-x-max/radius` |
| 계정 메뉴 아이콘(3개) | `--menu-icon-size/radius/bg` |
| 아이콘 일반(2개) | `--icon-size-default`, `--icon-stroke-width` |
| 버튼(9개) | `--button-height-lg/md/sm`, `--button-radius`, `--button-bg-primary/secondary`, `--button-text-secondary`, `--button-border-outline`, `--button-bg-disabled`, `--button-max-count-per-row` |
| 입력 필드(7개) | `--input-radius`, `--input-border-default/focus/error`, `--input-bg-disabled`, `--input-error-text`, `--input-error-text-size` |
| 배지·칩(3개) | `--badge-radius/padding/font-size` |
| 하단 내비게이션(4개) | `--nav-icon-size/stroke-width`, `--nav-padding-y`, `--nav-tab-count` |

**총 60여 개 신규 토큰**을 추가했습니다. 전부 `:root`에만 정의했고, 아직 어떤 컴포넌트 CSS에서도 참조하지 않습니다(다음 단계에서 연결 예정).

### ⚠️ 값 그대로 옮겼지만 다른 문서와 불일치가 남아있는 것(코드에 아직 연결 안 했으므로 지금은 영향 없음)
- `--input-radius: 11px` — `09`/`10` 문서에서 v1·v2·기존 코드(74곳) 전부 12px라고 확인된 값과 다름. 첨부 토큰(가이드 최종본)에 적힌 값을 그대로 기록했고, **추측으로 12px로 바꾸지 않았습니다.** 공통 컴포넌트 단계에서 실제로 입력 필드에 이 토큰을 연결하기 전에 최종 확인이 필요합니다.
- `--header-height: 56px` — 실제 `AppHeader.module.css`는 이번 세션 중 패딩을 줄여 약 48~50px가 됐습니다. 토큰값만 먼저 정의해뒀고, `AppHeader.module.css`는 이번 단계에서 건드리지 않았습니다.
- `--nav-icon-stroke-width: 1.6px`, `--nav-padding-y: 13px` — 현재 `BottomNav`는 각각 1.5px(Icon 기본값)·12px로 미세하게 다릅니다. 토큰만 먼저 기록했습니다.

---

## 4. 폰트 적용 방식의 변경

**이전 상태(`index.html`)**: `<head>`에 Google Fonts "Poppins"와 Pretendard CDN을 불러온 뒤, `* { font-family: 'Poppins', 'Pretendard', sans-serif !important; }`로 **모든 요소의 폰트를 강제 override**하고 있었습니다. 이건 각 화면 `.module.css`가 개별적으로 `@import`하는 실제 가이드 폰트(IBM Plex Sans KR/Urbanist/Inter)보다 `!important` 때문에 항상 우선 적용되는 상태였습니다 — `00_project_structure.md`에서 "우선순위 확인 필요"로 지목했던 바로 그 충돌입니다.

**변경 후**: 이 강제 override 블록과 관련 Google Fonts(Poppins)·Pretendard `<link>` 태그를 제거하고, `body`에 가이드가 확정한 한글 폰트(`--font-kr`와 동일한 스택: `'IBM Plex Sans KR', 'Apple SD Gothic Neo', -apple-system, sans-serif`)만 `!important` 없이 기본값으로 지정했습니다. 이제 각 화면의 `.module.css`가 개별적으로 지정하는 `Urbanist`/`Inter`/`IBM Plex Sans KR`가 정상적으로 적용됩니다(더 이상 `!important`에 밀리지 않음).

**이번 단계에서 하지 않은 것**: 32개 `.module.css` 파일에 흩어진 개별 `@import url(fonts.googleapis.com/...)` 구문은 그대로 뒀습니다(공통 컴포넌트/개별 화면 CSS는 이번 범위 밖). `index.html`에 폰트 링크를 새로 추가해서 한곳에서 로드하도록 중앙화하는 것도 이번엔 하지 않았습니다 — 그렇게 하면 각 파일의 개별 `@import`가 중복 로드가 되기만 하고, 그 개별 `@import`를 지우는 작업 자체는 컴포넌트/화면 CSS를 건드리는 일이라 범위 밖이라 판단했습니다.

---

## 5. 기존 구조를 변경한 부분과 이유

| 변경 | 이유 |
|---|---|
| `--color-primary-*` 8단계 구조는 유지, 값만 5개 갱신 | 사용자 지시("기존 변수명과 구조를 최대한 유지") — 첨부 토큰은 5단계뿐이었지만 기존 8단계 구조를 깨지 않고 첨부에 있는 값만 반영, 없는 단계(200/400/900)는 그대로 둠 |
| 새 토큰이 참조하는 색상은 `--color-primary`(첨부 이름)가 아니라 기존 `--color-primary-500`을 가리키게 함, `--color-line`이 아니라 기존 `--color-border`를 가리키게 함 | `10_token_mapping.md` 6번에서 지적한 "변수명 체계 불일치"를 새 토큰 쪽에서 기존 이름에 맞춰 흡수 — 기존 화면 코드가 참조하는 이름을 하나도 바꾸지 않기 위함 |
| `index.html`의 전역 폰트 `!important` 블록 제거 | 사용자 지시("index.html의 전역 폰트 충돌도 분석 결과에 따라 정리") — `00_project_structure.md`에서 이미 지목된 충돌을 해소. 구조적으로는 "삭제"지만 기능적으로는 원래 의도(각 화면이 정한 폰트가 실제로 보이게)를 복원하는 정리 작업 |
| Vite 템플릿 잔재 토큰(`--text`, `--bg`, `--sans` 등)은 손대지 않음 | `10_token_mapping.md` 8번에서 삭제 후보로 지목했지만, 이번 지시("기존 토큰은 값만 갱신, 없는 토큰만 추가")의 범위를 벗어나는 "정리/삭제" 작업이라 이번 단계에서는 보류 |

---

## 6. 빌드 및 lint 결과

```
$ npx vite build
✓ 96 modules transformed.
dist/index.html                             1.68 kB
dist/assets/index-BvmQmdNb.css            132.41 kB
dist/assets/index-D6lcrvrN.js             482.53 kB
✓ built in 437ms
```
**빌드 성공.** 모듈 수(96개)·에러 없음 — 토큰 추가와 `index.html` 폰트 정리 모두 빌드에 영향 없음을 확인했습니다.

```
$ npx oxlint
(경고 60건, 전부 기존에 있던 것 — catch(e) 미사용 변수, useEffect 의존성 배열 등)
에러 0건
```
**lint 통과(에러 0건).** 60건의 경고는 전부 `.jsx` 파일에 있는 기존 경고로, 이번에 수정한 `index.css`/`index.html`(둘 다 JS/JSX가 아님)과는 무관합니다 — 제가 수정하기 전부터 있던 경고 그대로입니다.

---

## 7. 다음 단계(2번: 공통 컴포넌트)에서 수정해야 할 것

이번에 추가한 토큰은 아직 어디서도 참조되지 않습니다. `11_impact_plan.md`와 `10_token_mapping.md` 기준으로, 다음 단계에서 아래 공통 컴포넌트들을 새 토큰에 연결하고 값 충돌을 확정해야 합니다.

| 공통 컴포넌트 | 해야 할 일 |
|---|---|
| `src/AppHeader.jsx`/`.module.css` | `--header-height`(56px) 적용 여부 결정 — 이번 세션에 축소했던 패딩(10px)과 상충. `--menu-icon-*` 토큰 연결(값은 이미 일치). 드롭다운 메뉴 폐지 여부(`11_impact_plan.md` 9번)와 언어 필("KR ⌄") 신규 추가는 별도 결정 필요 |
| `src/BottomNav.jsx`/`.module.css` | `--nav-icon-size`(22px, 이미 일치)·`--nav-icon-stroke-width`(1.6px, 현재 1.5px)·`--nav-padding-y`(13px, 현재 12px) 연결 및 미세 차이 반영 여부 결정 |
| `src/Icon.jsx` | `--icon-size-default`/`--icon-stroke-width` 연결(값은 이미 일치, 하드코딩 기본값을 토큰 참조로 교체) |
| `src/PickerSheet.jsx`/`.module.css`, `src/DateRangeSheet.jsx`/`.module.css` | 다크 시트 배경 `#2B2A3A` — 첨부 토큰에 대응 값이 없어 신규 토큰(`--sheet-bg-dark` 등) 추가 여부 결정 필요 |
| (신규 컴포넌트) 언어 선택 다크 시트 | `--lang-pill-*` 토큰을 실제로 쓸 "KR ⌄" 필 컴포넌트와 다크 시트가 아직 없음 — `LoginView.jsx`의 지구본 아이콘 방식을 교체할지 결정 필요 |
| 버튼류 공용 스타일(각 화면에 흩어진 `.btn-primary`/`.btn-outline` 패턴) | `--button-*` 토큰(특히 `--button-radius`, `--button-bg-disabled`는 이미 일치) 연결, `--button-border-outline`(`--color-primary-100` 참조)이 기존 outline 버튼들의 실제 보더 색과 맞는지 화면별 확인 |
| 입력 필드 공용 스타일 | `--input-radius`(11px, 불일치 있음)·`--input-border-*` 토큰 연결 전에 11px vs 12px 최종 확정 필요 |

**1번 작업을 마쳤습니다. 다음 단계(2번: 공통 컴포넌트)로 넘어가지 않고 여기서 멈추겠습니다.**
