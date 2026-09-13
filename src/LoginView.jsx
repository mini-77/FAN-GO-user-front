import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { useLanguage } from './LanguageContext'
import { apiFetch } from './api'
import AppHeader from './AppHeader'
import styles from './LoginView.module.css'

// 백엔드 /langs가 내려주는 lang_no <-> 앱에서 쓰는 언어 코드 매핑.
const LANG_NO_TO_CODE = {
  1: 'ko',
  2: 'en',
  3: 'ja',
}

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

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="11" cy="11" rx="3.4" ry="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 11h16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export default function LoginView() {
  const navigate = useNavigate()
  const { updateTrip } = useTrip()
  const { t, setLanguage: setAppLanguage } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [languages, setLanguages] = useState([])
  const [langNo, setLangNo] = useState(null)
  const [autoLogin, setAutoLogin] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadLangs() {
      try {
        const res = await apiFetch('/langs')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) {
          setLanguages(data)
          if (data.length > 0) {
            setLangNo(data[0].lang_no)
            const code = LANG_NO_TO_CODE[data[0].lang_no]
            if (code) setAppLanguage(code)
          }
        }
      } catch (e) {
        // 무시
      }
    }
    loadLangs()
    return () => {
      cancelled = true
    }
  }, [setAppLanguage])

  function handleLangChange(nextLangNo) {
    setLangNo(nextLangNo)
    const code = LANG_NO_TO_CODE[nextLangNo]
    if (code) setAppLanguage(code)
  }

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
        let message = t('login.genericError')
        if (typeof detail === 'string') message = detail
        else if (detail?.message) message = detail.message
        else if (Array.isArray(detail) && detail[0]?.msg) message = detail[0].msg
        setErrorMessage(message)
        setIsSubmitting(false)
        return
      }

      if (autoLogin) {
        localStorage.setItem(AUTO_LOGIN_KEY, 'true')
      } else {
        localStorage.removeItem(AUTO_LOGIN_KEY)
      }

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

      navigate('/trip/events', { replace: true })
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
          {/* 상단: 언어 선택(지구본 아이콘) - 오른쪽 정렬 */}
          <div className={styles['top-bar']}>
            <div className={styles.langButtonWrap}>
              <div className={styles.globeIconBtn} aria-hidden="true">
                <GlobeIcon />
              </div>
              <select
                className={styles.langSelectOverlay}
                value={langNo ?? ''}
                onChange={(e) => handleLangChange(Number(e.target.value))}
                aria-label="언어 선택"
              >
                {languages.map((lang) => (
                  <option key={lang.lang_no} value={lang.lang_no}>
                    {lang.lang_nm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 브랜드 마크 - 텍스트 로고 (브랜드 폰트 느낌으로 스타일링) */}
          <div className={styles.brandBlock}>
            <span className={styles.brandLogoText}>FAN:GO</span>
            <p className={styles.tagline}>나만의 성지순례, 지금 시작해요</p>
          </div>

          {/* 입력 폼 */}
          <div className={styles.formBlock}>
            <input
              className={styles.pillInput}
              type="text"
              name="loginfield-email-x92"
              id="loginfield-email-x92"
              autoComplete="off"
              placeholder="이메일 주소"
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

            <div className={styles.pillInputWithIcon}>
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
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
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
                로그인 유지
              </label>
            </div>
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <button
            className={styles.pillPrimaryBtn}
            onClick={handleLogin}
            disabled={isSubmitting || !isFormValid}
            style={isSubmitting || !isFormValid ? { opacity: 0.5, cursor: 'default' } : undefined}
          >
            {isSubmitting ? t('login.loggingIn') : t('login.loginButton')}
          </button>

          {/* 아이디 찾기 / 비밀번호 찾기 / 계정 만들기 - PAYCO 하단 링크 스타일 그대로 */}
          <div className={styles.bottomTextRow}>
            {/* TODO: 아이디 찾기·비밀번호 찾기 화면이 아직 없어서 경로 연결 전. 화면 생기면 navigate 추가 */}
            <button type="button" className={styles.textToggle} onClick={() => {}}>
              아이디 찾기
            </button>
            <span className={styles.dotSep}>·</span>
            <button type="button" className={styles.textToggle} onClick={() => {}}>
              비밀번호 찾기
            </button>
            <span className={styles.dotSep}>·</span>
            <button type="button" className={styles.textToggle} onClick={() => navigate('/signup')}>
              {t('login.signupButton') || '회원가입'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
