import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import FenggoIcon from './FenggoIcon'
import styles from './ChatbotFab.module.css'

// 챗봇 명세서(§01) 기준 - "이벤트(성지·관광지·행사) 개별 페이지에 붙어 그 장소에 대한
// 질문에 답하는 보조 가이드"라서, 장소/이벤트 맥락이 있는 화면에만 허용목록으로 띄움.
// 계정 설정(마이페이지/정보수정)이나 여행 만들기 입력 단계(날짜·액티비티·스타일·확인)처럼
// 물어볼 특정 장소가 아직 없는 화면에는 안 띄움.
const SHOWN_ON = [
  '/home',
  '/trip/events',
  '/trip/schedule',
  '/trip/itinerary',
  '/trip/itinerary/edit',
  '/trip/history',
  '/trip/my',
  '/trip/feedback',
]

const BASE_GAP = 16 // 가장 위에 있는 버튼 줄과 챗봇 버튼 사이 최소 여백

// 화면 맨 아래 고정되는 버튼 줄(하단 탭바, 액션 로우 등)에는 전부 data-bottom-bar="true"를
// 붙여뒀음(BottomNav, 각 화면의 footer/action-row). 매번 화면마다 "탭바만 있음/액션+탭바 있음"
// 같은 경우의 수를 하드코딩하는 대신, 실제로 지금 렌더된 그 요소들의 높이를 재서 그 위로
// 띄우면 화면이 바뀌거나 버튼 줄 높이가 바뀌어도 자동으로 안 겹침.
function measureBottomBarsHeight() {
  const bars = document.querySelectorAll('[data-bottom-bar="true"]')
  let total = 0
  bars.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.height > 0) total += rect.height
  })
  return total
}

export default function ChatbotFab() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tripData } = useTrip()
  const isLoggedIn = Boolean(tripData.account?.email)
  const isShown = SHOWN_ON.includes(location.pathname)
  const [clearance, setClearance] = useState(BASE_GAP)

  useEffect(() => {
    if (!isShown) return

    function recalc() {
      setClearance(measureBottomBarsHeight() + BASE_GAP)
    }

    // 화면 전환 직후엔 아직 하단 바가 다 그려지기 전일 수 있어서 한 프레임 뒤에 다시 잼
    recalc()
    const raf = requestAnimationFrame(recalc)

    // 하단 바 자체의 크기가 나중에 바뀌는 경우(폰트 로딩, 반응형 등)도 따라가게 관찰
    const bars = document.querySelectorAll('[data-bottom-bar="true"]')
    const observer = new ResizeObserver(recalc)
    bars.forEach((el) => observer.observe(el))
    window.addEventListener('resize', recalc)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', recalc)
    }
  }, [isShown, location.pathname])

  if (!isLoggedIn) return null
  if (!isShown) return null

  return (
    <button
      type="button"
      className={styles.fab}
      style={{ bottom: clearance }}
      onClick={() => navigate('/chat')}
      aria-label="트립 버디 챗봇 열기"
    >
      <FenggoIcon size={56} />
    </button>
  )
}
