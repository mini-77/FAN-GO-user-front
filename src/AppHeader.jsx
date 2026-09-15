import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { useLanguage, SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from './LanguageContext'
import { apiFetch } from './api'
import logoImg from './assets/fango-logo-mark.png'
import Icon from './Icon'
import styles from './AppHeader.module.css'

/**
 * 모든 화면 맨 위에 공통으로 들어가는 헤더.
 * - 왼쪽: 뒤로가기
 * - 가운데: FAN:GO 로고
 * - 오른쪽: 언어 필("KR ⌄") + 프로필(메뉴) 아이콘
 * - 언어 필 클릭 시 언어 선택 목록, 프로필 아이콘 클릭 시 공통 계정 메뉴 표시
 * - 언어 필은 로그인 여부와 무관하게 항상 표시 (11_impact_plan.md 9번 섹션,
 *   요약#1/9/15 - "로그인 여부와 무관하게 헤더 우측 KR 필 위치 항상 고정")
 */
export default function AppHeader({ showBack = true, showProfile = true, onBack, onProfileClick }) {
  const navigate = useNavigate()
  const { tripData, resetTrip } = useTrip()
  const { language, setLanguage, apiLanguages, LANG_NO_TO_CODE } = useLanguage()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const profileAreaRef = useRef(null)
  const langAreaRef = useRef(null)

  // 로그인 전에는 계정 정보(tripData.account)가 없음. 이때는 '사용자' 같은 임의 텍스트로
  // 채우지 않고 빈 칸으로 보여줌 (로그인 여부와 무관하게 항상 뜨는 헤더라서).
  const nickname = tripData.account?.nickname || tripData.account?.email?.split('@')[0] || ''
  const email = tripData.account?.email || ''
  const avatarInitials = nickname ? nickname.slice(0, 2).toUpperCase() : ''
  const isLoggedIn = Boolean(tripData.account?.email)

  function handleBack() {
    if (onBack) onBack()
    else navigate(-1)
  }

  function handleProfile() {
    if (onProfileClick) {
      onProfileClick()
      return
    }
    setIsProfileMenuOpen((prev) => !prev)
  }

  function closeMenu() {
    setIsProfileMenuOpen(false)
  }

  function toggleLangMenu() {
    setIsLangMenuOpen((prev) => !prev)
  }

  function closeLangMenu() {
    setIsLangMenuOpen(false)
  }

  function handleSelectLanguage(code) {
    setLanguage(code)
    closeLangMenu()
  }

  // 언어 필 선택 목록 - 백엔드 /langs가 응답했으면 그 목록(원래 LoginView 지구본
  // 선택기가 쓰던 것)을 우선 쓰고, 아직 못 불러왔거나 실패했으면 클라이언트 번역
  // 목록(SUPPORTED_LANGUAGES) 7개로 대체함.
  const langOptions =
    apiLanguages.length > 0
      ? apiLanguages
          .map((l) => ({ code: LANG_NO_TO_CODE[l.lang_no], label: l.lang_nm }))
          .filter((l) => Boolean(l.code))
      : SUPPORTED_LANGUAGES.map((code) => ({ code, label: LANGUAGE_LABELS[code]?.nativeName || code }))

  function goTo(path) {
    closeMenu()
    navigate(path)
  }

  async function handleLogout() {
    closeMenu()

    // 백엔드에 로그아웃 API가 있으면 세션 종료를 시도하고,
    // 실패하더라도 로그인 화면으로 이동합니다.
    // (예전엔 http://192.168.0.203:8000/signout으로 직접 호출해서 프록시를 안 거쳤는데,
    //  백엔드 IP가 바뀌면 같이 깨지는 문제가 있어 apiFetch로 통일함)
    try {
      await apiFetch('/signout', { method: 'POST' })
    } catch (e) {
      // 네트워크 오류가 있어도 화면 이동은 진행
    }

    // "로그인 유지" 체크로 저장해둔 자동로그인 플래그도 같이 지워야
    // 로그아웃한 다음 앱을 다시 열었을 때 또 자동으로 로그인 시도하지 않음
    localStorage.removeItem('fango_auto_login')

    resetTrip()
    navigate('/login')
  }

  useEffect(() => {
    function handleOutsideClick(event) {
      if (profileAreaRef.current && !profileAreaRef.current.contains(event.target)) {
        closeMenu()
      }
      if (langAreaRef.current && !langAreaRef.current.contains(event.target)) {
        closeLangMenu()
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        closeMenu()
        closeLangMenu()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div className={styles['top-bar']}>
      {showBack ? (
        <button type="button" className={styles['top-bar-btn']} onClick={handleBack} aria-label="뒤로가기">
          <Icon name="back" size={18} color="#fff" />
        </button>
      ) : (
        <span className={styles['top-bar-spacer']} />
      )}

      <img src={logoImg} alt="FAN:GO" className={styles['top-bar-logo-img']} />

      <div className={styles['right-area']}>
        <div className={styles['lang-area']} ref={langAreaRef}>
          <button
            type="button"
            className={styles['lang-pill']}
            onClick={toggleLangMenu}
            aria-label="언어 선택"
            aria-expanded={isLangMenuOpen}
          >
            {LANGUAGE_LABELS[language]?.pill || language.toUpperCase()}
            <span className={styles['lang-pill-caret']} aria-hidden="true">⌄</span>
          </button>

          {isLangMenuOpen && (
            <div className={styles['lang-menu']}>
              {langOptions.map(({ code, label }) => (
                <button
                  type="button"
                  key={code}
                  className={`${styles['lang-item']} ${code === language ? styles['lang-item-active'] : ''}`}
                  onClick={() => handleSelectLanguage(code)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

      {showProfile ? (
        <div className={styles['profile-area']} ref={profileAreaRef}>
          <button
            type="button"
            className={styles['top-bar-btn']}
            onClick={handleProfile}
            aria-label="메뉴"
            aria-expanded={isProfileMenuOpen}
          >
            <Icon name="menu" size={18} color="#fff" />
          </button>

          {isProfileMenuOpen && !onProfileClick && (
            <div className={styles['profile-menu']}>
              {isLoggedIn ? (
                <>
                  <div className={styles['profile-summary']}>
                    <div className={styles['profile-avatar']}>{avatarInitials}</div>
                    <div className={styles['profile-summary-text']}>
                      <strong>{nickname}</strong>
                      <span>{email}</span>
                    </div>
                  </div>

                  <div className={styles['menu-list']}>
                    <button type="button" className={styles['menu-item']} onClick={() => goTo('/account')}>
                      <span className={styles['menu-icon']}><Icon name="person" size={16} color="var(--color-primary-500)" /></span>
                      <span className={styles['menu-copy']}>
                        <strong>마이페이지</strong>
                        <small>프로필 및 계정 관리</small>
                      </span>
                      <span className={styles['menu-arrow']}>›</span>
                    </button>

                    <button type="button" className={styles['menu-item']} onClick={() => goTo('/account')}>
                      <span className={styles['menu-icon']}><Icon name="gear" size={16} color="var(--color-primary-500)" /></span>
                      <span className={styles['menu-copy']}>
                        <strong>환경설정</strong>
                        <small>알림 · 언어 · 테마</small>
                      </span>
                      <span className={styles['menu-arrow']}>›</span>
                    </button>

                    <button type="button" className={styles['menu-item']} onClick={() => goTo('/trip/history')}>
                      <span className={styles['menu-icon']}><Icon name="plane" size={16} color="var(--color-primary-500)" /></span>
                      <span className={styles['menu-copy']}>
                        <strong>여행 히스토리</strong>
                        <small>지난 동선 · 별점</small>
                      </span>
                      <span className={styles['menu-arrow']}>›</span>
                    </button>
                  </div>

                  <div className={styles['menu-divider']} />

                  <button type="button" className={`${styles['menu-item']} ${styles['logout-item']}`} onClick={handleLogout}>
                    <span className={styles['menu-icon']}><Icon name="logout" size={16} color="var(--color-primary-500)" /></span>
                    <span className={styles['menu-copy']}>
                      <strong>로그아웃</strong>
                      <small>현재 세션 종료</small>
                    </span>
                    <span className={styles['menu-arrow']}>›</span>
                  </button>
                </>
              ) : (
                <button type="button" className={styles['menu-item']} onClick={() => goTo('/login')}>
                  <span className={styles['menu-icon']}><Icon name="key" size={16} color="var(--color-primary-500)" /></span>
                  <span className={styles['menu-copy']}>
                    <strong>로그인이 필요해요</strong>
                    <small>로그인하고 계속하기</small>
                  </span>
                  <span className={styles['menu-arrow']}>›</span>
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <span className={styles['top-bar-spacer']} />
      )}
      </div>
    </div>
  )
}
