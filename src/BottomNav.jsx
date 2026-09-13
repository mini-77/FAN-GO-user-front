import { useLocation, useNavigate } from 'react-router-dom'
import styles from './BottomNav.module.css'

// 간단한 선(아웃라인) SVG 아이콘들. currentColor를 써서 CSS의 color 값을 그대로 따라감
// (컬러 이모지는 CSS로 색을 못 바꾸는데, 이 아이콘들은 자유롭게 바꿀 수 있음).
function ChatbotIcon() {
  // 챗봇(트립 버디) - 말풍선 + 점 3개 (원래 피드백 아이콘과 같은 모양을 그대로 씀)
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h9A2.5 2.5 0 0 1 18 5.5v6A2.5 2.5 0 0 1 15.5 14H10l-4 3.5V14H6.5A2.5 2.5 0 0 1 4 11.5v-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="8" cy="8.5" r="1" fill="currentColor" />
      <circle cx="11" cy="8.5" r="1" fill="currentColor" />
      <circle cx="14" cy="8.5" r="1" fill="currentColor" />
    </svg>
  )
}

function HomeIcon({ filled }) {
  // 홈 - 활성일 땐 채워진 형태로
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M4 10.5 11 4l7 6.5V18a1 1 0 0 1-1 1h-3.5v-5.5h-5V19H5a1 1 0 0 1-1-1v-7.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

function ScheduleIcon() {
  // 일정표 - 달력 + 점 3개
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="4" y="5" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 3v3.5M14.5 3v3.5M4 9h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="13" r="1" fill="currentColor" />
      <circle cx="11" cy="13" r="1" fill="currentColor" />
      <circle cx="14" cy="13" r="1" fill="currentColor" />
    </svg>
  )
}

function ProfileIcon() {
  // 마이페이지 - 사람 모양
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="7.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 18c1.2-3.5 4-5 6.5-5s5.3 1.5 6.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// 08 하단 내비 규칙 — 홈·일정·채팅·마이 4탭 고정 (예전엔 "나의 일정"·"일정표" 두 개가
// 따로 있어서 5탭이었는데, "일정표"는 특정 여행 하나를 보는 상세 화면이라 탭이 아니라
// "일정"(저장한 동선 목록) 안에서 들어가는 하위 화면으로 정리함)
const TABS = [
  { Icon: HomeIcon, path: '/home', match: ['/home'], isHome: true, label: '홈' },
  { Icon: ScheduleIcon, path: '/trip/my', match: ['/trip/my', '/trip/schedule', '/trip/history'], label: '일정' },
  { Icon: ChatbotIcon, path: '/chat', match: ['/chat'], label: '채팅' },
  { Icon: ProfileIcon, path: '/account', match: ['/account'], label: '마이' },
]

/**
 * 모든 화면 맨 아래에 공통으로 들어가는 아이콘 네비게이션.
 * 지금 주소(pathname)를 보고 알아서 어떤 탭이 활성 상태인지 표시함.
 * 홈 버튼은 가운데 있고, 활성일 때 채워진 아이콘 + 아래 밑줄 바로 표시됨.
 * 사용 예: <BottomNav />
 */
export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className={styles['bottom-tabs']} data-bottom-bar="true">
      {TABS.map((tab, i) => {
        const isActive = tab.match.some((p) => location.pathname.startsWith(p))
        const Icon = tab.Icon
        return (
          <button
            key={i}
            type="button"
            className={`${styles['bottom-tab']} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
          >
            <span className={styles['bottom-tab-icon']}>
              <Icon filled={tab.isHome && isActive} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
