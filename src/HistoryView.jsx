import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch, safeErrorMessage } from './api'
import { useLanguage } from './LanguageContext'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import Icon from './Icon'
import styles from './HistoryView.module.css'

// 08 리스트 섹션 규칙 — 길이가 정해지지 않은 리스트는 무한스크롤 대신 8~10개씩 "더보기"로 불러옴
const PAGE_SIZE = 8

// status → 표시 라벨/색 종류 (status 자체는 백엔드가 내려주는 한국어 원문 값이라 비교값은 그대로 둠)
function statusToLabel(status, t) {
  if (status === '진행중') return t('history.ongoing')
  if (status === '완료') return t('history.done')
  return t('date.upcomingTrip')
}
function statusToKind(status) {
  if (status === '진행중') return 'ongoing'
  if (status === '완료') return 'done'
  return 'upcoming'
}

const TAB_KEYS = [
  { key: 'common.all', tab: 'all' },
  { key: 'date.pastTrip', tab: 'past' },
  { key: 'date.upcomingTrip', tab: 'upcoming' },
]

export default function HistoryView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  const { t } = useLanguage()
  const TABS = TAB_KEYS.map((item) => ({ label: t(item.key), tab: item.tab }))
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
          throw new Error(t('history.sessionExpired'))
        }
        if (!res.ok) throw new Error(t('history.loadFailed'))
        const data = await res.json()
        if (!cancelled) setTrips(data)
      } catch (e) {
        if (!cancelled) {
          setLoadError(safeErrorMessage(e, t('history.loadFailedRetry')))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadTrips()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  function retryLoad() {
    setLoadError('')
    setIsLoading(true)
    ;(async () => {
      try {
        const res = await apiFetch(`/trips?tab=${activeTab}`)
        if (res.status === 401) throw new Error(t('history.sessionExpired'))
        if (!res.ok) throw new Error(t('history.loadFailed'))
        const data = await res.json()
        setTrips(data)
      } catch (e) {
        setLoadError(safeErrorMessage(e, t('history.loadFailedRetry')))
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
          <h1 className={styles.title}>{t('schedule.mySchedule')}</h1>
        </div>

        <div className={styles['tab-row']}>
          {TABS.map((tabItem) => (
            <button
              key={tabItem.tab}
              type="button"
              className={`${styles['tab-btn']} ${activeTab === tabItem.tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tabItem.tab)}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {isLoading && <p className={styles['empty-hint']}>{t('common.loading')}</p>}

          {!isLoading && loadError && (
            <div className={styles['empty-hint']}>
              <p>{loadError}</p>
              <button type="button" className={styles['retry-btn']} onClick={retryLoad}>
                {t('common.retry')}
              </button>
            </div>
          )}

          {!isLoading && !loadError && filteredTrips.length === 0 && (
            <div className={styles['empty-state']}>
              <Icon name="folder" size={32} color="#C0BCD8" />
              <p className={styles['empty-hint']}>{t('history.empty')}</p>
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
                    {trip.event_add} · {t('history.placeCount')(trip.place_count)}
                    {trip.pace ? ` · ${trip.pace}` : ''}
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
                    {statusToLabel(trip.status, t)}
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
              {t('history.loadMore')} <Icon name="chevronDown" size={14} />
            </button>
          )}

          {/* 하단 고정 바가 아니라 목록의 마지막 항목으로 스크롤에 같이 움직이게 함
              (사용자 요청 - 다른 화면과 동일하게 고정 해제) */}
          <div className={styles.footer} data-bottom-bar="true">
            <button type="button" className={styles['new-btn']} onClick={() => navigate('/trip/events')}>
              {t('schedule.createNewSchedule')}
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}
