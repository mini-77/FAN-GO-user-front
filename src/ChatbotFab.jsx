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
// 붙여뒀음(BottomNav, 각 화면의 footer/action-row).
//
// 데스크톱 미리보기(브라우저 창이 넓을 때)에서는 각 화면의 ".card"가 고정 높이(예: 844px)라
// 뷰포트가 그보다 크면 카드 아래로 회색 여백이 남고, 뷰포트가 그보다 작으면 반대로 카드+
// 여백이 뷰포트보다 커져서 페이지 자체가 스크롤됨. 이 두 경우 모두 "바(bar) 높이의 합"은
// 뷰포트 맨 아래로부터의 실제 여백과 다르게 나와서, FAB가 카드 밖(회색 영역)에 걸치거나
// 카드 모서리를 벗어나 보이는 버그가 있었음. getBoundingClientRect()의 top 값은 스크롤·레이아웃과
// 무관하게 항상 "현재 뷰포트 기준" 좌표라서, 바 중 가장 위에 있는 바의 top까지의 거리를 쓰면
// 카드가 뷰포트보다 작든 크든 항상 정확하게 그 바로 위에 붙일 수 있음.
function computeBottomBarClearance() {
  const bars = document.querySelectorAll('[data-bottom-bar="true"]')
  let minTop = null
  bars.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.height === 0) return
    // 일부 화면은 이 바(하단 액션 버튼)가 고정이 아니라 콘텐츠와 같이 스크롤됨 -
    // 지금 화면 밖으로 나가 있으면(스크롤로 안 보이면) 계산에서 빼야, 챗봇 버튼이
    // 스크롤해서 다시 나타난 버튼과 겹치지 않고 안 보일 땐 원래 자리로 돌아감
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return
    if (minTop === null || rect.top < minTop) minTop = rect.top
  })
  if (minTop === null) return null
  return Math.max(0, window.innerHeight - minTop)
}

// 하단 바가 아예 없는 화면(여행 만들기 입력 단계 등)에서는 현재 화면의 ".screen" 래퍼 자체의
// 실제 렌더 위치를 재서 그 화면의 우측·하단 가장자리에 맞춘다. CSS 모듈 클래스명은
// 항상 "_screen_<해시>" 형태로 컴파일되므로 화면마다 다른 컴포넌트를 몰라도 찾을 수 있음.
function getCurrentScreenEl() {
  return document.querySelector('[class*="_screen_"]')
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
  const [anchor, setAnchor] = useState({ right: 16, bottom: BASE_GAP })
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
      const screenEl = getCurrentScreenEl()
      const screenRect = screenEl ? screenEl.getBoundingClientRect() : null
      const barClearance = computeBottomBarClearance()

      setAnchor({
        // 화면(.screen) 오른쪽 바깥에 회색 여백이 있을 때 그 여백만큼 더 안쪽으로 당겨서
        // 항상 실제 카드 안쪽 16px 지점에 붙게 함 (여백이 없으면 그냥 뷰포트 기준 16px).
        right: screenRect ? Math.max(16, window.innerWidth - screenRect.right + 16) : 16,
        // 하단 바가 있으면 그 바로 위, 없으면 화면(.screen)의 실제 하단 가장자리 위로.
        bottom:
          barClearance !== null
            ? barClearance + BASE_GAP
            : screenRect
              ? Math.max(BASE_GAP, window.innerHeight - screenRect.bottom) + BASE_GAP
              : BASE_GAP,
      })
    }

    // 화면 전환 직후엔 아직 하단 바가 다 그려지기 전일 수 있어서 한 프레임 뒤에 다시 잼
    recalc()
    const raf = requestAnimationFrame(recalc)

    // 하단 바 자체의 크기, 화면(.screen) 크기가 나중에 바뀌는 경우(폰트 로딩, 반응형,
    // 데스크톱 창 크기 조절 등)도 따라가게 관찰
    const bars = document.querySelectorAll('[data-bottom-bar="true"]')
    const observer = new ResizeObserver(recalc)
    bars.forEach((el) => observer.observe(el))
    const screenEl = getCurrentScreenEl()
    if (screenEl) observer.observe(screenEl)
    window.addEventListener('resize', recalc)
    window.addEventListener('scroll', recalc, true)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', recalc)
      window.removeEventListener('scroll', recalc, true)
    }
  }, [isShown, location.pathname])

  if (!isLoggedIn) return null
  if (!isShown) return null

  return (
    <button
      type="button"
      className={styles.fab}
      style={{ right: anchor.right, bottom: anchor.bottom }}
      onClick={() => navigate('/chat')}
      aria-label="트립 버디 챗봇 열기"
    >
      <FenggoIcon size={56} />
    </button>
  )
}
