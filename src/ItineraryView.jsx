import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch, safeErrorMessage } from './api'
import { useLanguage } from './LanguageContext'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import PlaceDetailModal from './PlaceDetailModal'
import Icon from './Icon'
import { scoreColor } from './scoreColor'
import styles from './ItineraryView.module.css'

// 실제 trip_no가 없을 때(아직 동선을 안 만들었거나 화면 확인용으로 바로 들어온 경우)
// 보여줄 미리보기용 고정 데이터
const PREVIEW_PINNED = {
  time: '18:30',
  title: '올림픽체조경기장',
  lat: 37.5206,
  lng: 127.1268,
}
const PREVIEW_STOPS = [
  { num: 1, name: '하이브 인사이트', meta: '용산 · HYBE Insight', score: 94, lat: 37.5296, lng: 126.9648 },
  { num: 2, name: '낙산공원', meta: '뮤비 촬영지', score: 88, lat: 37.5807, lng: 127.0069 },
  { num: 3, name: '어니언 안국', meta: '카페', score: 71, lat: 37.5764, lng: 126.985 },
  { num: 4, name: '광야@서울', meta: '굿즈샵 · 코엑스', score: 83, lat: 37.5127, lng: 127.059 },
]

function formatDateRange(startIso, endIso) {
  if (!startIso || !endIso) return ''
  const s = startIso.slice(5).replace('-', '.')
  const e = endIso.slice(5).replace('-', '.')
  return `${s} — ${e}`
}

function formatTimeLabel(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function ItineraryView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const { tripData } = useTrip()
  const { startDate, endDate } = tripData.tripDates || {}
  const totalDays =
    startDate && endDate
      ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1)
      : 3

  // ScheduleTableView의 "동선보기" 버튼에서 넘어올 때 보고 있던 날짜를 그대로 이어서 보여줌
  const [activeDay, setActiveDay] = useState(location.state?.visitDay || 1)
  const [dayDataByDay, setDayDataByDay] = useState({}) // { [day]: { pinned, stops } | undefined }
  const [dayErrorByDay, setDayErrorByDay] = useState({}) // { [day]: 에러 메시지 } - 실패했을 때만
  const [isLoading, setIsLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)

  const mapRef = useRef(null)
  const overlaysRef = useRef([])
  const selectedBadgeElRef = useRef(null) // 지금 하이라이트된 지도 배지 DOM(있으면) - 클릭할 때마다 토글
  const [isSdkReady, setIsSdkReady] = useState(false)

  // 실제 동선 데이터 불러오기: GET /trips/{trip_no}/routes?visit_day=로 그날 장소 목록 받고,
  // 각 장소의 좌표/주소/시간은 GET /events/{event_no}로 하나씩 더 받아서 합침.
  // selectedEvent.event_no와 일치하는 장소는 "고정" 항목으로 따로 분리함.
  useEffect(() => {
    if (!tripData.tripNo) {
      setIsPreview(true)
      setIsLoading(false)
      return
    }
    if (dayDataByDay[activeDay] !== undefined) {
      setIsLoading(false)
      return
    }

    let cancelled = false
    async function loadDay() {
      setIsLoading(true)
      try {
        const routesRes = await apiFetch(`/trips/${tripData.tripNo}/routes?visit_day=${activeDay}`)
        if (!routesRes.ok) {
          // 08 에러 화면 규칙 - HTTP 상태 코드·백엔드 detail 원문은 콘솔에만 남기고,
          // 화면(사용자)에는 친절한 문장만 보여줌 (보안·신뢰 원칙)
          const body = await routesRes.json().catch(() => null)
          console.error('[ItineraryView] 동선 조회 실패:', routesRes.status, body?.detail)
          throw new Error(t('itinerary.loadFailed'))
        }
        const data = await routesRes.json()
        const dayRoute = Array.isArray(data) && data.length > 0 ? data[0] : null
        const events = dayRoute?.events || []

        const detailed = await Promise.all(
          events.map(async (ev) => {
            try {
              const evRes = await apiFetch(`/events/${ev.event_no}`)
              const detail = evRes.ok ? await evRes.json() : null
              return {
                tripRouteEventNo: ev.trip_route_event_no,
                eventNo: ev.event_no,
                name: ev.event_nm,
                liked: ev.liked,
                seq: ev.seq,
                fixedSchedule: ev.fixed_schedule,
                lat: detail?.event_lat ?? null,
                lng: detail?.event_lon ?? null,
                meta: detail?.add || '',
                startDt: detail?.start_dt || null,
                imgUrl: detail?.event_img_url || null,
              }
            } catch (e) {
              return {
                tripRouteEventNo: ev.trip_route_event_no,
                eventNo: ev.event_no,
                name: ev.event_nm,
                liked: ev.liked,
                seq: ev.seq,
                fixedSchedule: ev.fixed_schedule,
                lat: null,
                lng: null,
                meta: '',
                startDt: null,
                imgUrl: null,
              }
            }
          })
        )

        // 이 이벤트가 메인 이벤트인지: 백엔드가 내려주는 fixed_schedule을 우선 기준으로 삼고,
        // (같은 세션에서 방금 고른 경우를 위해) tripData.selectedEvent도 보조로 확인함
        const mainEventNo = tripData.selectedEvent?.event_no
        const isMainEvent = (d) => Boolean(d.fixedSchedule) || d.eventNo === mainEventNo
        const pinned = detailed.find(isMainEvent) || null
        const others = detailed
          .filter((d) => !isMainEvent(d))
          .sort((a, b) => a.seq - b.seq)
          .map((d, i) => ({ ...d, num: i + 1 }))

        if (!cancelled) {
          setIsPreview(false)
          setDayErrorByDay((prev) => ({ ...prev, [activeDay]: null }))
          setDayDataByDay((prev) => ({ ...prev, [activeDay]: { pinned, stops: others } }))
        }
      } catch (e) {
        // 왜 실패했는지 콘솔에 남겨둠 - "왜 미리보기로 빠졌는지" 진단할 때 여기를 확인하면 됨
        console.error('[ItineraryView] 동선 로딩 실패:', e)
        if (!cancelled) {
          setIsPreview(true)
          setDayErrorByDay((prev) => ({
            ...prev,
            [activeDay]: safeErrorMessage(e, t('itinerary.loadFailedRetry')),
          }))
          // 실패를 dayDataByDay에 null로 저장해두면 재시도가 막히니, 여기엔 저장하지 않음
          // (재시도 버튼을 누르면 dayErrorByDay만 초기화해서 이 effect가 다시 돌게 함)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadDay()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay, tripData.tripNo, tripData.selectedEvent, dayErrorByDay[activeDay]])

  function retryLoadDay() {
    setDayErrorByDay((prev) => ({ ...prev, [activeDay]: undefined }))
  }

  const dayData = dayDataByDay[activeDay]
  const displayPinned = isPreview || !dayData ? PREVIEW_PINNED : dayData.pinned
  const displayStops = useMemo(() => {
    if (isPreview || !dayData) return PREVIEW_STOPS.map((s) => ({ ...s, tripRouteEventNo: null, eventNo: null, liked: false }))
    return dayData.stops
  }, [isPreview, dayData])

  const totalPlaceCount = (displayPinned ? 1 : 0) + displayStops.length

  // 지도를 그림 (핀 + 나머지 스탑들)
  useEffect(() => {
    if (isLoading) return
    if (!window.kakao || !window.kakao.maps) {
      console.warn('[카카오맵] SDK를 못 찾았어요. index.html의 script 태그를 확인해주세요.')
      return
    }

    const allPoints = [
      ...displayStops,
      ...(displayPinned ? [{ ...displayPinned, isPinned: true }] : []),
    ].filter((s) => s.lat != null && s.lng != null)

    if (allPoints.length === 0) return

    window.kakao.maps.load(() => {
      if (mapRef.current) mapRef.current.innerHTML = ''

      const bounds = new window.kakao.maps.LatLngBounds()
      const center = new window.kakao.maps.LatLng(allPoints[0].lat, allPoints[0].lng)
      const map = new window.kakao.maps.Map(mapRef.current, { center, level: 8 })

      overlaysRef.current.forEach((o) => o.setMap(null))
      overlaysRef.current = []
      selectedBadgeElRef.current = null // 마커 DOM을 통째로 새로 만드므로 이전 선택 참조도 같이 비움

      const linePath = allPoints.map((p) => new window.kakao.maps.LatLng(p.lat, p.lng))
      const polyline = new window.kakao.maps.Polyline({
        map,
        path: linePath,
        strokeWeight: 4,
        strokeColor: '#6D57FC', // 카카오맵 SDK 옵션값이라 CSS 변수(var())를 못 씀 - 리터럴 hex 유지
        strokeOpacity: 0.85,
        strokeStyle: 'shortdash',
        zIndex: 4,
      })
      overlaysRef.current.push(polyline)

      allPoints.forEach((stop) => {
        const position = new window.kakao.maps.LatLng(stop.lat, stop.lng)
        bounds.extend(position)
        const content = document.createElement('div')
        if (stop.isPinned) {
          content.className = styles['map-pinned-badge']
          content.textContent = '고정'
        } else {
          content.className = styles['map-num-badge']
          // GET /events/{event_no}의 event_img_url을 원형 배지 배경 이미지로 그대로 씀 -
          // 순번은 오른쪽 아래 작은 뱃지로만 표시. 이미지가 없으면 배경색(primary)만 남아서
          // 깨진 이미지 아이콘 없이 자연스럽게 대체됨.
          if (stop.imgUrl) {
            content.style.backgroundImage = `url("${stop.imgUrl}")`
          }
          const numBadge = document.createElement('span')
          numBadge.className = styles['map-num-badge-num']
          numBadge.textContent = stop.num
          content.appendChild(numBadge)

          // 지도 배지를 눌러도 타임라인 목록 눌렀을 때와 똑같이 장소 상세 팝업이 뜨게 함
          // (openPlaceDetail은 이 컴포넌트 아래쪽에서 function 선언 - 호이스팅돼서 여기서 바로 씀)
          if (stop.eventNo) {
            content.style.cursor = 'pointer'
            content.addEventListener('click', () => {
              // 이전에 선택돼 있던 배지는 하이라이트 해제(한 번에 하나만 선택된 느낌)
              if (selectedBadgeElRef.current && selectedBadgeElRef.current !== content) {
                selectedBadgeElRef.current.classList.remove(styles.selected)
              }
              content.classList.add(styles.selected)
              selectedBadgeElRef.current = content
              // 같은 배지를 다시 눌러도 반짝임이 다시 재생되도록 클래스를 뗐다 붙임(리플로우로 강제 재시작).
              // pulse 클래스를 계속 남겨두면 카카오맵이 확대/축소·화면 밖-안 이동 시 마커를
              // display:none↔block으로 다시 그리는 과정에서 CSS 애니메이션이 또 재생돼버려서
              // (엉뚱한 타이밍에 반짝임) - 애니메이션 재생 시간(2회×0.85s)이 지나면 클래스를 꼭 떼어냄.
              clearTimeout(content._pulseTimeout)
              content.classList.remove(styles.pulse)
              void content.offsetWidth
              content.classList.add(styles.pulse)
              content._pulseTimeout = setTimeout(() => {
                content.classList.remove(styles.pulse)
              }, 1700)
              map.panTo(position)
              openPlaceDetail(stop)
            })
          }
        }
        const overlay = new window.kakao.maps.CustomOverlay({ map, position, content, yAnchor: 0.5, zIndex: 5 })
        overlaysRef.current.push(overlay)
      })

      function fitToBounds() {
        map.relayout()
        map.setBounds(bounds, 30)
      }
      fitToBounds()
      setIsSdkReady(true)
      const relayoutTimer = setTimeout(fitToBounds, 300)
      return () => clearTimeout(relayoutTimer)
    })
  }, [isLoading, displayPinned, displayStops])

  const [selectedPlace, setSelectedPlace] = useState(null)

  function openPlaceDetail(stop) {
    if (!stop.eventNo) return
    setSelectedPlace({
      eventNo: stop.eventNo,
      tripRouteEventNo: stop.tripRouteEventNo,
      liked: stop.liked,
    })
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.header}>
          <h1 className={styles.title}>
            {t('itinerary.confirmRoute')}
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
              {t('scheduleTable.dayN')(d)}
            </button>
          ))}
        </div>

        {isPreview && (
          <div style={{ padding: '0 16px' }}>
            <p className={styles['day-label']} style={{ color: 'var(--color-warning)', marginBottom: 4 }}>
              {t('itinerary.previewNotice')}
            </p>
            {dayErrorByDay[activeDay] && (
              <>
                <p className={styles['day-label']} style={{ color: 'var(--color-danger)', fontSize: '0.6875rem', opacity: 0.8 }}>
                  {dayErrorByDay[activeDay]}
                </p>
                <button
                  type="button"
                  onClick={retryLoadDay}
                  style={{
                    marginTop: 4,
                    marginBottom: 8,
                    padding: '6px 14px',
                    borderRadius: 100,
                    border: '1px solid var(--color-danger)',
                    background: '#fff',
                    color: 'var(--color-danger)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {t('itinerary.reload')}
                </button>
              </>
            )}
          </div>
        )}

        <div className={styles['map-area']}>
          <div ref={mapRef} className={styles['map-canvas']} />
          {(!isSdkReady || isLoading) && (
            <div className={styles['map-loading']}>{t('itinerary.mapLoading')}</div>
          )}
        </div>
        <div className={styles['map-summary-bar']}>
          <span className={styles['map-label']}>MAP</span>
          <span className={styles['map-summary-text']}>{t('itinerary.totalPlaces')(totalPlaceCount)}</span>
        </div>

        <div className={styles.timeline}>
          {displayStops.map((stop) => (
            <div
              key={stop.tripRouteEventNo ?? stop.num}
              className={styles['stop-row']}
              onClick={() => openPlaceDetail(stop)}
              style={{ cursor: stop.eventNo ? 'pointer' : 'default' }}
            >
              <div className={styles['stop-num']}>{stop.num}</div>
              <div className={styles['stop-text']}>
                <span className={styles['stop-name']}>{stop.name}</span>
                <span className={styles['stop-meta']}>{stop.meta}</span>
              </div>
              {stop.score != null && (
                <span className={styles['stop-score']} style={{ color: scoreColor(stop.score) }}>
                  {stop.score}
                </span>
              )}
              {stop.liked && (
                <span className={styles['stop-score']}>
                  <Icon name="heart" size={13} filled color="var(--color-danger)" />
                </span>
              )}
            </div>
          ))}

          {/* 고정(공연) 이벤트 - 항상 그날의 마지막 순서라 목록 맨 아래에 표시 */}
          {displayPinned && (
            <div className={styles['pinned-bar']}>
              <span className={styles['pinned-time']}>{formatTimeLabel(displayPinned.startDt) || displayPinned.time}</span>
              <span className={styles['pinned-title']}>
                {displayPinned.name || displayPinned.title} · {t('itinerary.enterStart')}
              </span>
              <span className={styles['pinned-tag']}>{t('itinerary.fixedTag')}</span>
            </div>
          )}

          {/* 하단 고정 바가 아니라 목록의 마지막 항목으로 스크롤에 같이 움직이게 함
              (사용자 요청 - 이 3버튼은 고정될 필요 없이 콘텐츠와 같이 내려가도 됨) */}
          <div className={styles['action-row']} data-bottom-bar="true">
            <button
              type="button"
              className={styles['btn-outline']}
              onClick={() => navigate('/trip/schedule', { state: { visitDay: activeDay } })}
            >
              {t('itinerary.viewList')}
            </button>
            <button
              type="button"
              className={styles['btn-outline']}
              onClick={() => navigate('/trip/itinerary/edit', { state: { visitDay: activeDay } })}
            >
              {t('schedule.editRoute')}
            </button>
            <button type="button" className={styles['btn-primary']} onClick={() => navigate('/trip/history')}>
              {t('common.confirm')}
            </button>
          </div>
        </div>

        <BottomNav />
      </div>

      {selectedPlace && (
        <PlaceDetailModal
          eventNo={selectedPlace.eventNo}
          tripRouteEventNo={selectedPlace.tripRouteEventNo}
          liked={selectedPlace.liked}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </div>
  )
}
