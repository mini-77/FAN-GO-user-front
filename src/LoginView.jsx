import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { useLanguage } from './LanguageContext'
import { apiFetch, safeText } from './api'
import AppHeader from './AppHeader'
import styles from './LoginView.module.css'

const AUTO_LOGIN_KEY = 'fango_auto_login'

function stripKorean(value) {
  return value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
      <path d="M2 11s3.5-6.5 9-6.5S20 11 20 11s-3.5 6.5-9 6.5S2 11 2 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
      <path d="M2 11s3.5-6.5 9-6.5S20 11 20 11s-3.5 6.5-9 6.5S2 11 2 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <line x1="3.5" y1="18.5" x2="18.5" y2="3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function LoginView() {
  const navigate = useNavigate()
  const { updateTrip, resetTrip } = useTrip()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoLogin, setAutoLogin] = useState(false)

  function validateEmail(value) {
    return value.trim() ? '' : t('login.emailRequired')
  }

  function validatePassword(value) {
    return value ? '' : t('login.passwordRequired')
  }

  const isFormValid = email.trim().length > 0 && password.length > 0

  async function handleLogin() {
    setErrorMessage('')

    const nextFieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    setFieldErrors(nextFieldErrors)
    if (nextFieldErrors.email || nextFieldErrors.password || !isFormValid) return

    setIsSubmitting(true)
    try {
      const res = await apiFetch('/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const detail = data?.detail
        let rawMessage = null
        if (typeof detail === 'string') rawMessage = detail
        else if (detail?.message) rawMessage = detail.message
        else if (Array.isArray(detail) && detail[0]?.msg) rawMessage = detail[0].msg
        // 08 에러 화면 규칙 - 백엔드 detail이 영어 기술 메시지일 수 있어 그대로 노출하지 않음
        setErrorMessage(safeText(rawMessage, t('login.genericError')))
        setIsSubmitting(false)
        return
      }

      if (autoLogin) {
        localStorage.setItem(AUTO_LOGIN_KEY, 'true')
      } else {
        localStorage.removeItem(AUTO_LOGIN_KEY)
      }

      // 로그인할 때마다 브라우저에 남아있던 이전 여행 계획(출발지·숙소·선호 등)을 깨끗하게
      // 지움 - 안 그러면 다른 계정으로 로그인하거나 오래전에 만들다 만 여행이 남아있을 때
      // 그 값들이 새 로그인에서도 그대로 남아 보이는 문제가 있었음
      resetTrip()

      try {
        const [meRes, favRes] = await Promise.all([
          apiFetch('/me'),
          apiFetch('/me/favorite-groups'),
        ])
        const me = meRes.ok ? await meRes.json() : null
        const favoriteGroups = favRes.ok ? await favRes.json() : []
        updateTrip({
          account: {
            email: me?.login_id || email,
            nickname: me?.nickname || '',
          },
          selectedArtists: favoriteGroups.map((g) => ({ id: g.artist_group_no, name: g.group_nm })),
        })
      } catch (e) {
        // 무시
      }

      navigate('/home', { replace: true })
    } catch (e) {
      setErrorMessage(t('login.connectionError'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader showBack={false} showProfile={false} />
        <div className={styles.body}>
          {/* 언어 선택(지구본 아이콘)은 AppHeader의 언어 필("KR ⌄")로 옮김 -
              14_step3_partial_implementation.md 12번 참고 */}

          {/* 브랜드 마크 - 텍스트 로고 (브랜드 폰트 느낌으로 스타일링) */}
          <div className={styles.brandBlock}>
            <span className={`${styles.brandLogoText} notranslate`} translate="no">FAN:GO</span>
            <p className={styles.tagline}>{t('login.tagline')}</p>
          </div>

          {/* 입력 폼 */}
          <div className={styles.formBlock}>
            <input
              className={`${styles.pillInput} ${fieldErrors.email ? styles.inputError : ''}`}
              type="text"
              name="loginfield-email-x92"
              id="loginfield-email-x92"
              autoComplete="off"
              placeholder={t('login.emailPlaceholder')}
              value={email}
              onChange={(e) => {
                setEmail(stripKorean(e.target.value))
                setFieldErrors((prev) => ({ ...prev, email: '' }))
              }}
              onBlur={(e) =>
                setFieldErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }))
              }
            />
            {fieldErrors.email && <p className={styles.error}>{fieldErrors.email}</p>}

            <div className={`${styles.pillInputWithIcon} ${fieldErrors.password ? styles.inputError : ''}`}>
              <input
                className={styles.pillInputBare}
                type={showPassword ? 'text' : 'password'}
                name="loginfield-pw-x92"
                id="loginfield-pw-x92"
                autoComplete="off"
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setFieldErrors((prev) => ({ ...prev, password: '' }))
                }}
                onBlur={(e) =>
                  setFieldErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }))
                }
              />
              <button
                type="button"
                className={styles.eyeToggle}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {fieldErrors.password && <p className={styles.error}>{fieldErrors.password}</p>}

            {/* 로그인 유지 - 비밀번호 입력창 바로 아래 체크박스, 기본값 미체크 */}
            <div className={styles['remember-row']}>
              <label className={styles['checkbox-label']}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={autoLogin}
                  onChange={(e) => setAutoLogin(e.target.checked)}
                />
                {t('auth.keepLoggedIn')}
              </label>
            </div>
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          {/* 06 버튼 규칙 - 비활성 상태는 옅은 톤(--button-bg-disabled)으로 확실히 구분, opacity 사용 금지 */}
          <button
            className={styles.pillPrimaryBtn}
            onClick={handleLogin}
            disabled={isSubmitting || !isFormValid}
            style={
              isSubmitting || !isFormValid
                ? { background: 'var(--button-bg-disabled)', color: '#fff', cursor: 'default' }
                : undefined
            }
          >
            {isSubmitting ? t('login.loggingIn') : t('login.loginButton')}
          </button>

          {/* 아이디 찾기 / 비밀번호 찾기 / 계정 만들기 - PAYCO 하단 링크 스타일 그대로 */}
          <div className={styles.bottomTextRow}>
            {/* TODO: 아이디 찾기·비밀번호 찾기 화면이 아직 없어서 경로 연결 전. 화면 생기면 navigate 추가 */}
            <button type="button" className={styles.textToggle} onClick={() => {}}>
              {t('auth.findId')}
            </button>
            <span className={styles.dotSep}>·</span>
            <button type="button" className={styles.textToggle} onClick={() => {}}>
              {t('auth.findPassword')}
            </button>
            <span className={styles.dotSep}>·</span>
            <button type="button" className={styles.textToggle} onClick={() => navigate('/signup')}>
              {t('login.signupButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
