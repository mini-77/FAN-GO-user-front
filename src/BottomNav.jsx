import { useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import styles from './BottomNav.module.css'

// 05 아이콘 규칙 — 선형 단색 1종, 24x24/1.5px 굵기의 공용 Icon.jsx를 그대로 사용.
// 예전엔 이 파일에서 별도로 그린 22px/1.6px 커스텀 SVG를 썼는데, 헤더·드롭다운 등
// 다른 화면의 같은 의미 아이콘(홈·일정·채팅·마이)과 굵기·비율이 미묘하게 달라
// "같은 역할은 항상 같은 모양" 일관성 원칙에 어긋났음 - 공용 Icon으로 통일.
// 08 하단 내비 규칙 — 홈·일정·채팅·마이 4탭 고정. "일정" 탭은 나의 일정(HistoryView)으로
// 바로 연결되고, 일정표(ScheduleTableView)는 그 안의 여행 하나를 보는 하위 화면.
// "저장한 동선"(MyTripView)은 나의 일정과 중복돼서 삭제함.
const TABS = [
  { iconName: 'home', path: '/home', match: ['/home'], isHome: true, label: '홈' },
  { iconName: 'calendar', path: '/trip/history', match: ['/trip/history', '/trip/schedule'], label: '일정' },
  { iconName: 'chat', path: '/chat', match: ['/chat'], label: '채팅' },
  { iconName: 'person', path: '/account', match: ['/account'], label: '마이' },
]

/**
 * 모든 화면 맨 아래에 공통으로 들어가는 아이콘 네비게이션.
 * 지금 주소(pathname)를 보고 알아서 어떤 탭이 활성 상태인지 표시함.
 * 홈 버튼은 가운데 있고, 활성일 때 채워진 아이콘 + 아래 밑줄 바로 표시됨.
 * 사용 예: <BottomNav />
 * noBorder - 바로 위에 이미 다른 구분선(예: 챗봇 입력창)이 있어서 위쪽 구분선이
 * 겹쳐 보일 때만 true로 넘김. 기본은 false라 다른 화면엔 영향 없음.
 */
export default function BottomNav({ noBorder = false }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div
      className={`${styles['bottom-tabs']} ${noBorder ? styles['no-border'] : ''}`}
      data-bottom-bar="true"
    >
      {TABS.map((tab, i) => {
        const isActive = tab.match.some((p) => location.pathname.startsWith(p))
        return (
          <button
            key={i}
            type="button"
            className={`${styles['bottom-tab']} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
          >
            <span className={styles['bottom-tab-icon']}>
              {/* strokeWidth 1.6 - --nav-icon-stroke-width 토큰 값(2026-09-14 확정), 다른 화면 아이콘(1.5px)과는 다름 */}
              <Icon name={tab.iconName} size={22} strokeWidth={1.6} filled={tab.isHome && isActive} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
