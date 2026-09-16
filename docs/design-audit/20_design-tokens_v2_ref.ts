/**
 * FAN:GO Design Tokens (TypeScript)
 * 기준 문서: 20260915_FANGO_공통디자인가이드_v39.html
 * 생성일: 2026-09-15 (v1: 2026-09-13 이후 전면 갱신)
 *
 * design-tokens.css 와 동일한 값을 TypeScript 객체로 옮긴 것입니다.
 * 값 변경 시 반드시 가이드 문서 + design-tokens.css 를 함께 갱신해 주세요.
 *
 * v1(0913) 대비 주요 변경은 design-tokens.css 상단 주석을 참고하세요.
 */

export const designTokens = {
  color: {
    primary: {
      DEFAULT: '#6D57FC',
      600: '#5A46E0',
      700: '#4B36D6',
      100: '#E4DEFF',
      50: '#F5F3FF',
    },
    ink: {
      900: '#17161F',
      700: '#3A3B47',
      600: '#5C5D6E',
      400: '#93949F',
      200: '#E2E2E9',
    },
    line: '#ECECF2',
    surface: '#FFFFFF',
    bg: '#FCFCFD',
    semantic: {
      danger: '#E5484D',
      dangerBg: '#FCEBEC',
      success: '#2E9E5B',
      info: '#2E7CE9',
      warning: '#E5A02E',
    },
  },

  typography: {
    // 주의: "맑은 고딕" 아님 — 실제 개발 화면 폰트 기준으로 확정된 값
    // v3: Inter 삭제, 한글+영문 UI 전부 IBM Plex Sans KR로 통일. 대체 폰트 Roboto(안드로이드 기본)로 변경.
    fontFamily: {
      kr: "'IBM Plex Sans KR', Roboto, sans-serif", // 한글 + 영문 UI 텍스트 전체
      brand: "'Urbanist', sans-serif", // 브랜드 워드마크("FAN : GO") · 큰 숫자 강조 전용 — 이 2곳에만 예외
      // en: 삭제됨(v3) — 과거 Inter, 폰트 2종 최소화하며 제거
    },
    scale: {
      display: '28px', // Bold · Urbanist
      h1: '20px',      // Bold · 화면 대제목, 항상 좌측 정렬 (v2: 22px→20px 정정)
      h2: '18px',      // Bold · 섹션 제목
      subtitle: '15px', // Bold · 카드·리스트 제목
      body: '14px',    // Regular
      caption: '12px', // Medium
      micro: '11px',   // 최소 크기
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
      heavy: 800, // 로고 전용
    },
    lineHeight: {
      body: 1.5,  // 신규 화면 기준값 — 기존 화면은 폰트 교체와 함께 화면 단위로 확인
      title: 1.3,
    },
    letterSpacing: {
      title: '-0.3px',
    },
  },

  spacing: {
    2: '2px',   // 아이콘 내부
    4: '4px',   // 텍스트 줄 사이
    8: '8px',   // 아이콘-텍스트 간격
    12: '12px', // 버튼 내부
    16: '16px', // 화면 여백 · 카드
    20: '20px', // 카드 패딩(대)
    24: '24px', // 요소 그룹 간
    32: '32px', // 섹션 간
    screenPaddingX: '16px',
  },

  radius: {
    sm: '20px',    // 칩 · 배지
    md: '12px',    // 버튼 · 입력필드 · squircle 아이콘(뒤로가기/메뉴)
    lgMin: '16px', // 카드 · 모달 (하한)
    lgMax: '20px', // 카드 · 모달 (상한)
    input: '11px',
  },

  border: {
    default: '1px solid var(--color-line)',
    focus: '1.5px solid var(--color-primary)',
  },

  elevation: {
    0: 'none', // 기본 카드: 그림자 없음, 1px 보더
    1: '0 2px 8px rgba(20,10,50,.08)', // FAB · 드롭다운
    2: '0 20px 44px rgba(20,10,50,.14), 0 2px 6px rgba(20,10,50,.06)', // 바텀시트 · 모달
  },

  layout: {
    headerHeight: '56px',
    listRowMinHeight: '56px',
  },

  header: {
    bg: 'var(--color-primary)',
    titleGap: '24px', // 헤더 → 화면 타이틀 간격, 고정값
  },

  langPill: {
    height: '22px',
    paddingXMin: '9px',
    paddingXMax: '11px',
    radius: '20px', // 완전 라운드 필
  },

  // v4: 다크 바텀시트 → 흰색 드롭다운으로 구조 변경
  langDropdown: {
    bg: '#FFFFFF',
    position: 'anchored-below-right', // 헤더 KR 필 바로 아래, 우측 정렬 고정
    dim: 'rgba(20,15,45,.35)', // 뒷배경 dim 처리
    shadow: '0 2px 8px rgba(20,10,50,.08)',
    selectionIndicator: 'none', // 라디오·체크 아이콘 없음 — 탭 즉시 전환
    currentLanguageColor: 'var(--color-primary)', // 현재 언어만 텍스트 색상으로 구분
    languages: ['한국어', 'English', '日本語', '中文', 'ภาษาไทย', 'Bahasa Indonesia'], // 6개, 고정 순서
  },

  menuIcon: {
    size: '28px',
    radius: '12px', // squircle, 원형 아님
    bg: 'rgba(255, 255, 255, 0.22)',
  },

  icon: {
    sizeDefault: '24px',
    strokeWidth: '1.5px',
    sizeListRow: '34px',      // 원형 배경 포함, stroke 1.7px
    sizeBottomNav: '22px',    // stroke 1.6px
    sizeAccountMenu: '28px',  // squircle, stroke 1.8px
  },

  // v3: 화살표(→)·콜론 접두어 규칙 폐기, 하단 버튼 바 3종 체계로 개편
  button: {
    heightLg: '52px', // 하단 고정 CTA
    heightMd: '48px', // 일반 버튼
    heightSm: '36px', // 리스트 행 내부
    radius: '12px',
    bgPrimary: 'var(--color-primary)',
    bgSecondary: 'var(--color-primary-50)',
    textSecondary: 'var(--color-primary-700)',
    borderOutline: '1.5px solid var(--color-primary-100)',
    bgDisabled: '#D9D4F5',
    maxCountPerRow: 2, // 하단 고정 영역 버튼 최대 개수
    labelRule: '접두어("다음:"/"이전:") 금지. 다음/이전 화면 이동 시 접두어 없이 해당 화면 메뉴명만 표기',
    bottomBarTypes: {
      wizardSingle: '1개(다음만), 부분폭 pill, 우측 정렬 — 뒤로 갈 일 없는 단계',
      wizardPrevNext: '2개(50:50), 좌 Outline(이전)·우 Filled(다음) — 이전 값을 고칠 수 있어야 하는 단계',
      action: '최대 2개, 보조(Outline)+주요(Filled) 40:60 또는 50:50 — 결과 확인·편집 화면',
    },
  },

  input: {
    radius: '11px',
    borderDefault: '1.5px solid var(--color-line)',
    borderFocus: '1.5px solid var(--color-primary)',
    borderError: '1.5px solid var(--color-danger)',
    bgDisabled: '#F6F6F9',
    errorText: 'var(--color-danger)',
    errorTextSize: '11.5px',
    dropdownValueTextSize: '13.5px', // Bold, Ink-900
    dropdownChevronSize: '14px',     // stroke 2px, Ink-600
  },

  // v3: 배경(박스) 삭제, 텍스트 색상 Ink-600으로 통일 — 색·아이콘만으로 톤 구분
  notice: {
    bg: 'transparent', // 박스형 배경 사용 금지. 화면과 동일한 흰 배경
    textColor: 'var(--color-ink-600)', // 경고여도 텍스트색 고정, 아이콘 색으로만 톤 구분
    iconColorInfo: 'var(--color-info)',
    iconColorWarning: 'var(--color-warning)',
    divider: '1px solid var(--color-line)', // 필요 시 위·아래 구분선만 허용
  },

  badge: {
    radius: '20px',
    padding: '4px 11px',
    fontSize: '11.5px',
  },

  nav: {
    iconSize: '22px',
    iconStrokeWidth: '1.6px',
    paddingY: '13px',
    tabCount: 4, // 홈 · 일정 · 채팅 · 마이 고정
  },

  // v3 신규
  responsive: {
    baselineWidth: '360px',  // 디자인 기준 해상도(360×780dp, Galaxy S25 등)
    minWidth: '360px',
    maxWidth: '430px',       // 초과 시 카드·리스트 여백만 추가, 레이아웃 재배치 없음
    tallScreenHeaderPaddingExtra: '6px', // 세로로 긴 화면(22:9): 헤더 상하 여백 16px→22px
  },

  // v3 신규
  accessibility: {
    textContrastMin: 4.5,
    touchTargetMin: '44px',
    textSizeMin: '11px',
    bodyLineHeight: 1.5,
    darkModeSupported: false, // 자체 다크모드 미지원, 라이트 테마 고정
    fontScaleMax: 1.3,        // 100~130% 대응, 초과 시 clamp
  },

  // v3 신규
  platform: {
    minSdk: 26, // Android 8.0, 기기 기준 약 96% 커버리지
    edgeToEdge: true,
    safeAreaBottom: 'env(safe-area-inset-bottom)', // 하단 고정 CTA·내비게이션에 추가
  },

  // v3 신규 — 리스트 행 긴 제목 처리
  listRow: {
    titleLines: 1, // 1줄 고정, 초과 시 말줄임(…)
    badgePosition: 'right', // 배지·보조 텍스트는 항상 우측 고정폭, 줄바꿈 금지
  },
} as const;

export type DesignTokens = typeof designTokens;
