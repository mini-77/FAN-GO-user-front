import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch, safeErrorMessage } from './api'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import Icon from './Icon'
import styles from './HistoryView.module.css'

const TABS = [
  { label: '전체', tab: 'all' },
  { label: '지난 여행', tab: 'past' },
  { label: '예정', tab: 'upcoming' },
]

// 08 리스트 섹션 규칙 — 길이가 정해지지 않은 리스트는 무한스크롤 대신 8~10개씩 "더보기"로 불러옴
const PAGE_SIZE = 8

// status → 표시 라벨/색 종류
function statusToLabel(status) {
  if (status === '진행중') return '진행 중'
  if (status === '완료') return '완료'
  return '예정'
}
function statusToKind(status) {
  if (status === '진행중') return 'ongoing'
  if (status === '완료') return 'done'
  return 'upcoming'
}

export default function HistoryView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  const [activeTab, setActiveTab] = useState('all')
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    setVisibleCount(PAGE_SIZE)

    async function loadTrips() {
      setIsLoading(true)
      setLoadError('')
      try {
        const res = await apiFetch(`/trips?tab=${activeTab}`)
        if (res.status === 401) {
          throw new Error('로그인이 만료됐어요. 다시 로그인해주세요.')
        }
        if (!res.ok) throw new Error('여행 목록을 불러오지 못했어요.')
        const data = await res.json()
        if (!cancelled) setTrips(data)
      } catch (e) {
        if (!cancelled) {
          setLoadError(safeErrorMessage(e, '여행 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadTrips()
    return () => {
      cancelled = true
    }
  }, [activeTab])

  function retryLoad() {
    setLoadError('')
    setIsLoading(true)
    ;(async () => {
      try {
        const res = await apiFetch(`/trips?tab=${activeTab}`)
        if (res.status === 401) throw new Error('로그인이 만료됐어요. 다시 로그인해주세요.')
        if (!res.ok) throw new Error('여행 목록을 불러오지 못했어요.')
        const data = await res.json()
        setTrips(data)
      } catch (e) {
        setLoadError(safeErrorMessage(e, '여행 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
      } finally {
        setIsLoading(false)
      }
    })()
  }

  // 실제 API가 이미 tab 기준으로 걸러서 줌
  const filteredTrips = trips

  function openTrip(trip) {
    updateTrip({ tripNo: trip.trip_no })
    navigate('/trip/schedule')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.header}>
          <h1 className={styles.title}>나의 일정</h1>
        </div>

        <div className={styles['tab-row']}>
          {TABS.map((t) => (
            <button
              key={t.tab}
              type="button"
              className={`${styles['tab-btn']} ${activeTab === t.tab ? styles.active : ''}`}
              onClick={() => setActiveTab(t.tab)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {isLoading && <p className={styles['empty-hint']}>불러오는 중이에요...</p>}

          {!isLoading && loadError && (
            <div className={styles['empty-hint']}>
              <p>{loadError}</p>
              <button type="button" className={styles['retry-btn']} onClick={retryLoad}>
                다시 시도
              </button>
            </div>
          )}

          {!isLoading && !loadError && filteredTrips.length === 0 && (
            <div className={styles['empty-state']}>
              <Icon name="folder" size={32} color="#C0BCD8" />
              <p className={styles['empty-hint']}>아직 만든 일정이 없어요.</p>
            </div>
          )}

          {!isLoading &&
            !loadError &&
            filteredTrips.slice(0, visibleCount).map((trip) => (
              <div
                key={trip.trip_no}
                className={`${styles['trip-row']} ${trip.status === '진행중' ? styles.ongoingRow : ''}`}
                onClick={() => openTrip(trip)}
              >
                <div className={styles['trip-date-col']}>
                  <span className={styles['trip-year']}>{trip.start_dt?.slice(0, 4)}</span>
                  <span className={styles['trip-md']}>
                    {trip.start_dt?.slice(5).replace('-', '.')} — {trip.end_dt?.slice(5).replace('-', '.')}
                  </span>
                </div>
                <div className={styles['trip-body']}>
                  <span className={styles['trip-title']}>{trip.event_nm}</span>
                  <span className={styles['trip-meta']}>
                    {trip.event_add} · {trip.place_count}곳{trip.pace ? ` · ${trip.pace}` : ''}
                  </span>
                  {trip.placePreview && (
                    <span className={styles['trip-preview']}>{trip.placePreview}</span>
                  )}
                </div>
                <div className={styles['trip-side']}>
                  <span className={styles['trip-rating']}>
                    {trip.rating ? `★ ${trip.rating}` : '—'}
                  </span>
                  <span className={`${styles['trip-status']} ${styles[statusToKind(trip.status)]}`}>
                    {statusToLabel(trip.status)}
                  </span>
                </div>
              </div>
            ))}

          {!isLoading && !loadError && filteredTrips.length > visibleCount && (
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

        <div className={styles.footer} data-bottom-bar="true">
          <button type="button" className={styles['new-btn']} onClick={() => navigate('/trip/events')}>
            일정 만들기
          </button>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}
