import { useState } from 'react'

// 앱 진입 순서대로 0번부터 번호를 매김. 같은 흐름으로 이어지는 화면(회원가입 3단계,
// 여행 만들기 7단계)은 "4-1, 4-2, 4-3..."처럼 하위번호로 묶어서 표시함.
const SCREENS = [
  { path: '/', name: '0. 스플래시 (SplashView)' },
  { path: '/login', name: '1. 로그인 (LoginView)' },
  { path: '/signup', name: '2-1. 회원가입 (SignupView)' },
  { path: '/signup/artists', name: '2-2. 아티스트 선택 (ArtistSelectView)' },
  { path: '/signup/success', name: '2-3. 계정생성 완료 (SignupSuccessView)' },
  { path: '/home', name: '3. 홈 (HomeView)' },
  { path: '/trip/events', name: '4-1. 이벤트 선택 (EventSelectView)' },
  { path: '/trip/date', name: '4-2. 날짜·시간·숙소·출발도착지 (TripDateView)' },
  { path: '/trip/activities', name: '4-3. 선호 액티비티 (ActivityPreferenceView)' },
  { path: '/trip/pace', name: '4-4. 동선 스타일(여유도) (PaceView)' },
  { path: '/trip/confirm', name: '4-5. 이대로 진행할까요 (ConfirmView)' },
  { path: '/trip/generating', name: '4-6. 동선 준비중 (TripGeneratingView)' },
  { path: '/trip/ready', name: '4-7. 동선 준비완료 (TripReadyView)' },
  { path: '/trip/schedule', name: '5. 일정표 (ScheduleTableView)' },
  { path: '/trip/itinerary', name: '6-1. 공연 날 동선(지도) (ItineraryView)' },
  { path: '/trip/itinerary/edit', name: '6-2. 동선 직접 고치기 (ItineraryEditView)' },
  { path: '/trip/feedback', name: '7. 이번 동선, 어땠어요? (FeedbackView)' },
  { path: '/trip/history', name: '8. 나의 일정 (HistoryView)' },
  { path: '/account', name: '9-1. 마이 페이지 (MyPageView)' },
  { path: '/account/edit', name: '9-2. 정보수정 (EditProfileView)' },
  { path: '/chat', name: '10. 트립 버디 챗봇 (ChatbotView)' },
]

// 이 화면은 가짜 데이터를 채우지 않음 - 실제 세션(로그인 쿠키 + TripContext localStorage)을
// iframe이 그대로 물려받아서, 지금 실제로 진행해둔 상태 그대로를 각 화면에서 확인하는 용도.
// 로그인/이벤트 선택 등을 실제로 안 거쳤으면 그 상태 그대로(로그인 화면으로 튕기거나
// 빈 상태로 보이는 것) 보이는 게 맞음 - 실제 사용자가 보는 화면과 항상 같아야 하기 때문.

// 갤러리(한번에 보기) 모드에서 각 화면을 축소해서 보여줄 배율 - 390x844(폰 기준)를
// 이 배율만큼 줄여서 스크린샷 한 장에 전체 화면이 다 들어오게 함
const GALLERY_SCALE = 0.28
const PHONE_WIDTH = 390
const PHONE_HEIGHT = 844

export default function ScreenIndex() {
  const [selected, setSelected] = useState(SCREENS[0])
  const [iframeKey, setIframeKey] = useState(0) // 같은 화면 다시 눌러도 새로고침되게
  const [isGalleryMode, setIsGalleryMode] = useState(false)

  function selectScreen(screen) {
    setSelected(screen)
    setIframeKey((k) => k + 1)
  }

  const scaledWidth = PHONE_WIDTH * GALLERY_SCALE
  const scaledHeight = PHONE_HEIGHT * GALLERY_SCALE

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-screen-bg)',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 상단 바 - 목록/한번에 보기 모드 전환 */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--color-primary-200)',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <strong style={{ fontSize: 13, color: 'var(--color-ink-900)' }}>화면 목록 ({SCREENS.length}개)</strong>
        <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--color-ink-600)' }}>
          지금 실제로 로그인·진행해둔 상태 그대로 보여줘요
        </span>
        <button
          onClick={() => setIsGalleryMode((v) => !v)}
          style={{
            padding: '7px 14px',
            borderRadius: 999,
            border: '1px solid var(--color-primary-500)',
            background: isGalleryMode ? 'var(--color-primary-500)' : '#fff',
            color: isGalleryMode ? '#fff' : 'var(--color-primary-500)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {isGalleryMode ? '개별 미리보기로' : '전체 화면 한번에 보기 (캡쳐용)'}
        </button>
      </div>

      {isGalleryMode ? (
        // 모든 화면을 축소된 iframe으로 한 페이지에 늘어놓음 - 이 영역 전체를 스크린샷하면 됨
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
            padding: 20,
          }}
        >
          {SCREENS.map((s) => (
            <div key={s.path} style={{ width: scaledWidth }}>
              <div
                style={{
                  width: scaledWidth,
                  height: scaledHeight,
                  overflow: 'hidden',
                  borderRadius: 8,
                  background: '#fff',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                }}
              >
                <iframe
                  src={s.path}
                  title={s.name}
                  style={{
                    width: PHONE_WIDTH,
                    height: PHONE_HEIGHT,
                    border: 'none',
                    transform: `scale(${GALLERY_SCALE})`,
                    transformOrigin: 'top left',
                  }}
                />
              </div>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--color-ink-900)',
                  lineHeight: 1.3,
                }}
              >
                {s.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          {/* 왼쪽: 화면 목록 - 스크롤 없이 전체 다 보이게, 왼쪽 끝에 붙임 */}
          <div
            style={{
              width: 300,
              minWidth: 300,
              borderRight: '1px solid var(--color-primary-200)',
              padding: '4px 12px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {SCREENS.map((s) => {
                const isActive = selected.path === s.path
                return (
                  <button
                    key={s.path}
                    onClick={() => selectScreen(s)}
                    style={{
                      padding: '8px 12px',
                      background: isActive ? 'var(--color-primary-500)' : '#fff',
                      borderRadius: 8,
                      border: '1px solid var(--color-primary-200)',
                      color: isActive ? '#fff' : 'var(--color-ink-900)',
                      fontSize: 12,
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    {s.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 오른쪽: 실제 화면 미리보기 (iframe) - 왼쪽 목록을 스크롤해도 화면에 고정되게 sticky */}
          <div
            style={{
              flex: 1,
              position: 'sticky',
              top: 0,
              height: 'calc(100vh - 45px)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              overflow: 'hidden',
              paddingTop: 4,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: 420,
                height: 'calc(100vh - 53px)',
                background: '#fff',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              }}
            >
              <iframe
                key={iframeKey}
                src={selected.path}
                title={selected.name}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
