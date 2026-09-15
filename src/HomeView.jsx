import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch, safeErrorMessage } from './api'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import Icon from './Icon'
import styles from './HomeView.module.css'

// 실제 status 값(진행중/완료/예정) → 화면에 보여줄 라벨/스타일 매핑.
// 디자인 예시에는 "준비 중"(예정)과 "완료" 2개만 나왔는데, 진행중도 있을 수 있어서 추가함.
function statusToLabel(status) {
  if (status === '완료') return '완료'
  if (status === '진행중') return '진행 중'
  return '준비 중' // 예정
}
function statusToKind(status) {
  if (status === '완료') return 'done'
  if (status === '진행중') return 'ongoing'
  return 'upcoming' // 예정
}

function daysUntil(dateIso) {
  const today = new Date()
  const target = new Date(dateIso)
  const diff = Math.round(
    (new Date(target.getFullYear(), target.getMonth(), target.getDate()) -
      new Date(today.getFullYear(), today.getMonth(), today.getDate())) /
      (1000 * 60 * 60 * 24)
  )
  return diff
}

function formatKoreanDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${days[d.getDay()]})`
}

// event_nm이 보통 "[그룹명] 이벤트 상세명" 형식이라 대괄호 부분을 아티스트명으로 분리해서 보여줌.
// ⚠️ 임시 방편: 백엔드 GET /trips 응답에 artist_group_no/group_nm 필드가 추가되면 그걸 바로 쓰는 게 안전함.
function splitArtistFromEventName(eventNm) {
  if (!eventNm) return { artist: '', displayTitle: '' }
  const match = eventNm.match(/^\[(.+?)\]\s*(.*)$/)
  if (match) {
    return { artist: match[1], displayTitle: match[2] || eventNm }
  }
  return { artist: '', displayTitle: eventNm }
}

// 08 리스트 섹션 규칙 — 길이가 정해지지 않은 리스트는 무한스크롤 대신 8~10개씩 "더보기"로 불러옴.
// 예전엔 홈에서 최근 5개만 미리보기로 자르고 "전체 보기"로 HistoryView로 보냈는데, 그러면
// 다른 화면으로 이동해야만 나머지를 볼 수 있어서 불편함 - 홈에서 바로 더보기로 펼치게 바꿈.
const PAGE_SIZE = 8

export default function HomeView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    async function loadTrips() {
      setIsLoading(true)
      setLoadError('')
      try {
        const res = await apiFetch('/trips?tab=all')
        if (res.status === 401) throw new Error('로그인이 만료됐어요. 다시 로그인해주세요.')
        if (!res.ok) throw new Error('일정 목록을 불러오지 못했어요.')
        const data = await res.json()
        if (!cancelled) {
          setTrips(data)
          setVisibleCount(PAGE_SIZE)
        }
      } catch (e) {
        if (!cancelled) setLoadError(safeErrorMessage(e, '일정 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadTrips()
    return () => {
      cancelled = true
    }
  }, [])

  function retry() {
    setTrips([])
    setLoadError('')
    setIsLoading(true)
    ;(async () => {
      try {
        const res = await apiFetch('/trips?tab=all')
        if (res.status === 401) throw new Error('로그인이 만료됐어요. 다시 로그인해주세요.')
        if (!res.ok) throw new Error('일정 목록을 불러오지 못했어요.')
        const data = await res.json()
        setTrips(data)
        setVisibleCount(PAGE_SIZE)
      } catch (e) {
        setLoadError(safeErrorMessage(e, '일정 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
      } finally {
        setIsLoading(false)
      }
    })()
  }

  const upcoming = useMemo(
    () => trips.find((t) => t.status === '예정' || t.status === '진행중'),
    [trips]
  )

  function openTrip(trip) {
    updateTrip({ tripNo: trip.trip_no })
    navigate('/trip/schedule')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        {/* 05 헤더 규칙 - 진입점(홈)은 뒤로가기 없이 로고만 중앙, 메뉴 아이콘은 표시(사용자 요청) */}
        <AppHeader showBack={false} showProfile />

        <div className={styles.body}>
          <h1 className={styles.title}>다가오는 이벤트</h1>

          {/* "새 동선 만들기"를 맨 위로 - 항상 제일 먼저 보이게 */}
          <button type="button" className={styles['new-trip-btn']} onClick={() => navigate('/trip/events')}>
            <div className={styles['new-trip-icon']}>+</div>
            <div className={styles['new-trip-text']}>
              <div className={styles['new-trip-title']}>일정 만들기</div>
              <div className={styles['new-trip-sub']}>아티스트 · 공연을 선택해 동선 시작</div>
            </div>
            <span className={styles['new-trip-chevron']}>›</span>
          </button>

          {isLoading && <p className={styles['load-text']}>불러오는 중이에요...</p>}

          {!isLoading && loadError && (
            <div>
              <p className={styles['load-text']} style={{ color: 'var(--color-danger)' }}>{loadError}</p>
              <button type="button" className={styles['retry-btn']} onClick={retry}>
                다시 시도
              </button>
            </div>
          )}

          {!isLoading && !loadError && upcoming && (
            <div className={styles['hero-card']}>
              <div className={styles['hero-blob-1']} />
              <div className={styles['hero-blob-2']} />
              <div className={styles['hero-content']}>
                <span className={styles['hero-badge']}>
                  {daysUntil(upcoming.start_dt) === 0 ? 'D-DAY' : `D-${daysUntil(upcoming.start_dt)}`}
                </span>
                {(() => {
                  const { artist, displayTitle } = splitArtistFromEventName(upcoming.event_nm)
                  return (
                    <>
                      <div className={styles['hero-title']}>{displayTitle}</div>
                      {artist && <div className={styles['hero-artist']}>{artist}</div>}
                    </>
                  )
                })()}
                <div className={styles['hero-meta-row']}>
                  <Icon name="calendar" size={13} />
                  <span>{formatKoreanDate(upcoming.start_dt)}</span>
                </div>
                <div className={styles['hero-meta-sub']}>
                  {upcoming.event_add} · 동선 {upcoming.place_count}곳 준비됨
                </div>
              </div>
            </div>
          )}

          <div className={styles['section-head']}>
            <span className={styles['section-title']}>내 공연 동선</span>
          </div>

          {!isLoading && !loadError && trips.length === 0 && (
            <div className={styles['empty-state']}>
              <Icon name="folder" size={32} color="#C0BCD8" />
              <p className={styles['load-text']}>아직 등록된 일정이 없어요.</p>
            </div>
          )}

          <div className={styles['trip-list']}>
            {trips.slice(0, visibleCount).map((trip) => {
              const { artist, displayTitle } = splitArtistFromEventName(trip.event_nm)
              return (
                <div key={trip.trip_no} className={styles['trip-row']} onClick={() => openTrip(trip)}>
                  <div className={styles['trip-text']}>
                    <div className={styles['trip-name-row']}>
                      <span className={styles['trip-title']}>{displayTitle}</span>
                      <span className={`${styles['trip-status']} ${styles[statusToKind(trip.status)]}`}>
                        {statusToLabel(trip.status)}
                      </span>
                    </div>
                    {artist && <div className={styles['trip-artist']}>{artist}</div>}
                    <div className={styles['trip-meta']}>{trip.event_add} · 동선 {trip.place_count}곳</div>
                    <div className={styles['trip-date-row']}>
                      <Icon name="calendar" size={13} />
                      <span>{formatKoreanDate(trip.start_dt)}</span>
                    </div>
                  </div>
                  <span className={styles['trip-chevron']}>›</span>
                </div>
              )
            })}
          </div>

          {!isLoading && !loadError && trips.length > visibleCount && (
            <button
              type="button"
              className={styles['load-more-btn']}
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            >
              더보기 <Icon name="chevronDown" size={14} />
            </button>
          )}
        </div>

        <div className={styles.spacer} />
        <BottomNav />
      </div>
    </div>
  )
}
