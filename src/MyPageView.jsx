import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch } from './api'
import { useLanguage } from './LanguageContext'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import Icon from './Icon'
import styles from './MyPageView.module.css'

export default function MyPageView() {
  const navigate = useNavigate()
  const location = useLocation()
  const isPreview = location.state?.preview
  const { tripData, updateTrip, resetTrip } = useTrip()
  const { t } = useLanguage()
  const [locationRecommend, setLocationRecommend] = useState(true)

  const MENU_ITEMS = [
    { icon: 'plane', title: t('mypage.travelHistory'), sub: t('mypage.historySub'), path: '/trip/history' },
  ]

  const nickname = tripData.account?.nickname || t('mypage.defaultNickname')
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
    // "로그인 유지" 체크로 저장해둔 자동로그인 플래그도 같이 지워야
    // 로그아웃한 다음 앱을 다시 열었을 때 또 자동으로 로그인 시도하지 않음
    localStorage.removeItem('fango_auto_login')
    resetTrip()
    navigate('/login')
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(t('mypage.confirmDelete'))
    if (!confirmed) return

    try {
      const res = await apiFetch('/me/withdraw', { method: 'POST' })
      if (!res.ok) {
        window.alert(t('mypage.deleteFailed'))
        return
      }
      // 명세상 탈퇴 처리와 동시에 서버에서 쿠키를 지워서 바로 로그아웃 상태가 됨
    } catch (e) {
      window.alert(t('mypage.deleteConnectionError'))
      return
    }
    resetTrip()
    navigate('/login')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader onBack={() => navigate('/trip/itinerary')} />

        <div className={styles.scrollArea}>
        <h1 className={styles.title}>{t('mypage.title')}</h1>

        <div className={styles.section}>
          <div className={styles['profile-card']}>
            {tripData.account?.profileImg ? (
              <img
                src={
                  tripData.account.profileImg.startsWith('http')
                    ? tripData.account.profileImg
                    : `/api${tripData.account.profileImg}`
                }
                alt={t('mypage.profileAlt')}
                className={styles.avatar}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className={styles.avatar}>
                {nickname.slice(0, 2).toUpperCase()}
              </div>
            )}
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
                <div className={styles['menu-icon']}><Icon name={item.icon} size={18} color="var(--color-primary-500)" /></div>
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
              <span className={styles['toggle-label']}>{t('settings.enableLocation')}</span>
              <button
                type="button"
                className={`${styles['toggle-switch']} ${locationRecommend ? styles.on : ''}`}
                onClick={() => setLocationRecommend((v) => !v)}
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
              {t('auth.logout')}
            </button>
            <button type="button" className={styles['delete-link']} onClick={handleDeleteAccount}>
              {t('auth.deleteAccount')}
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
