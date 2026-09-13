import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch } from './api'
import logoImg from './assets/fango-logo-mark.png'
import styles from './SplashView.module.css'

const LOAD_DURATION_MS = 3000
// 로그인 화면에서 "자동 로그인"을 체크하면 이 값이 localStorage에 저장됨.
// 저장돼 있으면 스플래시가 끝난 뒤 로그인 화면을 건너뛰고 세션이 아직 살아있는지 확인해봄.
const AUTO_LOGIN_KEY = 'fango_auto_login'

export default function SplashView() {
  const navigate = useNavigate()
  const { updateTrip } = useTrip()
  const [label, setLabel] = useState('불러오는 중')

  useEffect(() => {
    const readyTimer = setTimeout(() => setLabel('준비 완료'), LOAD_DURATION_MS - 200)

    const navTimer = setTimeout(async () => {
      const wantsAutoLogin = localStorage.getItem(AUTO_LOGIN_KEY) === 'true'

      if (wantsAutoLogin) {
        try {
          // refresh_token 쿠키(14일)가 아직 살아있으면 이 요청이 성공함 (apiFetch가
          // 401일 때 자동으로 /auth/refresh까지 시도해줌 - api.js 참고)
          const res = await apiFetch('/me')
          if (res.ok) {
            const me = await res.json()
            updateTrip({
              account: {
                email: me.login_id,
                nickname: me.nickname,
                nationality: me.nationality_no,
                selectedLanguage: me.lang_no,
                profileImg: me.profile_img,
              },
              selectedArtists: (me.favorite_groups || []).map((g) => ({
                id: g.artist_group_no,
                name: g.group_nm,
              })),
            })
            navigate('/trip/events')
            return
          }
        } catch (e) {
          // 실패하면 그냥 로그인 화면으로 - 아래에서 처리
        }
      }

      navigate('/login')
    }, LOAD_DURATION_MS + 400)

    return () => {
      clearTimeout(readyTimer)
      clearTimeout(navTimer)
    }
  }, [navigate, updateTrip])

  return (
    <div className={styles.screen}>
      <div className={styles.phone}>
        <div>
          <div className={styles['logo-slide']}>
            <div className={styles['logo-visual']}>
              <div className={styles['logo-white']} />
              <img src={logoImg} alt="FAN:GO" className={styles['logo-letters']} />
              <div className={styles['logo-notch']} />
            </div>
          </div>
          <p className={styles.tagline}>Your Ultimate Fan Companion</p>
        </div>

        <div className={styles['progress-block']}>
          <div className={styles['progress-track']}>
            <div className={styles['progress-fill']} />
          </div>
          <span className={styles['progress-label']}>{label}</span>
        </div>
      </div>
    </div>
  )
}
