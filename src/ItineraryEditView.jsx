import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch, safeErrorMessage, safeText } from './api'
import AppHeader from './AppHeader'
import { scoreColor } from './scoreColor'
import styles from './ItineraryEditView.module.css'

// 두 좌표 사이 직선거리(km) - Haversine 공식. AL-02 문서 S0 SQL 쿼리랑 같은 방식.
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// 그 날짜 "밤"에 묵는 숙소 찾기 (checkIn <= date < checkOut) - 그날의 도착지점 후보
function findStayForNight(stays, date) {
  return stays.find((s) => s.checkIn <= date && date < s.checkOut)
}
// 그 날짜 아침에 체크아웃하는 숙소 찾기 (checkOut === date) - 그날의 출발지점 후보
function findStayCheckingOutOn(stays, date) {
  return stays.find((s) => s.checkOut === date)
}

function addDays(iso, n) {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function ItineraryEditView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tripData, updateTrip } = useTrip()
  // ScheduleTableView 등에서 "이 날짜 동선 고치기"로 들어올 때 넘겨줘야 함:
  // navigate('/trip/itinerary/edit', { state: { visitDay: 2 } })
  const visitDay = location.state?.visitDay || 1

  const [stops, setStops] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [expandedNum, setExpandedNum] = useState(null)
  const [candidatesByEventNo, setCandidatesByEventNo] = useState({}) // { [event_no]: {status, list} }
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [myLocation, setMyLocation] = useState(null) // { lat, lon } | null

  // 지금 내 위치 - 허용 안 하거나 실패해도 화면은 그냥 거리 없이 보여주면 됨
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setMyLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setMyLocation(null),
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }, [])

  const tripNo = tripData.tripNo
  const mainEventNo = tripData.selectedEvent?.event_no
  const stays = tripData.stays || []
  const { startDate, endDate } = tripData.tripDates || {}
  const totalDays =
    startDate && endDate
      ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1)
      : 1
  const activeDate = startDate ? addDays(startDate, visitDay - 1) : null
  const isFirstDay = visitDay === 1
  const isLastDay = visitDay === totalDays

  // 출발지점: 1일차는 사용자가 지정한 전체 출발지, 그 외엔 그날 아침 체크아웃하는 숙소
  // 도착지점: 마지막날은 사용자가 지정한 전체 도착지, 그 외엔 그날 밤 묵는 숙소
  const departurePlace = isFirstDay
    ? tripData.departure
    : activeDate
      ? findStayCheckingOutOn(stays, activeDate)
      : null
  const arrivalPlace = isLastDay
    ? tripData.arrival
    : activeDate
      ? findStayForNight(stays, activeDate)
      : null

  // 이 날짜의 relevance(추천 점수)는 GET /trips/{tripNo}/routes에는 없고,
  // ConfirmView에서 AL-02 생성 직후 받아둔 tripData.generatedDays에만 있음.
  // 참고용으로만 매칭해서 보여주고, 못 찾으면 점수는 그냥 숨김(가짜 숫자로 채우지 않음).
  const relevanceByEventNo = {}
  const generatedDay = (tripData.generatedDays || []).find((d) => d.visit_day === visitDay)
  if (generatedDay) {
    generatedDay.schedule.forEach((s) => {
      relevanceByEventNo[s.event_no] = s.relevance
    })
  }

  // 08 부분 영역 에러 규칙 - 화면 진입 자체가 안 되는 경우(tripNo 없음)가 아니라
  // 목록 조회만 실패한 경우엔 "다시 시도"로 이 목록 부분만 다시 불러올 수 있게 함
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (!tripNo) {
      setIsLoading(false)
      setLoadError('여행 정보를 찾을 수 없어요. 확인 화면부터 다시 진행해주세요.')
      return
    }

    let cancelled = false
    async function loadDay() {
      setIsLoading(true)
      setLoadError('')
      try {
        const routesRes = await apiFetch(`/trips/${tripNo}/routes?visit_day=${visitDay}`)
        if (!routesRes.ok) throw new Error('동선을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
        const data = await routesRes.json()
        const dayRoute = Array.isArray(data) && data.length > 0 ? data[0] : null
        const events = (dayRoute?.events || []).slice().sort((a, b) => a.seq - b.seq)

        if (events.length === 0) {
          if (!cancelled) {
            setStops([])
            setIsLoading(false)
          }
          return
        }

        // 장소 이름 말고 시간대·주소 같은 상세 정보는 GET /events/{event_no}에서 따로 받아야 함
        const detailed = await Promise.all(
          events.map(async (ev) => {
            let address = ''
            let lat = null
            let lon = null
            try {
              const evRes = await apiFetch(`/events/${ev.event_no}`)
              if (evRes.ok) {
                const detail = await evRes.json()
                address = detail.add || ''
                lat = detail.event_lat ?? null
                lon = detail.event_lon ?? null
              }
            } catch (e) {
              // 상세 정보 못 받아도 이름/순서는 이미 있으니 계속 진행
            }
            return {
              num: ev.seq,
              tripRouteEventNo: ev.trip_route_event_no,
              event_no: ev.event_no,
              name: ev.event_nm,
              address,
              lat,
              lon,
              pinned: ev.event_no === mainEventNo,
              // 고정(공연) 항목은 교체 대상이 아니라서 추천 점수도 의미 없음 - 아예 안 보여줌
              score: ev.event_no === mainEventNo
                ? null
                : relevanceByEventNo[ev.event_no] != null
                  ? Math.round(relevanceByEventNo[ev.event_no] * 100)
                  : null,
            }
          })
        )

        if (!cancelled) {
          setStops(detailed)
          setIsLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(safeErrorMessage(e, '동선을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
          setIsLoading(false)
        }
      }
    }
    loadDay()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripNo, visitDay, retryKey])

  function retryLoadDay() {
    setLoadError('')
    setRetryKey((k) => k + 1)
  }

  function toggleStop(stop) {
    setExpandedNum((prev) => (prev === stop.num ? null : stop.num))
    // 이미 불러온 적 있으면 다시 안 부름
    if (candidatesByEventNo[stop.event_no]) return

    setCandidatesByEventNo((prev) => ({ ...prev, [stop.event_no]: { status: 'loading', list: [] } }))
    apiFetch(`/trips/${tripNo}/routes/${stop.event_no}/alternatives?visit_day=${visitDay}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('교체 후보를 불러오지 못했어요.')
        const list = await res.json()
        setCandidatesByEventNo((prev) => ({ ...prev, [stop.event_no]: { status: 'ok', list } }))
      })
      .catch(() => {
        setCandidatesByEventNo((prev) => ({ ...prev, [stop.event_no]: { status: 'error', list: [] } }))
      })
  }

  // 후보를 고르면 그 칸의 event_no/이름만 바꿔치기 (순서·다른 칸은 그대로)
  function swapStop(stopNum, candidate) {
    setStops((prev) =>
      prev.map((s) =>
        s.num === stopNum
          ? {
              ...s,
              event_no: candidate.event_no,
              name: candidate.event_nm,
              address: '', // 교체 직후엔 상세 주소를 아직 안 받았음 - 저장 후 다시 불러오면 채워짐
              score: candidate.relevance != null ? Math.round(candidate.relevance * 100) : null,
            }
          : s
      )
    )
    setExpandedNum(null)
  }

  async function handleSave() {
    setSaveError('')

    if (!tripNo) {
      setSaveError('여행 정보를 찾을 수 없어요. 확인 화면부터 다시 진행해주세요.')
      return
    }
    if (stops.length === 0) {
      setSaveError('이 날짜엔 저장할 동선이 없어요.')
      return
    }

    setIsSaving(true)
    try {
      // 교체된 칸은 stops의 event_no가 이미 새 값으로 바뀌어 있어서, 그대로 저장하면 반영됨.
      const editedDayRoutes = stops.map((stop) => ({ visit_day: visitDay, event_no: stop.event_no }))

      let allRoutes = editedDayRoutes
      const method = tripData.routesSaved ? 'PUT' : 'POST'

      if (method === 'PUT') {
        // PUT /trip-routes는 이 trip_no의 "전체 일정"을 매번 통째로 보내야 함.
        // 지금 편집한 날짜만 보내면 다른 날짜(visit_day)의 동선이 전부 삭제돼버림.
        const currentRes = await apiFetch(`/trips/${tripNo}/routes`)
        if (!currentRes.ok) {
          throw new Error('기존 동선을 불러오지 못해서 저장을 진행할 수 없어요. 잠시 후 다시 시도해주세요.')
        }
        const currentData = await currentRes.json()
        const otherDaysRoutes = (currentData || [])
          .filter((day) => day.visit_day !== visitDay)
          .flatMap((day) => (day.events || []).map((ev) => ({ visit_day: day.visit_day, event_no: ev.event_no })))
        allRoutes = [...otherDaysRoutes, ...editedDayRoutes]
      }

      const res = await apiFetch('/trip-routes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_no: tripNo,
          routes: allRoutes,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const detail = data?.detail
        let rawMessage = null
        if (typeof detail === 'string') rawMessage = detail
        else if (detail?.message) rawMessage = detail.message
        else if (Array.isArray(detail) && detail[0]?.msg) rawMessage = detail[0].msg
        // 08 에러 화면 규칙 - 백엔드 detail이 영어 기술 메시지일 수 있어 그대로 노출하지 않음
        setSaveError(safeText(rawMessage, '동선 저장에 실패했어요. 잠시 후 다시 시도해주세요.'))
        setIsSaving(false)
        return
      }

      updateTrip({ routesSaved: true })
      navigate('/trip/schedule')
    } catch (e) {
      setSaveError(safeErrorMessage(e, '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.'))
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.header}>
          <div className={styles['header-row']}>
            <span className={styles['context-label']}>{visitDay}일차</span>
          </div>
          <h1 className={styles.title}>동선 직접 고치기</h1>
          <p className={styles.subtitle}>바꾸고 싶은 곳을 눌러 주세요. 가까운 순서로 후보가 나와요.</p>
        </div>

        <div className={styles.list}>
        {departurePlace && (
          <div className={styles['place-row']}>
            <span className={styles['place-tag']}>출발 지점</span>
            <div className={styles['place-text']}>
              <span className={styles['place-name']}>{departurePlace.name}</span>
              {departurePlace.address && (
                <span className={styles['place-sub']}>{departurePlace.address}</span>
              )}
            </div>
          </div>
        )}

        {isLoading && <p className={styles.note}>동선을 불러오는 중이에요...</p>}
        {/* 08 부분 영역 에러 - 헤더·출발지점 행은 정상 표시 유지, 실패한 목록 구역만 회색 박스로 */}
        {!isLoading && loadError && (
          <div className={styles['partial-error']}>
            <p className={styles['partial-error-text']}>{loadError}</p>
            {tripNo && (
              <button type="button" className={styles['partial-error-retry']} onClick={retryLoadDay}>
                다시 시도
              </button>
            )}
          </div>
        )}
        {!isLoading && !loadError && stops.length === 0 && (
          <p className={styles.note}>이 날짜는 아직 동선이 만들어지지 않았어요.</p>
        )}

        {!isLoading && !loadError && stops.length > 0 && (
          <div>
            {stops.map((stop) => {
              const isExpanded = expandedNum === stop.num

              return (
                <div key={stop.tripRouteEventNo} className={styles['stop-block']}>
                  <div
                    className={`${styles['stop-row']} ${isExpanded ? styles.expanded : ''} ${
                      stop.pinned ? styles['stop-row-pinned'] : ''
                    }`}
                    onClick={() => {
                      if (!stop.pinned) toggleStop(stop)
                    }}
                    style={stop.pinned ? { cursor: 'default' } : undefined}
                  >
                    <div className={styles['stop-num']}>{stop.num}</div>
                    <div className={styles['stop-body']}>
                      <div className={styles['stop-name-row']}>
                        <span className={styles['stop-name']}>{stop.name}</span>
                        {stop.pinned && (
                          <span className={styles['stop-tag-fixed']}>고정 · 공연</span>
                        )}
                      </div>
                      <span className={styles['stop-meta']}>
                        {stop.address || '주소 정보 없음'}
                        {myLocation && stop.lat != null && stop.lon != null && (
                          <> · 내 위치에서 {haversineKm(myLocation.lat, myLocation.lon, stop.lat, stop.lon).toFixed(1)}km</>
                        )}
                      </span>
                    </div>
                    {!stop.pinned && stop.score != null && (
                      <span className={styles['stop-score']} style={{ color: scoreColor(stop.score) }}>
                        {stop.score}
                      </span>
                    )}
                    {!stop.pinned && (
                      <span className={styles['stop-chevron']}>{isExpanded ? '▲' : '▼'}</span>
                    )}
                  </div>

                  {isExpanded && !stop.pinned && (
                    <div className={styles['candidates-panel']}>
                      <div className={styles['candidates-head']}>
                        <span className={styles['candidates-label']}>교체 후보</span>
                      </div>
                      {candidatesByEventNo[stop.event_no]?.status === 'loading' && (
                        <p className={styles['candidates-empty']}>후보를 찾는 중이에요...</p>
                      )}
                      {candidatesByEventNo[stop.event_no]?.status === 'error' && (
                        <p className={styles['candidates-empty']}>후보를 불러오지 못했어요. 다시 눌러주세요.</p>
                      )}
                      {candidatesByEventNo[stop.event_no]?.status === 'ok' &&
                        candidatesByEventNo[stop.event_no].list.length === 0 && (
                          <p className={styles['candidates-empty']}>
                            이 칸은 지금 근처에 조건에 맞는 교체 후보가 없어요.
                          </p>
                        )}
                      {candidatesByEventNo[stop.event_no]?.status === 'ok' &&
                        candidatesByEventNo[stop.event_no].list.map((c) => (
                          <div key={c.event_no} className={styles['candidate-row']}>
                            <div className={styles['candidate-info']}>
                              <div className={styles['candidate-name-row']}>
                                <span className={styles['candidate-name']}>{c.event_nm}</span>
                                {c.ctg_nm && (
                                  <span className={styles['candidate-category-tag']}>{c.ctg_nm}</span>
                                )}
                              </div>
                              <span className={styles['candidate-diff']}>
                                {c.distance_km != null ? `${c.distance_km.toFixed(1)}km` : ''}
                                {c.is_open === false ? ' · 지금 영업 종료' : ''}
                              </span>
                            </div>
                            <div className={styles['candidate-action']}>
                              {c.relevance != null && (
                                <span
                                  className={styles['candidate-score']}
                                  style={{ color: scoreColor(Math.round(c.relevance * 100)) }}
                                >
                                  {Math.round(c.relevance * 100)}
                                </span>
                              )}
                              <button
                                type="button"
                                className={styles['candidate-swap-btn']}
                                onClick={() => swapStop(stop.num, c)}
                              >
                                교체
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {arrivalPlace && (
          <div className={styles['place-row']}>
            <span className={styles['place-tag']}>도착 지점</span>
            <div className={styles['place-text']}>
              <span className={styles['place-name']}>{arrivalPlace.name}</span>
              {arrivalPlace.address && (
                <span className={styles['place-sub']}>{arrivalPlace.address}</span>
              )}
            </div>
          </div>
        )}

        {saveError && (
          <p className={styles.note} style={{ color: 'var(--color-danger)' }}>
            {saveError}
          </p>
        )}

        {/* 하단 고정 바가 아니라 목록의 마지막 항목으로 스크롤에 같이 움직이게 함
            (사용자 요청 - 다른 화면과 동일하게 고정 해제) */}
        <div className={styles['action-row']}>
          <button
            type="button"
            className={styles['btn-primary']}
            onClick={handleSave}
            disabled={isSaving || isLoading || stops.length === 0}
          >
            {isSaving ? '저장 중...' : '동선 저장'}
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
