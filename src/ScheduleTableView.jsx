import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch, safeErrorMessage } from './api'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import PlaceDetailModal from './PlaceDetailModal'
import LocationSearchModal from './LocationSearchModal'
import styles from './ScheduleTableView.module.css'

// 그 날짜 "밤"에 묵는 숙소 찾기 (checkIn <= date < checkOut)
// TripDateView에서 여행 전체 기간의 숙소를 미리 다 받아두기 때문에, 정확한 날짜 매칭만으로 충분함
function findStayForNight(stays, date) {
  return stays.find((s) => s.checkIn <= date && date < s.checkOut)
}

function addDays(iso, n) {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  // toISOString()은 UTC 변환 과정에서 날짜가 하루 당겨질 수 있어서, 로컬 값 그대로 조립함.
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// business_hours: {has_data, is_closed, open_tm, close_tm} | null - 3단계 규칙 그대로 표시
function formatBusinessHours(businessHours) {
  if (!businessHours || !businessHours.has_data) return '영업시간 정보없음'
  if (businessHours.is_closed) return '오늘 휴무'
  return `오픈 ${businessHours.open_tm} 마감 ${businessHours.close_tm}`
}

function formatDateRange(startIso, endIso) {
  if (!startIso || !endIso) return ''
  const s = startIso.slice(5).replace('-', '.')
  const e = endIso.slice(5).replace('-', '.')
  return `${s} — ${e}`
}

export default function ScheduleTableView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  const { startDate, endDate } = tripData.tripDates || {}
  const stays = tripData.stays || []
  const totalDays =
    startDate && endDate
      ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1)
      : 3

  const [activeDay, setActiveDay] = useState(1)
  const [routesByDay, setRoutesByDay] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const tripNo = tripData.tripNo
  const activeDate = startDate ? addDays(startDate, activeDay - 1) : null

  useEffect(() => {
    if (!tripNo) {
      setIsLoading(false)
      setLoadError('여행 정보를 찾을 수 없어요. 앞 단계부터 다시 진행해주세요.')
      return
    }
    if (routesByDay[activeDay] !== undefined) {
      setIsLoading(false)
      setLoadError('')
      return
    }

    let cancelled = false
    async function loadRoutes() {
      setIsLoading(true)
      setLoadError('')
      try {
        const res = await apiFetch(`/trips/${tripNo}/routes?visit_day=${activeDay}`)
        if (res.status === 401) throw new Error('로그인이 만료됐어요. 다시 로그인해주세요.')
        if (res.status === 403) throw new Error('본인의 여행이 아니에요.')
        if (res.status === 404) throw new Error('존재하지 않는 여행이에요.')
        if (!res.ok) throw new Error('일정을 불러오지 못했어요.')
        const data = await res.json()
        const dayRoute = Array.isArray(data) && data.length > 0 ? data[0] : null
        if (!cancelled) setRoutesByDay((prev) => ({ ...prev, [activeDay]: dayRoute }))
      } catch (e) {
        if (!cancelled) setLoadError(safeErrorMessage(e, '일정을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadRoutes()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay, tripNo])

  function retry() {
    setRoutesByDay((prev) => {
      const next = { ...prev }
      delete next[activeDay]
      return next
    })
  }

  const dayRoute = routesByDay[activeDay]
  const events = dayRoute?.events ? [...dayRoute.events].sort((a, b) => a.seq - b.seq) : []
  const mainEventNo = tripData.selectedEvent?.event_no

  // 이 날짜의 출발지점/도착지점 계산 우선순위:
  // - 도착지(그 날 밤 묵는 곳): dayOverride(사용자가 직접 지정) → (마지막날이면) 전체 여행
  //   완료지(tripData.arrival) → 그 외엔 그 날짜에 체크인 중인 숙소로 자동 매칭
  // - 출발지(그 날 아침 나서는 곳): dayOverride → (1일차면) 전체 여행 출발지(tripData.departure) →
  //   그 외엔 "전날 밤 묵은 숙소"를 그대로 이어받음
  // TripDateView에서 여행 전체 기간의 숙소를 미리 다 입력받기 때문에, 이 값들은 항상
  // 자동으로 채워져 있어야 정상이고, "위치변경"은 그 자동값을 사용자가 바꾸고 싶을 때만 씀.
  const isFirstDay = activeDay === 1
  const isLastDay = activeDay === totalDays
  const dayOverride = activeDate ? tripData.dayLocationOverrides?.[activeDate] : null

  const arrivalPlace = dayOverride?.arrival
    ? dayOverride.arrival
    : isLastDay
      ? tripData.arrival || findStayForNight(stays, activeDate)
      : findStayForNight(stays, activeDate)

  const previousDate = !isFirstDay && startDate ? addDays(startDate, activeDay - 2) : null
  const departurePlace = dayOverride?.departure
    ? dayOverride.departure
    : isFirstDay
      ? tripData.departure
      : (tripData.dayLocationOverrides?.[previousDate]?.arrival || findStayForNight(stays, previousDate))

  const [selectedPlace, setSelectedPlace] = useState(null) // {eventNo, tripRouteEventNo, liked, businessHours} | null

  function openPlace(ev) {
    setSelectedPlace({
      eventNo: ev.event_no,
      tripRouteEventNo: ev.trip_route_event_no,
      liked: ev.liked,
      businessHours: ev.business_hours,
    })
  }

  // "위치변경" 버튼 - 예전엔 삭제된 StaySearchView 라우트로 이동했었음(깨진 링크였음).
  // TripDateView.jsx의 출발지/완료지 "수정" 팝업과 동일한 지도검색 팝업(LocationSearchModal)을
  // 그 자리에서 바로 띄우도록 수정함.
  // 1일차 출발/마지막날 도착이면 tripData.departure/arrival에 바로 저장,
  // 중간 날짜면 그 날짜의 dayLocationOverrides에 저장.
  const [editingLocation, setEditingLocation] = useState(null) // { field: 'departure'|'arrival', isOverall, currentPlace } | null

  function goEditLocation(field) {
    const isOverall = (field === 'departure' && isFirstDay) || (field === 'arrival' && isLastDay)
    const currentPlace = field === 'departure' ? departurePlace : arrivalPlace
    setEditingLocation({ field, isOverall, currentPlace })
  }

  function confirmEditLocation(place) {
    if (!editingLocation) return
    const { field, isOverall } = editingLocation
    if (isOverall) {
      updateTrip({ [field]: place })
    } else {
      const prevOverrides = tripData.dayLocationOverrides || {}
      updateTrip({
        dayLocationOverrides: {
          ...prevOverrides,
          [activeDate]: { ...prevOverrides[activeDate], [field]: place },
        },
      })
    }
    setEditingLocation(null)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.header}>
          <h1 className={styles.title}>
            여행 일정
            <br />
            <span className={styles.date}>{formatDateRange(startDate, endDate)}</span>
          </h1>
        </div>

        <div className={styles['day-tabs']}>
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              type="button"
              className={`${styles['day-tab']} ${activeDay === d ? styles.active : ''}`}
              onClick={() => setActiveDay(d)}
            >
              {d}일
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {/* 출발지점 - 값이 없어도 항상 표시(미정 상태로), 위치변경으로 지정하게 함 */}
          <div className={styles['place-row']}>
            <span className={styles['place-tag']}>출발 지점</span>
            <div className={styles['place-text']}>
              <span className={styles['place-name']}>{departurePlace ? departurePlace.name : '아직 안 정했어요'}</span>
              {departurePlace && <span className={styles['place-sub']}>{departurePlace.address}</span>}
            </div>
            <button
              type="button"
              className={styles['place-edit-btn']}
              onClick={() => goEditLocation('departure')}
            >
              위치변경
            </button>
          </div>

          {isLoading && <div className={styles['empty-day']}>일정을 불러오는 중이에요...</div>}

          {/* 08 부분 영역 에러 - 출발/도착 지점 행은 정상 표시 유지, 실패한 구역만 회색 박스로 */}
          {!isLoading && loadError && (
            <div className={styles['partial-error']}>
              <p className={styles['partial-error-text']}>{loadError}</p>
              <button type="button" className={styles['partial-error-retry']} onClick={retry}>
                다시 시도
              </button>
            </div>
          )}

          {!isLoading && !loadError && events.length === 0 && (
            <div className={styles['empty-day']}>이 날짜는 아직 동선이 만들어지지 않았어요.</div>
          )}

          {!isLoading &&
            !loadError &&
            events.map((ev) => {
              const isPinned = ev.event_no === mainEventNo
              return (
                <div
                  key={ev.trip_route_event_no}
                  className={`${styles['event-row']} ${isPinned ? styles.pinned : ''}`}
                  onClick={() => openPlace(ev)}
                >
                  <div className={styles['event-text']}>
                    <span className={styles['event-name']}>{ev.event_nm}</span>
                    <span className={styles['event-sub']}>{isPinned ? '시간 고정' : '장소 정보'}</span>
                  </div>
                  {isPinned ? (
                    <div className={styles['event-time-block']}>
                      <span className={styles['event-time-label']}>시작</span>
                      <span className={styles['event-time-big']}>
                        {ev.fixed_schedule?.start_tm || '--:--'}
                      </span>
                    </div>
                  ) : (
                    <span className={styles['event-hours']}>{formatBusinessHours(ev.business_hours)}</span>
                  )}
                </div>
              )
            })}

          {/* 도착지점 - 값이 없어도 항상 표시(미정 상태로), 위치변경으로 지정하게 함 */}
          <div className={styles['place-row']}>
            <span className={styles['place-tag']}>도착 지점</span>
            <div className={styles['place-text']}>
              <span className={styles['place-name']}>{arrivalPlace ? arrivalPlace.name : '아직 안 정했어요'}</span>
              {arrivalPlace && <span className={styles['place-sub']}>{arrivalPlace.address}</span>}
            </div>
            <button
              type="button"
              className={styles['place-edit-btn']}
              onClick={() => goEditLocation('arrival')}
            >
              위치변경
            </button>
          </div>
        </div>

        {isLastDay && (
          <div className={styles['feedback-banner']} onClick={() => navigate('/trip/feedback')}>
            <span className={styles['feedback-banner-text']}>
              오늘이 마지막 날이에요! 여행 다 끝나기 전에 미리 평가하러 가볼까요?
            </span>
            <span className={styles['feedback-banner-arrow']}>›</span>
          </div>
        )}

        <div className={styles.spacer} />

        <div className={styles['action-row']} data-bottom-bar="true">
          <button
            type="button"
            className={styles['btn-outline']}
            onClick={() => navigate('/trip/itinerary', { state: { visitDay: activeDay } })}
          >
            동선보기
          </button>
          <button
            type="button"
            className={styles['btn-outline']}
            onClick={() => navigate('/trip/itinerary/edit', { state: { visitDay: activeDay } })}
          >
            동선 수정
          </button>
          <button type="button" className={styles['btn-primary']} onClick={() => navigate('/trip/my')}>
            확인
          </button>
        </div>

        <BottomNav />
      </div>

      {selectedPlace && (
        <PlaceDetailModal
          eventNo={selectedPlace.eventNo}
          tripRouteEventNo={selectedPlace.tripRouteEventNo}
          liked={selectedPlace.liked}
          businessHours={selectedPlace.businessHours}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {editingLocation && (
        <LocationSearchModal
          title={editingLocation.field === 'departure' ? '출발지 검색' : '완료지 검색'}
          initialPlace={editingLocation.currentPlace || null}
          onConfirm={confirmEditLocation}
          onClose={() => setEditingLocation(null)}
        />
      )}
    </div>
  )
}
