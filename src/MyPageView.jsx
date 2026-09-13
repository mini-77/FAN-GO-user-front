import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTrip } from './TripContext'
import { useTheme } from './ThemeContext'
import { apiFetch } from './api'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import Icon from './Icon'
import styles from './MyPageView.module.css'

const MENU_ITEMS = [
  { icon: 'plane', title: '여행 히스토리', sub: '지난 동선 · 별점 · 재사용', path: '/trip/history' },
  { icon: 'globe', title: '앱 언어', sub: '한국어' },
]

export default function MyPageView() {
  const navigate = useNavigate()
  const location = useLocation()
  const isPreview = location.state?.preview
  const { tripData, updateTrip, resetTrip } = useTrip()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [locationRecommend, setLocationRecommend] = useState(true)

  const nickname = tripData.account?.nickname || '사용자'
  const email = tripData.account?.email || ''
  const artistNames = tripData.selectedArtists?.map((a) => a.name) || []

  // 마이페이지 들어올 때마다 세션이 아직 살아있는지 GET /me로 확인 + 최신 프로필로 갱신
  useEffect(() => {
    if (isPreview) return // 화면 모음 목록에서 미리보기로 들어온 경우 세션 체크 생략

    let cancelled = false

    async function checkSession() {
      try {
        const res = await apiFetch('/me')
        if (res.status === 401) {
          // 세션 만료/없음 - 로그인 화면으로 돌려보냄
          if (!cancelled) {
            resetTrip()
            navigate('/login', { replace: true })
          }
          return
        }
        if (res.ok) {
          const me = await res.json()
          if (!cancelled) {
            updateTrip({
              account: { ...tripData.account, email: me.login_id, nickname: me.nickname },
            })
          }
        }
      } catch (e) {
        // 네트워크 에러는 조용히 무시 - 저장된 값으로라도 화면은 보여줌
      }
    }

    checkSession()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogout() {
    try {
      // 예전엔 fetch('/api/signout')로 직접 호출했는데, apiFetch로 통일함
      // (401 자동 재발급 처리 + 백엔드 주소 바뀌어도 한 곳만 고치면 되게)
      await apiFetch('/signout', { method: 'POST' })
    } catch (e) {
      // 서버 로그아웃 실패해도 프론트 쪽 세션 정보는 지우고 로그인 화면으로 보냄
    }
    resetTrip()
    navigate('/login')
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm('정말 계정을 탈퇴하시겠어요? 이 작업은 되돌릴 수 없어요.')
    if (!confirmed) return

    try {
      const res = await apiFetch('/me/withdraw', { method: 'POST' })
      if (!res.ok) {
        window.alert('탈퇴 처리 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.')
        return
      }
      // 명세상 탈퇴 처리와 동시에 서버에서 쿠키를 지워서 바로 로그아웃 상태가 됨
    } catch (e) {
      window.alert('서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.')
      return
    }
    resetTrip()
    navigate('/login')
  }

  return (
    <div className={styles.screen}>
      <div className={`${styles.card} ${isDarkMode ? styles.dark : ''}`}>
        <AppHeader onBack={() => navigate('/trip/itinerary')} />

        <div className={styles.scrollArea}>
        <h1 className={styles.title}>마이 페이지</h1>

        <div className={styles.section}>
          <div className={styles['profile-card']}>
            <div className={styles.avatar}>
              {nickname.slice(0, 2).toUpperCase()}
            </div>
            <div className={styles['profile-info']}>
              <div className={styles['profile-name']}>{nickname}</div>
              {email && <div className={styles['profile-email']}>{email}</div>}
              {artistNames.length > 0 && (
                <div className={styles['profile-tags']}>
                  {artistNames.map((name) => (
                    <span key={name} className={styles['profile-tag']}>
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className={styles['edit-btn']}
              onClick={() => navigate('/account/edit')}
            >
              <Icon name="edit" size={14} />
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles['menu-card']}>
            {MENU_ITEMS.map((item) => (
              <div
                key={item.title}
                className={styles['menu-row']}
                onClick={() => item.path && navigate(item.path)}
              >
                <div className={styles['menu-icon']}><Icon name={item.icon} size={18} color="#6D57FC" /></div>
                <div className={styles['menu-text']}>
                  <div className={styles['menu-title']}>{item.title}</div>
                  <div className={styles['menu-sub']}>{item.sub}</div>
                </div>
                <span className={styles['menu-chevron']}>›</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles['toggle-card']}>
            <div className={styles['toggle-row']}>
              <span className={styles['toggle-label']}>위치 정보 활성화</span>
              <button
                type="button"
                className={`${styles['toggle-switch']} ${locationRecommend ? styles.on : ''}`}
                onClick={() => setLocationRecommend((v) => !v)}
              >
                <span className={styles['toggle-knob']} />
              </button>
            </div>
            <div className={styles['toggle-row']}>
              <span className={styles['toggle-label']}>다크 모드</span>
              <button
                type="button"
                className={`${styles['toggle-switch']} ${isDarkMode ? styles.on : ''}`}
                onClick={toggleDarkMode}
              >
                <span className={styles['toggle-knob']} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles['spacer-top']} />

        <div className={styles.section}>
          <div className={styles['account-actions']}>
            <button type="button" className={styles['logout-btn']} onClick={handleLogout}>
              로그아웃
            </button>
            <button type="button" className={styles['delete-link']} onClick={handleDeleteAccount}>
              계정 탈퇴
            </button>
          </div>
        </div>

        <div className={styles['spacer-bottom']} />
        </div>

        <BottomNav />
      </div>
    </div>
  )
}
