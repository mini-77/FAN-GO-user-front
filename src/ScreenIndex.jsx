import { useEffect, useState } from 'react'
import { useTrip } from './TripContext'
import { apiFetch } from './api'

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

// 목록에서 화면을 하나 골라 iframe으로 볼 때, 실제로 회원가입/이벤트선택/동선생성을
// 순서대로 다 거치지 않으면 뒷단계 화면들은 RequireEvent에 막혀 통째로 안 보이거나
// (예: 4-2, 4-6, 4-7) 빈 상태 문구만 뜸(예: 4-3~6-2). 그래서 여기서 미리보기 전용
// 더미 데이터를 채워서, 어떤 화면을 골라도 "실제 사용자가 데이터를 다 채운 뒤"의
// 모습 그대로 볼 수 있게 함. 이미 실제 값(로그인 데모로 채워졌거나 사용자가 직접
// 고른 값)이 있으면 그건 덮어쓰지 않음.
const PREVIEW_ACCOUNT = {
  email: 'preview@test.com',
  nickname: '미리보기',
  phone: '010-0000-0000',
  password: 'Preview1234!',
  passwordConfirm: 'Preview1234!',
  nationality: 1,
  selectedLanguage: 1,
}

const PREVIEW_EVENT = {
  event_no: 1,
  event_date: '2026-09-18',
  title: "[엔시티 127(NCT 127)] NCT 127 5TH TOUR 'NEO CITY : SEOUL - THE REDLINE'",
  address: '서울 송파구 올림픽로 424',
  artist_group_no: 1,
}

const PREVIEW_CATEGORIES = [
  { id: 1, name: '카페' },
  { id: 2, name: '굿즈샵' },
  { id: 3, name: '포토스팟' },
]

// 갤러리(한번에 보기) 모드에서 각 화면을 축소해서 보여줄 배율 - 390x844(폰 기준)를
// 이 배율만큼 줄여서 스크린샷 한 장에 전체 화면이 다 들어오게 함
const GALLERY_SCALE = 0.28
const PHONE_WIDTH = 390
const PHONE_HEIGHT = 844

// toISOString()은 UTC로 변환하면서 한국 시간 기준 날짜가 하루 당겨지는 버그가 있어서
// (EventSelectView.jsx의 toLocalIsoDate와 동일한 이유) 로컬 값 그대로 조립해야 함.
function toLocalIsoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDaysToIso(iso, n) {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  return toLocalIsoDate(d)
}

export default function ScreenIndex() {
  const { tripData, updateTrip } = useTrip()
  const [selected, setSelected] = useState(SCREENS[0])
  const [iframeKey, setIframeKey] = useState(0) // 같은 화면 다시 눌러도 새로고침되게
  const [isGalleryMode, setIsGalleryMode] = useState(false)
  const [isFillingDemo, setIsFillingDemo] = useState(false)
  const [demoStatus, setDemoStatus] = useState('')
  const [galleryKey, setGalleryKey] = useState(0) // 데모 생성 끝나면 올려서 iframe들을 새로 불러오게 함

  // 비어있는 필드만 미리보기용 더미 값으로 채움 - 로그인 데모로 이미 실제 값이 들어있으면
  // (예: fillDemoAndGenerate 성공 후) 그건 그대로 두고 건드리지 않음.
  useEffect(() => {
    const patch = {}
    if (!tripData.account) patch.account = PREVIEW_ACCOUNT
    if (!tripData.selectedArtists?.length) patch.selectedArtists = [PREVIEW_EVENT.artist_group_no]
    if (!tripData.selectedEvent) patch.selectedEvent = PREVIEW_EVENT
    if (!tripData.rankedCategoryIds?.length) patch.rankedCategoryIds = PREVIEW_CATEGORIES
    if (!tripData.paceMembers?.length && !tripData.isWholeGroupSelected) {
      patch.isWholeGroupSelected = true
      patch.paceArtistGroupNo = (tripData.selectedEvent || PREVIEW_EVENT).artist_group_no
    }
    if (!tripData.selectedPace) patch.selectedPace = 'B'
    if (Object.keys(patch).length) updateTrip(patch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 캡쳐용 - 로그인은 사용자가 직접 해둔 상태여야 함(이 함수는 그 세션 쿠키를 그대로 씀).
  // 실제 이벤트/카테고리를 백엔드에서 가져와서 자동으로 하나씩 고르고, 실제로
  // POST /trips → recommend → trip-routes까지 호출해서 진짜 생성된 동선을 tripData에 채워둠.
  // 그러면 갤러리(전체 화면 한번에 보기)에 뜨는 iframe들이 전부 이 실제 동선 기준으로 보임.
  async function fillDemoAndGenerate() {
    setIsFillingDemo(true)
    setDemoStatus('이벤트 목록 불러오는 중...')
    try {
      const eventsRes = await apiFetch('/events/main')
      if (eventsRes.status === 401) throw new Error('로그인이 안 돼 있어요. 먼저 로그인부터 해주세요.')
      if (!eventsRes.ok) throw new Error('이벤트 목록을 못 불러왔어요.')
      const events = await eventsRes.json()
      if (!events.length) throw new Error('등록된 이벤트가 없어요.')
      const eventCard = events[0]

      const detailRes = await apiFetch(`/events/${eventCard.event_no}`)
      const detail = detailRes.ok ? await detailRes.json() : {}

      // /events/main은 event_date가 아니라 start_dt/end_dt를 내려줌 (EventSelectView와 동일하게 처리)
      const eventStart = new Date(eventCard.start_dt)
      if (Number.isNaN(eventStart.getTime())) throw new Error('이벤트 시작일 형식을 못 읽었어요.')
      const eventDateStr = toLocalIsoDate(eventStart)

      const selectedEvent = {
        event_no: eventCard.event_no,
        event_date: eventDateStr,
        title: eventCard.event_nm,
        address: detail.add || '',
        artist_group_no: eventCard.artist_group_no ?? detail.artist_group_no ?? null,
      }

      const tripDates = {
        startDate: addDaysToIso(selectedEvent.event_date, -1),
        endDate: addDaysToIso(selectedEvent.event_date, 1),
        startTime: '09:00',
        endTime: '21:00',
      }

      // 출발/완료지는 데모용이라 이벤트 장소 좌표를 그대로 재사용함(실제 숙소/공항 검색 대신)
      const place = {
        type: 'custom',
        name: detail.event_nm || selectedEvent.title,
        address: detail.add || '',
        lat: detail.event_lat ?? 37.5665,
        lon: detail.event_lon ?? 126.978,
      }

      setDemoStatus('선호 카테고리 불러오는 중...')
      const interestsRes = await apiFetch('/interests')
      const interests = interestsRes.ok ? await interestsRes.json() : []
      const rankedCategoryIds = interests
        .slice(0, 3)
        .map((i) => ({ id: i.ctg_no, name: i.ctg_nm }))

      const artistGroupNo = selectedEvent.artist_group_no

      updateTrip({
        selectedEvent,
        tripDates,
        stays: [],
        departure: place,
        arrival: place,
        rankedCategoryIds,
        paceMembers: [],
        paceMemberNames: [],
        isWholeGroupSelected: true,
        paceArtistGroupNo: artistGroupNo,
        selectedPace: 'B',
      })

      setDemoStatus('여행 생성 중...')
      const tripCreatePayload = {
        event_no: selectedEvent.event_no,
        event_date: selectedEvent.event_date,
        start_dt: tripDates.startDate,
        end_dt: tripDates.endDate,
        start_tm: `${tripDates.startDate}T${tripDates.startTime}:00`,
        end_tm: `${tripDates.endDate}T${tripDates.endTime}:00`,
        start_place: place.name,
        start_place_lat: place.lat,
        start_place_lon: place.lon,
        end_place: place.name,
        end_place_lat: place.lat,
        end_place_lon: place.lon,
        accoms: [],
        ctg_nos: rankedCategoryIds.map((c) => c.id),
        trip_density_no: 2,
      }
      if (artistGroupNo) tripCreatePayload.artist_group_no = artistGroupNo
      else tripCreatePayload.artist_nos = []

      const createRes = await apiFetch('/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripCreatePayload),
      })
      if (!createRes.ok) {
        const data = await createRes.json().catch(() => null)
        throw new Error(`여행 생성 실패: ${JSON.stringify(data?.detail || data)}`)
      }
      const created = await createRes.json()
      const tripNo = created.trip_no

      setDemoStatus('동선 계산 중...')
      const recommendRes = await apiFetch(`/trips/${tripNo}/recommend`, { method: 'POST' })
      if (!recommendRes.ok) {
        const data = await recommendRes.json().catch(() => null)
        throw new Error(`동선 계산 실패: ${JSON.stringify(data?.detail || data)}`)
      }
      const recommendResult = await recommendRes.json()
      const days = recommendResult.days || []

      setDemoStatus('동선 저장 중...')
      const routes = days.flatMap((day) =>
        (day.schedule || []).map((s) => ({ visit_day: day.visit_day, event_no: s.event_no }))
      )
      const saveRes = await apiFetch('/trip-routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip_no: tripNo, routes }),
      })
      if (!saveRes.ok) {
        const data = await saveRes.json().catch(() => null)
        throw new Error(`동선 저장 실패: ${JSON.stringify(data?.detail || data)}`)
      }

      updateTrip({
        tripNo,
        routesSaved: true,
        generatedDays: days,
        generatedSummary: recommendResult.summary || null,
        generatedWarning: recommendResult.warning || null,
      })

      setDemoStatus(`완료! "${selectedEvent.title}" 기준으로 동선까지 만들었어요.`)
      setGalleryKey((k) => k + 1)
      setIframeKey((k) => k + 1)
    } catch (e) {
      setDemoStatus(`실패: ${e.message}`)
    } finally {
      setIsFillingDemo(false)
    }
  }

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
        {demoStatus && (
          <span style={{ fontSize: 11.5, color: demoStatus.startsWith('실패') ? 'var(--color-danger)' : 'var(--color-primary-500)' }}>
            {demoStatus}
          </span>
        )}
        <button
          onClick={fillDemoAndGenerate}
          disabled={isFillingDemo}
          style={{
            marginLeft: 'auto',
            padding: '7px 14px',
            borderRadius: 999,
            border: '1px solid var(--color-primary-500)',
            background: '#fff',
            color: 'var(--color-primary-500)',
            fontSize: 12,
            fontWeight: 700,
            cursor: isFillingDemo ? 'default' : 'pointer',
            opacity: isFillingDemo ? 0.6 : 1,
          }}
        >
          {isFillingDemo ? '생성 중...' : '로그인 상태로 자동 선택→동선 생성'}
        </button>
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
                  key={galleryKey}
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
