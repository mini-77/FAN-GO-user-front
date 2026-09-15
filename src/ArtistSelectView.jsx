import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { useLanguage } from './LanguageContext'
import { safeText } from './api'
import AppHeader from './AppHeader'
import styles from './ArtistSelectView.module.css'

// 카드 왼쪽 점 색깔 - API에 색상 정보가 없어서 순서대로 돌려가며 씀
const DOT_COLORS = ['var(--color-primary-500)', '#FF7AC8', '#9747FF', '#A2E0C1', '#FFA502', '#4FC3F7']

// API 응답 하나를 화면에서 쓰기 편한 모양으로 바꿔주는 함수
function normalizeArtist(raw, index) {
  const memberNames = Array.isArray(raw.members)
    ? raw.members.map((m) => (typeof m === 'string' ? m : m.name || m.member_nm)).filter(Boolean)
    : []

  return {
    id: raw.artist_group_no,
    name: raw.group_nm,
    subtitle: raw.fandom_nm,
    dotColor: DOT_COLORS[index % DOT_COLORS.length],
    debut: raw.debut_dt,
    agency: raw.agency,
    memberCount: memberNames.length > 0 ? memberNames.length : null,
    members: memberNames.join(' · '),
  }
}

// nationality_no, lang_no는 이제 SignupView에서 실제 API 값(GET /nationalities, GET /langs)으로
// 골라서 넘어오기 때문에 여기서 별도 매핑이 필요 없음

export default function ArtistSelectView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  const { t } = useLanguage()
  const signupData = tripData.account

  const [selected, setSelected] = useState(new Set())
  const [expandedId, setExpandedId] = useState(null)
  const [artists, setArtists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 계정생성 화면을 안 거치고 이 화면으로 바로 들어온 경우 (새로고침 등) - 앞 화면으로 돌려보냄
  useEffect(() => {
    if (!signupData) {
      navigate('/signup', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadArtists() {
      setIsLoading(true)
      setLoadError('')
      try {
        const res = await fetch('/api/artist-groups', {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to load artist list.')
        const data = await res.json()
        if (!cancelled) {
          setArtists(data.map(normalizeArtist))
        }
      } catch (e) {
        if (!cancelled) setLoadError(t('artistSelect.loadError'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadArtists()
    return () => {
      cancelled = true
    }
  }, [])

  const MAX_SELECTABLE = 2

  function toggleArtist(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        if (expandedId === id) setExpandedId(null)
      } else {
        if (next.size >= MAX_SELECTABLE) return prev // 이미 2팀 선택된 상태면 무시
        next.add(id)
        setExpandedId(id)
      }
      return next
    })
  }

  const isFormValid = selected.size > 0

  async function handleComplete() {
    if (!isFormValid || !signupData || isSubmitting) return
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const signupRes = await fetch('/api/signup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_id: signupData.email,
          login_pw: signupData.password,
          login_pw_confirm: signupData.passwordConfirm,
          nickname: signupData.nickname,
          phone: signupData.phone,
          nationality_no: Number(signupData.nationality),
          lang_no: Number(signupData.selectedLanguage),
          favorite_group_nos: Array.from(selected),
        }),
      })

      if (!signupRes.ok) {
        const data = await signupRes.json().catch(() => null)
        const detail = data?.detail
        const message =
          typeof detail === 'string'
            ? detail
            : detail?.message || (Array.isArray(detail) ? detail[0]?.msg : null)
        // 08 에러 화면 규칙 - Pydantic 검증 메시지(detail[0].msg)는 기본이 영어라서
        // 사용자에게 그대로 보여주면 안 됨 (보안·신뢰 원칙)
        setSubmitError(safeText(message, t('artistSelect.signupError')))
        setIsSubmitting(false)
        return
      }

      // 명세상 가입 성공해도 자동 로그인은 안 되므로, 같은 자격으로 로그인까지 이어서 호출
      const signinRes = await fetch('/api/signin', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_id: signupData.email,
          password: signupData.password,
        }),
      })

      if (!signinRes.ok) {
        // 가입은 됐는데 로그인만 실패한 경우 - 로그인 화면으로 보내서 직접 로그인하게 함
        navigate('/', { replace: true })
        return
      }

      updateTrip({
        selectedArtists: Array.from(selected).map((id) => {
          const found = artists.find((a) => a.id === id)
          return { id, name: found?.name || String(id) }
        }),
      })
      navigate('/signup/success')
    } catch (e) {
      setSubmitError(t('login.connectionError'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader showProfile={false} />
        <div className={styles.header}>
          <div className={styles['header-row']}>
          </div>
          <h1 className={styles.title}>{t('onboarding.selectArtist')}</h1>
          <p className={styles.subtitle}>{t('artistSelect.subtitle')}</p>
        </div>

        <div className={styles.section}>
          <div className={styles['section-head']}>
            <span className={styles['section-label']}>{t('artistSelect.fandomSelect')}</span>
            <span className={styles['section-count']}>
              {selected.size} / {MAX_SELECTABLE}
            </span>
          </div>

          <div className={styles['artist-list']}>
            {isLoading && <p className={styles.hint}>{t('artistSelect.loading')}</p>}
            {!isLoading && loadError && <p className={styles.hint}>{loadError}</p>}
            {!isLoading &&
              !loadError &&
              artists.map((artist) => {
              const isSelected = selected.has(artist.id)
              const isExpanded = expandedId === artist.id && artist.debut
              const isLocked = !isSelected && selected.size >= MAX_SELECTABLE

              return (
                <div
                  key={artist.id}
                  className={`${styles['artist-card']} ${isSelected ? styles.selected : ''} ${isLocked ? styles.locked : ''}`}
                  onClick={() => toggleArtist(artist.id)}
                >
                  <div className={styles['artist-row']}>
                    <div
                      className={styles['artist-dot']}
                      style={{ background: artist.dotColor }}
                    />
                    <div className={styles['artist-text']}>
                      <span className={styles['artist-name']}>{artist.name}</span>
                      <span className={styles['artist-subtitle']}>{artist.subtitle}</span>
                    </div>
                    <span className={styles['artist-check']}>{isSelected ? '✓' : '＋'}</span>
                  </div>

                  {isExpanded && (
                    <div className={styles['artist-detail']}>
                      <div className={styles['detail-row']}>
                        <span className={styles['detail-label']}>{t('artistSelect.debut')}</span>
                        <span className={styles['detail-value']}>{artist.debut}</span>
                        <span className={styles['detail-agency']}>{artist.agency}</span>
                      </div>
                      {artist.memberCount && (
                        <div className={styles['detail-row']}>
                          <span className={styles['detail-label']}>{t('artistSelect.members')}</span>
                          <span className={styles['detail-value']}>{t('artistSelect.memberCountFormat')(artist.memberCount)}</span>
                        </div>
                      )}
                      {artist.members && (
                        <p className={styles['detail-members']}>{artist.members}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* 하단 고정 바가 아니라 목록의 마지막 항목으로 스크롤에 같이 움직이게 함
                (사용자 요청 - 다른 화면과 동일하게 고정 해제) */}
            <div className={styles.footer} data-bottom-bar="true">
              <span className={styles['footer-count']}>{t('artistSelect.selectedCountFormat')(selected.size)}</span>
              <button
                type="button"
                className={`${styles['btn-primary']} ${!isFormValid || isSubmitting ? styles.disabled : ''}`}
                onClick={handleComplete}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? t('artistSelect.signingUp') : t('artistSelect.completeSignup')}
              </button>
            </div>
          </div>
        </div>

        {submitError && <p className={styles.hint} style={{ padding: '0 16px', color: 'var(--color-danger)' }}>{submitError}</p>}
      </div>
    </div>
  )
}
