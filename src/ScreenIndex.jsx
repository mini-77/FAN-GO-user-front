import { useState } from 'react'
import { useTrip } from './TripContext'

// 앱 진입 순서대로 0번부터 번호를 매김. 같은 흐름으로 이어지는 화면(회원가입 3단계,
// 여행 만들기 7단계)은 "4-1, 4-2, 4-3..."처럼 하위번호로 묶어서 표시함.
const SCREENS = [
  { path: '/', name: '0. 스플래시 (SplashView)' },
  { path: '/login', name: '1. 로그인 (LoginView)' },
  { path: '/signup', name: '2-1. 회원가입 (SignupView)' },
  { path: '/signup/artists', name: '2-2. 아티스트 선택 (ArtistSelectView)', needsAccountPreview: true },
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

export default function ScreenIndex() {
  const { updateTrip } = useTrip()
  const [selected, setSelected] = useState(SCREENS[0])
  const [iframeKey, setIframeKey] = useState(0) // 같은 화면 다시 눌러도 새로고침되게

  function selectScreen(screen) {
    // 계정생성을 안 거치고 아티스트 선택을 미리보기만 할 때, 저장소에 더미 계정정보를 채워줌.
    // iframe도 같은 브라우저의 localStorage(TripContext가 저장하는 곳)를 그대로 읽으니까,
    // 여기서 미리 채워두면 iframe 쪽 화면도 그 값을 그대로 보게 됨.
    if (screen.needsAccountPreview) {
      updateTrip({
        account: {
          email: 'preview@test.com',
          nickname: '미리보기',
          phone: '010-0000-0000',
          password: 'Preview1234!',
          passwordConfirm: 'Preview1234!',
          nationality: 1,
          selectedLanguage: 1,
        },
      })
    }
    setSelected(screen)
    setIframeKey((k) => k + 1)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ececec',
        fontFamily: 'sans-serif',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      {/* 왼쪽: 화면 목록 - 스크롤 없이 전체 다 보이게, 왼쪽 끝에 붙임 */}
      <div
        style={{
          width: 300,
          minWidth: 300,
          borderRight: '1px solid #E8E4FF',
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
                  background: isActive ? '#6D57FC' : '#fff',
                  borderRadius: 8,
                  border: '1px solid #E8E4FF',
                  color: isActive ? '#fff' : '#1B163F',
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
          height: '100vh',
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
            height: 'calc(100vh - 8px)',
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
  )
}
