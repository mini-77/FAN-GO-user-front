import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import FenggoIcon from './FenggoIcon'
import styles from './ChatbotFab.module.css'

// 09 기타 컴포넌트 - 플로팅 버튼(FAB) 규칙: "전체 화면(목록·상세 등)에는 항상 표시,
// 팝업·모달·피커가 열려 있을 때는 숨김"이 확정 문구라서, 특정 경로만 골라 보여주던
// 이전 허용목록(SHOWN_ON) 방식은 제거함. 로그인 여부와 화면에 열린 팝업/모달/피커
// 유무로만 표시 여부를 정한다. 팝업류는 각 컴포넌트의 오버레이 루트에 붙인
// data-fab-hide="true" 로 표시해두고, 여기서 그 존재 유무를 관찰한다.
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

function hasOpenPopup() {
  return document.querySelectorAll('[data-fab-hide="true"]').length > 0
}

export default function ChatbotFab() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tripData } = useTrip()
  const isLoggedIn = Boolean(tripData.account?.email)
  // 챗봇 화면(/chat) 자체에서는 "챗봇 열기" 버튼이 의미가 없어 그 화면만 예외로 숨김.
  // 그 외 모든 화면에는 항상 표시하고, 팝업/모달/피커가 열려 있을 때만 숨긴다.
  const isChatScreen = location.pathname.startsWith('/chat')
  const [clearance, setClearance] = useState(BASE_GAP)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const isShown = !isChatScreen && !isPopupOpen

  useEffect(() => {
    function recalcPopup() {
      setIsPopupOpen(hasOpenPopup())
    }

    recalcPopup()
    const popupObserver = new MutationObserver(recalcPopup)
    popupObserver.observe(document.body, { childList: true, subtree: true })

    return () => popupObserver.disconnect()
  }, [location.pathname])

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
