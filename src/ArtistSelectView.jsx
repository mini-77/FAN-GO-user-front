import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import AppHeader from './AppHeader'
import styles from './ArtistSelectView.module.css'

// 카드 왼쪽 점 색깔 - API에 색상 정보가 없어서 순서대로 돌려가며 씀
const DOT_COLORS = ['#6D57FC', '#FF7AC8', '#9747FF', '#A2E0C1', '#FFA502', '#4FC3F7']

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
    memberCount: memberNames.length > 0 ? `${memberNames.length}인조` : null,
    members: memberNames.join(' · '),
  }
}

// nationality_no, lang_no는 이제 SignupView에서 실제 API 값(GET /nationalities, GET /langs)으로
// 골라서 넘어오기 때문에 여기서 별도 매핑이 필요 없음

export default function ArtistSelectView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
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
        if (!res.ok) throw new Error('아티스트 목록을 불러오지 못했어요.')
        const data = await res.json()
        if (!cancelled) {
          setArtists(data.map(normalizeArtist))
        }
      } catch (e) {
        if (!cancelled) setLoadError('아티스트 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
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
        setSubmitError(message || '가입 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.')
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
      setSubmitError('서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.')
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
          <h1 className={styles.title}>좋아하는 아티스트를 골라주세요</h1>
          <p className={styles.subtitle}>
            고른 팀의 콘서트와 공식 팬미팅만 일정에 올라오고, 성지와 굿즈샵도 그 팀 기준으로
            추천해요. 최대 2팀까지 고를 수 있어요.
          </p>
        </div>

        <div className={styles.section}>
          <div className={styles['section-head']}>
            <span className={styles['section-label']}>팬덤 선택</span>
            <span className={styles['section-count']}>
              {selected.size} / {MAX_SELECTABLE}
            </span>
          </div>

          <div className={styles['artist-list']}>
            {isLoading && <p className={styles.hint}>아티스트 목록을 불러오는 중이에요...</p>}
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
                        <span className={styles['detail-label']}>데뷔</span>
                        <span className={styles['detail-value']}>{artist.debut}</span>
                        <span className={styles['detail-agency']}>{artist.agency}</span>
                      </div>
                      {artist.memberCount && (
                        <div className={styles['detail-row']}>
                          <span className={styles['detail-label']}>멤버</span>
                          <span className={styles['detail-value']}>{artist.memberCount}</span>
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
          </div>
        </div>

        {submitError && <p className={styles.hint} style={{ padding: '0 18px', color: '#E64545' }}>{submitError}</p>}

        <div className={styles.footer}>
          <span className={styles['footer-count']}>{selected.size}팀 선택했어요</span>
          <button
            type="button"
            className={`${styles['btn-primary']} ${!isFormValid || isSubmitting ? styles.disabled : ''}`}
            onClick={handleComplete}
          >
            {isSubmitting ? '가입 중...' : '가입 완료 →'}
          </button>
        </div>
      </div>
    </div>
  )
}
