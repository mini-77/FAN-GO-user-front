import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch } from './api'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import styles from './MyTripView.module.css'

function formatDot(isoDate) {
  return isoDate ? isoDate.replaceAll('-', '.').slice(2) : ''
}

// status(진행중/완료/예정) → 화면에 쓰는 표시 방식 매핑
function statusToKind(status) {
  if (status === '진행중') return 'today'
  return 'other'
}

export default function MyTripView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadTrips() {
      setIsLoading(true)
      setLoadError('')
      try {
        const res = await apiFetch('/trips?tab=all')
        if (res.status === 401) {
          throw new Error('로그인이 만료됐어요. 다시 로그인해주세요.')
        }
        if (!res.ok) throw new Error('여행 목록을 불러오지 못했어요.')
        const data = await res.json()
        if (!cancelled) setTrips(data)
      } catch (e) {
        if (!cancelled) {
          setLoadError(e.message || '여행 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadTrips()
    return () => {
      cancelled = true
    }
  }, [])

  // 정책: 평가는 한 여행당 딱 1번. 예전엔 "완료" 상태(끝난 다음날 이후)에만 유도했는데,
  // 그러면 사용자가 여행 다 끝나고 나서는 앱을 잘 안 켜서 놓치기 쉬움. 그래서 "오늘이
  // 마지막날"이기만 해도(아직 진행중이어도) 미리 유도하도록 앞당김.
  // 평가를 낸다고 해서 이미 짜여진 동선이 바뀌는 건 아님 (순수 소감 남기기 + 다음 여행 추천 참고용).
  const now = new Date()
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const tripNeedingFeedback = trips.find(
    (t) => t.rating == null && (t.status === '완료' || t.end_dt === todayIso)
  )

  // 목록에서 여행을 클릭하면, 그 여행의 tripNo를 "지금 보는 여행"으로 지정한 다음 이동.
  // (예전엔 뭘 눌러도 그냥 /trip/schedule로만 가서, 항상 tripData.tripNo에 저장된
  // 여행 하나만 보여주는 버그가 있었음 - 지난 여행 A를 눌러도 B를 눌러도 똑같이 보였음)
  function openTrip(trip) {
    updateTrip({ tripNo: trip.trip_no })
    navigate('/trip/schedule')
  }

  function retry() {
    setTrips([])
    setLoadError('')
    setIsLoading(true)
    // useEffect의 loadTrips는 마운트 시 1번만 도는 구조라, 재시도는 상태만 리셋하고
    // 아래에서 다시 직접 호출해줌
    ;(async () => {
      try {
        const res = await apiFetch('/trips?tab=all')
        if (res.status === 401) {
          throw new Error('로그인이 만료됐어요. 다시 로그인해주세요.')
        }
        if (!res.ok) throw new Error('여행 목록을 불러오지 못했어요.')
        const data = await res.json()
        setTrips(data)
      } catch (e) {
        setLoadError(e.message || '여행 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
      } finally {
        setIsLoading(false)
      }
    })()
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.header}>
          <div className={styles['header-row']}></div>
          <h1 className={styles.title}>저장한 동선</h1>
        </div>

        <div>
          {isLoading && <p className={styles['empty-hint']}>불러오는 중이에요...</p>}
          {!isLoading && loadError && (
            <div className={styles['empty-hint']}>
              <p>{loadError}</p>
              <button type="button" className={styles['evaluate-btn']} onClick={retry} style={{ marginTop: 10 }}>
                다시 시도
              </button>
            </div>
          )}
          {!isLoading && !loadError && trips.length === 0 && (
            <p className={styles['empty-hint']}>아직 저장한 여행이 없어요.</p>
          )}
          {!isLoading &&
            !loadError &&
            trips.map((t) => (
              <div
                key={t.trip_no}
                className={styles['day-row']}
                onClick={() => openTrip(t)}
              >
                <div>
                  <div className={styles['day-name']}>{t.event_nm}</div>
                  <div className={styles['day-meta']}>
                    {formatDot(t.start_dt)} — {formatDot(t.end_dt)} · {t.place_count}곳
                    {t.rating ? ` · ★${t.rating}` : ''}
                  </div>
                </div>
                <span className={`${styles['day-status']} ${styles[statusToKind(t.status)]}`}>
                  {t.status}
                </span>
              </div>
            ))}
        </div>

        <div className={styles.spacer}>
          {tripNeedingFeedback && (
            <div className={styles['evaluate-section']}>
              <p className={styles['evaluate-text']}>
                {tripNeedingFeedback.event_nm} 여행을 평가해보세요. 다음 여행 추천에 참고가 돼요.
              </p>
              <button
                type="button"
                className={styles['evaluate-btn']}
                onClick={() => {
                  updateTrip({ tripNo: tripNeedingFeedback.trip_no })
                  navigate('/trip/feedback')
                }}
              >
                여행 평가하기
              </button>
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    </div>
  )
}
