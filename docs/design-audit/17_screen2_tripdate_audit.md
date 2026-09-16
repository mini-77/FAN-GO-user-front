# 화면2(기간·숙소설정) 마크업 참고본 대조 — TripDateView

- 원본: 사용자 첨부 `20260915_FANGO_화면2_기간숙소설정_마크업참고_v1.html`(2026.09.15) — 저장 사본:
  `docs/design-audit/16_screen2_tripdate_markup_ref.html`
- 대상 코드: `src/TripDateView.jsx` / `src/TripDateView.module.css` (라우트 `/trip/date`, 4-2 단계)
- `15_v2_pdf_full_audit.md`(v14 PDF 전수 감사)와 별개로, **이 화면 하나만 콕 집어 제공된 최신(가장 최근 날짜) 참고 자료**라 이 화면에 한해 우선 적용함. PDF 공통 규칙과 겹치는 부분은 서로를 보강하는 근거로 같이 인용함.

## 대조 결과

| 항목 | 참고본 | 기존 코드 | 처리 |
|---|---|---|---|
| 헤더(뒤로가기·로고·언어필·메뉴) | squircle 12px 뒤로가기, 흰배경+Primary "KR" 필, 메뉴 아이콘 | `AppHeader` 공용 컴포넌트 — 언어 필은 직전 세션에서 이미 흰배경+Primary로 수정 완료 | ✅ 이미 일치(수정 불필요) |
| 타이틀·진행률·카피 전반 | "추천 일정의 기간을\n알려주세요", "2/4·50%", "첫째날 출발지"/"마지막날 도착지"/"지도에서 선택"/"행사 선택"/"선호 액티비티" 등 | `translations.js` 값 전수 대조 — 전부 정확히 일치 | ✅ 이미 일치(수정 불필요) |
| 안내 배너(이벤트 날짜 허용 범위) | 배경 없음, 위아래 1px 구분선(`padding:14px 0`), 텍스트 12.5px Ink-600 | `.infoBanner`가 배경은 이미 흰색이었으나 `border-radius:12px` 패딩 박스 형태였고 구분선이 없었음, 폰트 11.5px | ✅ 반영 — 위아래 구분선 스트립 형태로 교체, 12.5px로 통일(`TripDateView.module.css`, `.jsx` 텍스트 `<span>` 래핑) |
| 날짜·시간 입력 칸(`trigger`)·일반 입력(`input`) 테두리 | 1.5px `var(--line)`(#ECECF2) | `1px solid var(--color-primary-200)` — 이미 `index.css`에 정의돼 있던 `--input-border-default`(1.5px #ECECF2) 토큰을 안 쓰고 있었음 | ✅ 반영 — `var(--input-border-default)`/`var(--input-border-focus)` 토큰 참조로 교체 |
| 하단 보조 버튼("행사 선택") | 흰 배경 + Primary 1.5px 보더 + Primary 텍스트 | `background: var(--color-primary-50)`(연보라 채움) + `border:1px solid var(--color-primary-200)` + 텍스트 ink-900 — 앱 다른 화면(`TripGeneratingView`)이 이미 쓰는 Outline 톤(`--button-border-outline`, 흰 배경)과도 불일치했음 | ✅ 반영 — 흰 배경 + `var(--button-border-outline)` + Primary 텍스트로 통일 |
| "숙소" 섹션 개수 배지 | 참고본엔 없음(빈 목록이라 0개 상태만 보여줌) | `section-count`로 개수 표시 | 변경 안 함 — 참고본이 빈 상태만 보여줄 뿐 "제거하라"는 명시적 지시가 아니라고 판단 |
| "+숙소 추가" 아이콘 | SVG 플러스 아이콘 | 텍스트 문자열에 "+" 포함(`'+ 숙소 추가'`) | 변경 안 함 — 시각적으로 거의 동일한 결과라 아이콘화까지는 하지 않음 |
| 지도 검색 시트(숙소/출발지/도착지 공통) | 참고본 범위 밖(별도 화면) | — | 대상 아님 |

## 빌드 확인

`npm run` 대신 `npx vite build`(97 modules, 성공) / `npx oxlint`(TripDateView.jsx 기존 경고 2건 외 신규 에러 없음) 확인 완료.
