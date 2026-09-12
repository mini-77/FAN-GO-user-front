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

// 하단 탭바(BottomNav)만 있는 화면 - 챗봇 버튼이 탭바 위로 올라오게 띄움
const HAS_BOTTOM_NAV = ['/home', '/trip/my', '/trip/feedback']

// 탭바 위에 "지도 열기/동선 수정/다음" 같은 버튼 줄까지 하나 더 있는 화면 -
// 버튼 두 줄(액션 로우+탭바)을 다 피해야 해서 훨씬 더 많이 띄움
const HAS_ACTIONS_ABOVE_NAV = ['/trip/itinerary', '/trip/schedule', '/trip/history']

// 탭바는 없지만 화면 맨 아래에 저장/제출 버튼 한 줄이 있는 화면
const HAS_SINGLE_ACTION_ROW = ['/trip/itinerary/edit']

export default function ChatbotFab() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tripData } = useTrip()
  const isLoggedIn = Boolean(tripData.account?.email)

  if (!isLoggedIn) return null
  if (!SHOWN_ON.includes(location.pathname)) return null

  let clearanceClass = ''
  if (HAS_ACTIONS_ABOVE_NAV.includes(location.pathname)) {
    clearanceClass = styles['fab-above-actions']
  } else if (HAS_SINGLE_ACTION_ROW.includes(location.pathname)) {
    clearanceClass = styles['fab-above-single-row']
  } else if (HAS_BOTTOM_NAV.includes(location.pathname)) {
    clearanceClass = styles['fab-above-nav']
  }

  return (
    <button
      type="button"
      className={`${styles.fab} ${clearanceClass}`}
      onClick={() => navigate('/chat')}
      aria-label="트립 버디 챗봇 열기"
    >
      <FenggoIcon size={56} />
    </button>
  )
}
