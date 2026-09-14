import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import AppHeader from './AppHeader'
import Icon from './Icon'
import PickerSheet from './PickerSheet'
import DateRangeSheet from './DateRangeSheet'
import styles from './TripDateView.module.css'

function formatDot(isoDate) {
  // '2026-09-13' -> '2026.09.13'
  return isoDate ? isoDate.replaceAll('-', '.') : ''
}

function daysBetween(startIso, endIso) {
  const start = new Date(startIso)
  const end = new Date(endIso)
  return Math.round((end - start) / (1000 * 60 * 60 * 24))
}

function placeFromStay(stay) {
  return { type: 'stay', name: stay.name, address: stay.address, lat: stay.lat, lon: stay.lon }
}

// Date 객체를 'YYYY-MM-DD'로 바꿀 때 로컬 날짜 기준으로 (toISOString은 타임존 버그 있음)
function toLocalIsoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDaysToIso(iso, n) {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  return toLocalIsoDate(d)
}

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 }
const SDK_LOAD_TIMEOUT_MS = 6000

let nextStayId = 100

export default function TripDateView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  const { startDate, endDate, startTime, endTime } = tripData.tripDates
  const stays = tripData.stays
  const departure = tripData.departure
  const arrival = tripData.arrival

  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ startDate: '', endDate: '', startTime: '', endTime: '' })

  // 동선 추천은 메인 이벤트 날짜 기준 앞뒤 하루씩, 총 3일치만 만들어지므로
  // 여행 기간 자체도 그 범위(event_date-1 ~ event_date+1) 안에서만 고를 수 있게 막음.
  const eventDate = tripData.selectedEvent?.event_date
  const allowedMinDate = eventDate ? addDaysToIso(eventDate, -1) : null
  const allowedMaxDate = eventDate ? addDaysToIso(eventDate, 1) : null
  // 숙소 체크인/체크아웃은 사용자가 정한 여행 기간(시작일~종료일) 기준 전후 +1일까지만 허용
  const stayAllowedMinDate = startDate ? addDaysToIso(startDate, -1) : null
  const stayAllowedMaxDate = endDate ? addDaysToIso(endDate, 1) : null

  // 이벤트가 바뀌었거나 처음 들어왔을 때, 지금 날짜가 허용 범위 밖이면 범위에 맞게 자동 보정.
  // (이벤트 선택은 이 화면보다 먼저 오는 단계라, 보통 여기 도착했을 때 처음 세팅됨)
  useEffect(() => {
    if (!allowedMinDate || !allowedMaxDate) return
    const needsStartFix = !startDate || startDate < allowedMinDate || startDate > allowedMaxDate
    const needsEndFix = !endDate || endDate < allowedMinDate || endDate > allowedMaxDate
    if (needsStartFix || needsEndFix) {
      updateTrip({
        tripDates: {
          ...tripData.tripDates,
          startDate: needsStartFix ? allowedMinDate : startDate,
          endDate: needsEndFix ? allowedMaxDate : endDate,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedMinDate, allowedMaxDate])

  // ---- 완료지(마지막날) 자동 채움 ----
  // 완료일(endDate) 그날 밤 실제로 체크인 상태인 숙소를 찾아서 채움 (checkIn <= endDate < checkOut).
  // "체크아웃 날짜가 가장 늦은 숙소" 기준은 완료일과 실제로 안 맞을 수 있어서 잘못된 기준이었음.
  // 숙소 목록이 바뀔 때마다 다시 계산해야 하므로, "사용자가 숙소 아닌 곳(공항 등)을 직접 지정한 경우"만
  // 빼고는 매번 다시 계산함 (arrival.type이 'stay'이거나 아직 없을 때만 자동 갱신 대상).
  useEffect(() => {
    if (!endDate || stays.length === 0) return
    if (arrival && arrival.type !== 'stay') return // 사용자가 직접 고른 장소는 안 건드림
    const matchedStay = stays.find((s) => s.checkIn <= endDate && endDate < s.checkOut)
    const fallbackStay = matchedStay || [...stays].sort((a, b) => (a.checkOut < b.checkOut ? 1 : -1))[0]
    if (!fallbackStay) return
    const nextArrival = placeFromStay(fallbackStay)
    if (arrival && arrival.name === nextArrival.name && arrival.lat === nextArrival.lat) return
    updateTrip({ arrival: nextArrival })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stays, endDate])

  // 숙소를 새로 추가하면 바로 아래 "첫째날 출발지" 섹션이 보이게 살짝 스크롤(사용자 요청)
  const departureSectionRef = useRef(null)

  // ---- 공용 지도 검색 오버레이 (출발지/완료지/숙소 셋 다 이걸로 씀) ----
  const [searchTarget, setSearchTarget] = useState(null) // 'departure' | 'arrival' | 'stay' | null
  const mapRef = useRef(null)
  const mapObjRef = useRef(null)
  const placesRef = useRef(null)
  const markersRef = useRef([])
  const selectedMarkerRef = useRef(null)
  const [sdkStatus, setSdkStatus] = useState('loading')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchStatus, setSearchStatus] = useState('idle')
  const [pickedPlace, setPickedPlace] = useState(null)
  // 숙소 검색일 때만 씀 - 체크인/체크아웃 날짜, 수정 중인 숙소면 그 id(새로 추가면 null)
  const [stayCheckIn, setStayCheckIn] = useState('')
  const [stayCheckOut, setStayCheckOut] = useState('')
  const [editingStayId, setEditingStayId] = useState(null)
  const [locationError, setLocationError] = useState('')
  const stayDateSectionRef = useRef(null)

  function openSearch(target, prefill) {
    setSearchTarget(target)
    setPickedPlace(prefill?.place || null)
    setQuery('')
    setSearchResults([])
    setSearchStatus('idle')
    setSdkStatus('loading')
    mapObjRef.current = null
    setStayCheckIn(prefill?.checkIn || '')
    setStayCheckOut(prefill?.checkOut || '')
    setEditingStayId(prefill?.stayId ?? null)
    setLocationError('')
  }

  function closeSearch() {
    setSearchTarget(null)
  }

  useEffect(() => {
    if (!searchTarget) return
    let cancelled = false
    let timeoutId = null

    if (!window.kakao || !window.kakao.maps) {
      timeoutId = setTimeout(() => {
        if (!cancelled) setSdkStatus('error')
      }, SDK_LOAD_TIMEOUT_MS)
      return () => {
        cancelled = true
        clearTimeout(timeoutId)
      }
    }

    timeoutId = setTimeout(() => {
      if (!cancelled) setSdkStatus('error')
    }, SDK_LOAD_TIMEOUT_MS)

    try {
      window.kakao.maps.load(() => {
        if (cancelled) return
        clearTimeout(timeoutId)
        try {
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
            level: 5,
          })
          mapObjRef.current = map
          placesRef.current = new window.kakao.maps.services.Places()
          setSdkStatus('ready')
        } catch (e) {
          setSdkStatus('error')
        }
      })
    } catch (e) {
      clearTimeout(timeoutId)
      setSdkStatus('error')
    }

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [searchTarget])

  function drawResultMarkers(results) {
    const map = mapObjRef.current
    if (!map) return
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
    if (results.length === 0) return
    const bounds = new window.kakao.maps.LatLngBounds()
    results.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x)
      const marker = new window.kakao.maps.Marker({ map, position })
      window.kakao.maps.event.addListener(marker, 'click', () => pickPlace(place))
      markersRef.current.push(marker)
      bounds.extend(position)
    })
    map.setBounds(bounds)
  }

  function runSearch(keyword) {
    if (!placesRef.current || !keyword.trim()) {
      setSearchResults([])
      setSearchStatus('idle')
      drawResultMarkers([])
      return
    }
    setSearchStatus('searching')
    placesRef.current.keywordSearch(keyword, (data, status) => {
      const { Status } = window.kakao.maps.services
      if (status === Status.ZERO_RESULT) {
        setSearchResults([])
        setSearchStatus('zero')
        drawResultMarkers([])
        return
      }
      if (status !== Status.OK) {
        setSearchResults([])
        setSearchStatus('error')
        drawResultMarkers([])
        return
      }
      setSearchResults(data)
      setSearchStatus('ok')
      drawResultMarkers(data)
    })
  }

  useEffect(() => {
    if (sdkStatus !== 'ready') return
    const timer = setTimeout(() => runSearch(query), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sdkStatus])

  function pickPlace(place) {
    const map = mapObjRef.current
    setPickedPlace({
      name: place.place_name,
      address: place.road_address_name || place.address_name,
      lat: Number(place.y),
      lon: Number(place.x),
    })
    if (selectedMarkerRef.current) selectedMarkerRef.current.setMap(null)
    const position = new window.kakao.maps.LatLng(place.y, place.x)
    const marker = new window.kakao.maps.Marker({ map, position, draggable: true, zIndex: 10 })
    window.kakao.maps.event.addListener(marker, 'dragend', () => {
      const pos = marker.getPosition()
      setPickedPlace((prev) => (prev ? { ...prev, lat: pos.getLat(), lon: pos.getLng() } : prev))
    })
    selectedMarkerRef.current = marker
    map.setLevel(3)
    map.panTo(position)
  }

  // 장소를 고르면(숙소 검색일 때) 검색 결과 리스트가 접히면서 생기는 빈 공간 대신,
  // 바로 이어서 입력해야 하는 체류 기간(체크인/체크아웃) 영역으로 스크롤해서 넘어가 줌
  useEffect(() => {
    if (searchTarget === 'stay' && pickedPlace) {
      stayDateSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedPlace, searchTarget])

  function useMyLocation() {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('이 브라우저에서는 내 위치를 사용할 수 없어요.')
      return
    }
    if (!mapObjRef.current) {
      setLocationError('지도가 아직 준비되지 않았어요. 잠시 후 다시 시도해주세요.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const center = new window.kakao.maps.LatLng(latitude, longitude)
        mapObjRef.current.panTo(center)
        mapObjRef.current.setLevel(3)
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('위치 권한이 꺼져 있어요. 브라우저 설정에서 위치 권한을 허용해주세요.')
        } else {
          setLocationError('내 위치를 가져오지 못했어요. 잠시 후 다시 시도해주세요.')
        }
      }
    )
  }

  const stayNights = stayCheckIn && stayCheckOut ? daysBetween(stayCheckIn, stayCheckOut) : null
  const stayDateError = (() => {
    if (searchTarget !== 'stay') return ''
    if (!stayCheckIn || !stayCheckOut) return ''
    if (stayNights <= 0) return '체크아웃은 체크인보다 늦어야 해요.'
    if (stayAllowedMinDate && (stayCheckIn < stayAllowedMinDate || stayCheckIn > stayAllowedMaxDate)) {
      return `체크인은 ${stayAllowedMinDate.slice(5)} ~ ${stayAllowedMaxDate.slice(5)} 사이여야 해요.`
    }
    if (stayAllowedMaxDate && (stayCheckOut < stayAllowedMinDate || stayCheckOut > stayAllowedMaxDate)) {
      return `체크아웃은 ${stayAllowedMinDate.slice(5)} ~ ${stayAllowedMaxDate.slice(5)} 사이여야 해요.`
    }
    const overlapsWith = stays.find((s) => {
      if (editingStayId != null && s.id === editingStayId) return false
      return stayCheckIn < s.checkOut && s.checkIn < stayCheckOut
    })
    if (overlapsWith) {
      return `'${overlapsWith.name}' 숙소와 날짜가 겹쳐요 (${overlapsWith.checkIn} ~ ${overlapsWith.checkOut}).`
    }
    return ''
  })()

  const canConfirmPlace = Boolean(
    pickedPlace &&
      (searchTarget !== 'stay' || (stayCheckIn && stayCheckOut && !stayDateError))
  )

  function confirmPlace() {
    if (!pickedPlace || !searchTarget) return

    if (searchTarget === 'stay') {
      if (!stayCheckIn || !stayCheckOut || stayDateError) return
      const newStay = {
        id: editingStayId ?? nextStayId++,
        name: pickedPlace.name,
        address: pickedPlace.address,
        lat: pickedPlace.lat,
        lon: pickedPlace.lon,
        checkIn: stayCheckIn,
        checkOut: stayCheckOut,
      }
      const isNewStay = editingStayId == null
      if (!isNewStay) {
        updateTrip({ stays: stays.map((s) => (s.id === editingStayId ? newStay : s)) })
      } else {
        updateTrip({ stays: [...stays, newStay] })
      }
      setSearchTarget(null)
      // 숙소를 새로 추가했을 때만 - 수정은 이미 보고 있던 위치라 스크롤 안 함
      if (isNewStay) {
        setTimeout(() => {
          departureSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
      return
    }

    updateTrip({
      [searchTarget]: {
        type: 'custom',
        name: pickedPlace.name,
        address: pickedPlace.address,
        lat: pickedPlace.lat,
        lon: pickedPlace.lon,
      },
    })
    setSearchTarget(null)
  }

  function updateDates(patch) {
    updateTrip({ tripDates: { ...tripData.tripDates, ...patch } })
  }

  function validateDates(nextStart, nextEnd, minDate, maxDate, eventDate) {
  const errors = { startDate: '', endDate: '' }
  if (!nextStart) errors.startDate = '시작일을 선택해 주세요.'
  if (!nextEnd) errors.endDate = '종료일을 선택해 주세요.'
  if (nextStart && nextEnd && daysBetween(nextStart, nextEnd) < 0) {
    errors.endDate = '종료일은 시작일보다 빠를 수 없어요.'
  }
  if (minDate && maxDate) {
    if (nextStart && (nextStart < minDate || nextStart > maxDate)) {
      errors.startDate = `시작일은 ${minDate.slice(5)} ~ ${maxDate.slice(5)} 사이여야 해요.`
    }
    if (nextEnd && (nextEnd < minDate || nextEnd > maxDate)) {
      errors.endDate = `종료일은 ${minDate.slice(5)} ~ ${maxDate.slice(5)} 사이여야 해요.`
    }
  }
  // 최종 안전장치 - 위 min/max 제한을 다 통과했어도 혹시 이벤트 날짜가 기간에서 빠지면 여기서 막음
  if (!errors.startDate && !errors.endDate && eventDate && nextStart && nextEnd) {
    if (eventDate < nextStart || eventDate > nextEnd) {
      errors.endDate = '선택한 기간에 이벤트 날짜가 꼭 포함되어야 해요.'
    }
  }
  return errors
  }

  function validateTimes(nextStart, nextEnd) {
    const errors = { startTime: '', endTime: '' }
    if (!nextStart) errors.startTime = '시작 시간을 선택해 주세요.'
    if (!nextEnd) errors.endTime = '종료 시간을 선택해 주세요.'
    if (nextStart && nextEnd && nextStart >= nextEnd) {
      errors.endTime = '종료 시간은 시작 시간보다 늦어야 해요.'
    }
    return errors
  }

  function removeStay(id) {
    updateTrip({ stays: stays.filter((s) => s.id !== id) })
  }

  function addStay() {
    openSearch('stay')
  }

  function editStay(stay) {
    openSearch('stay', {
      place: { name: stay.name, address: stay.address, lat: stay.lat, lon: stay.lon },
      checkIn: stay.checkIn,
      checkOut: stay.checkOut,
      stayId: stay.id,
    })
  }

  function goNext() {
    setErrorMessage('')
    const dateErrors = validateDates(startDate, endDate, allowedMinDate, allowedMaxDate, eventDate)
    const timeErrors = validateTimes(startTime, endTime)
    const nextFieldErrors = { ...dateErrors, ...timeErrors }
    setFieldErrors(nextFieldErrors)

    const hasError = Object.values(nextFieldErrors).some(Boolean)
    if (hasError) {
      setErrorMessage('입력값을 확인해 주세요.')
      return
    }
    if (!departure) {
      setErrorMessage('첫째날 출발지를 정해주세요.')
      return
    }
    if (!arrival) {
      setErrorMessage('마지막날 도착지를 정해주세요.')
      return
    }

    navigate('/trip/activities')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        {/* 뒤로가기는 브라우저 history(-1) 대신 화면을 명시적으로 지정 - 새로고침·직접 진입으로
            히스토리가 없어도 항상 올바른 이전 화면(이벤트 선택)으로 감 */}
        <AppHeader onBack={() => navigate('/trip/events')} />
        <div className={styles.header}>
          <h1 className={styles.title}>
            추천 일정의 기간을
            <br />
            알려주세요
          </h1>
          <div className={styles['progress-bar']}>
            <div className={styles['progress-fill']} style={{ width: '50%' }} />
          </div>
          <div className={styles['progress-caption']}>
            <span>2 / 4</span>
            <span>50%</span>
          </div>
        </div>

        <div className={styles.scrollArea}>
        <div className={styles.section}>
          <p className={styles.infoBanner}>
            ⓘ 이벤트 날짜 기준 앞뒤 하루씩({eventDate ? `${formatDot(allowedMinDate)} — ${formatDot(allowedMaxDate)}` : '이벤트를 먼저 골라주세요'}) 안에서 원하는 기간만 골라도 돼요. 단, 이벤트 날짜({eventDate ? formatDot(eventDate) : '-'})는 선택한 기간에 꼭 포함돼야 해요.
          </p>
          {/* 시작일/종료일을 다시 칸 두 개로 분리(사용자 요청) - 둘 중 어느 칸을 눌러도
              같은 달력이 열리고, 범위를 고르면 두 칸이 한 번에 채워짐(DateRangeSheet의
              renderTrigger로 트리거 영역만 두 칸으로 대체, 달력 자체는 공유) */}
          <DateRangeSheet
            checkIn={startDate}
            checkOut={endDate}
            min={allowedMinDate || undefined}
            max={allowedMaxDate || undefined}
            onConfirm={(nextStart, nextEnd) => {
              updateDates({ startDate: nextStart, endDate: nextEnd })
              setFieldErrors((prev) => ({
                ...prev,
                ...validateDates(nextStart, nextEnd, allowedMinDate, allowedMaxDate, eventDate),
              }))
            }}
            renderTrigger={({ open, checkIn, checkOut }) => (
              <div className={styles['two-col']}>
                <div>
                  <label className={styles['field-label']}>시작일</label>
                  <button
                    type="button"
                    className={`${styles.trigger} ${!checkIn ? styles.placeholder : ''}`}
                    onClick={open}
                  >
                    <span className={styles.triggerText}>
                      {checkIn ? formatDot(checkIn) : '시작일 선택'}
                    </span>
                    <Icon name="calendar" size={16} color={checkIn ? 'var(--color-primary-500)' : 'rgba(12, 10, 28, 0.4)'} />
                  </button>
                </div>
                <div>
                  <label className={styles['field-label']}>종료일</label>
                  <button
                    type="button"
                    className={`${styles.trigger} ${!checkOut ? styles.placeholder : ''}`}
                    onClick={open}
                  >
                    <span className={styles.triggerText}>
                      {checkOut ? formatDot(checkOut) : '종료일 선택'}
                    </span>
                    <Icon name="calendar" size={16} color={checkOut ? 'var(--color-primary-500)' : 'rgba(12, 10, 28, 0.4)'} />
                  </button>
                </div>
              </div>
            )}
          />
          {(fieldErrors.startDate || fieldErrors.endDate) && (
            <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>
              {fieldErrors.startDate || fieldErrors.endDate}
            </p>
          )}

          <div className={styles['two-col']} style={{ marginTop: 14 }}>
            <div>
              <label className={styles['field-label']}>시작 시간</label>
              <PickerSheet
                type="time"
                className={`${styles.input} ${fieldErrors.startTime ? styles.inputError : ''}`}
                value={startTime}
                placeholder="시작 시간을 골라주세요"
                onChange={(next) => {
                  updateDates({ startTime: next })
                  setFieldErrors((prev) => ({ ...prev, startTime: '', endTime: '' }))
                }}
                onConfirm={() =>
                  setFieldErrors((prev) => ({ ...prev, ...validateTimes(startTime, endTime) }))
                }
              />
              {fieldErrors.startTime && <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>{fieldErrors.startTime}</p>}
            </div>
            <div>
              <label className={styles['field-label']}>종료 시간</label>
              <PickerSheet
                type="time"
                className={`${styles.input} ${fieldErrors.endTime ? styles.inputError : ''}`}
                value={endTime}
                placeholder="종료 시간을 골라주세요"
                onChange={(next) => {
                  updateDates({ endTime: next })
                  setFieldErrors((prev) => ({ ...prev, startTime: '', endTime: '' }))
                }}
                onConfirm={() =>
                  setFieldErrors((prev) => ({ ...prev, ...validateTimes(startTime, endTime) }))
                }
              />
              {fieldErrors.endTime && <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>{fieldErrors.endTime}</p>}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles['section-head']}>
            <span className={styles['section-label-strong']}>숙소</span>
            <span className={styles['section-count']}>{stays.length}곳</span>
          </div>
          <div className={styles['stay-list']}>
            {stays.map((stay) => (
              <div key={stay.id} className={styles['stay-row']}>
                <div>
                  <p className={styles['stay-name']}>{stay.name}</p>
                  <p className={styles['stay-dates']}>
                    {formatDot(stay.checkIn)} — {formatDot(stay.checkOut)} ·{' '}
                    {daysBetween(stay.checkIn, stay.checkOut)}박
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className={styles['stay-delete']}
                    onClick={() => editStay(stay)}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className={`${styles['stay-delete']} ${styles['stay-delete-danger']}`}
                    onClick={() => removeStay(stay.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
          {stays.length < 3 ? (
            <button type="button" className={styles['add-stay']} onClick={addStay}>
              + 숙소 추가
            </button>
          ) : (
            <p className={styles.hint}>숙소는 최대 3개까지만 등록할 수 있어요.</p>
          )}
        </div>

        {/* 출발지(첫날) - 프리셋 없이 지도에서 직접 검색해서 정확한 위치를 찍어야 함 */}
        <div className={styles.section} ref={departureSectionRef}>
          <div className={styles['section-head']}>
            <span className={styles['section-label-strong']}>첫째날 출발지</span>
            <button type="button" className={styles['edit-link']} onClick={() => openSearch('departure')}>
              {departure ? '수정' : '지도에서 찾기'}
            </button>
          </div>
          {departure ? (
            <p className={styles['place-summary']}>{departure.name}</p>
          ) : (
            <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>
              여행이 시작되는 정확한 위치를 지도에서 검색해주세요.
            </p>
          )}
        </div>

        {/* 완료지(마지막날) - 숙소가 있으면 자동으로 채워짐, 필요하면 수정 가능 */}
        <div className={styles.section} style={{ borderBottom: 'none' }}>
          <div className={styles['section-head']}>
            <span className={styles['section-label-strong']}>마지막날 도착지</span>
            <button type="button" className={styles['edit-link']} onClick={() => openSearch('arrival')}>
              {arrival ? '수정' : '지도에서 찾기'}
            </button>
          </div>
          {arrival ? (
            <p className={styles['place-summary']}>{arrival.name}</p>
          ) : (
            <p className={styles.hint}>등록된 숙소가 있으면 자동으로 채워져요.</p>
          )}
        </div>

        {errorMessage && (
          <p className={styles.hint} style={{ padding: '0 16px', color: 'var(--color-danger)' }}>
            {errorMessage}
          </p>
        )}

        {/* 하단 고정 바가 아니라 콘텐츠의 마지막 항목으로 스크롤에 같이 움직이게 함
            (사용자 요청 - 다른 화면과 동일하게 고정 해제) */}
        <div className={styles.footer} data-bottom-bar="true">
          <button type="button" className={styles['btn-primary']} onClick={goNext}>
            선호 액티비티
          </button>
        </div>
        </div>
      </div>

      {/* 공용 지도 검색 오버레이 - StaySearchView 기능을 이 화면 안의 모달로 통합 */}
      {searchTarget && (
        <div className={styles['search-overlay']} data-fab-hide="true">
          <div
            className={styles['search-panel']}
            style={{
              width: 'min(96vw, 760px)',
              maxWidth: '760px',
              height: 'min(90vh, 760px)',
              maxHeight: '95vh',
              borderRadius: 24,
            }}
          >
            <div className={styles['search-panel-header']}>
              <span>
                {searchTarget === 'departure' && '첫째날 출발지 검색'}
                {searchTarget === 'arrival' && '마지막날 도착지 검색'}
                {searchTarget === 'stay' && (editingStayId != null ? '숙소 수정' : '숙소 추가')}
              </span>
              <button type="button" className={styles['close-btn']} onClick={closeSearch}>
                <Icon name="close" size={14} />
              </button>
            </div>

            <div className={styles['search-row']}>
              <span className={styles['search-icon']}>⌕</span>
              <input
                className={styles['search-input']}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchTarget === 'stay' ? '지역, 역, 숙소 이름으로 검색' : '장소, 역, 주소로 검색'}
                disabled={sdkStatus === 'error'}
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="검색어 지우기"
                  style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 6, display: 'flex' }}
                >
                  <Icon name="close" size={14} />
                </button>
              )}
            </div>

            <div
              className={styles['map-area']}
              style={{ position: 'relative', height: '260px', minHeight: '260px' }}
            >
              <div ref={mapRef} className={styles['map-canvas']} style={{ width: '100%', height: '100%' }} />
              {sdkStatus === 'loading' && (
                <div className={styles['map-loading']}>지도를 불러오는 중이에요...</div>
              )}
              {sdkStatus === 'error' && (
                <div className={styles['map-loading']}>
                  지도를 불러오지 못했어요. 인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.
                </div>
              )}
              {sdkStatus === 'ready' && searchStatus === 'ok' && searchResults.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 2,
                    padding: '6px 9px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.94)',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {searchResults.length}곳 검색됨
                </div>
              )}
              <button
                type="button"
                title="내 위치"
                onClick={useMyLocation}
                disabled={sdkStatus !== 'ready'}
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 10,
                  zIndex: 2,
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: '1px solid #E5E1FF',
                  background: '#fff',
                  cursor: sdkStatus === 'ready' ? 'pointer' : 'default',
                  opacity: sdkStatus === 'ready' ? 1 : 0.5,
                }}
              >
                ⊙
              </button>
            </div>

            <div className={styles['search-scroll']}>

            {locationError && (
              <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>
                {locationError}
              </p>
            )}

            {searchStatus === 'zero' && (
              <p className={styles.hint}>'{query}'(으)로 검색된 곳이 없어요. 다른 키워드로 검색해보세요.</p>
            )}
            {searchStatus === 'error' && (
              <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>
                검색 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.
              </p>
            )}

            {/* 장소를 고르고 나면 검색 결과 리스트는 접고, 다음 입력(체류 기간)으로 자연스럽게 이어지게 함 */}
            {searchStatus === 'ok' && searchResults.length > 0 && !pickedPlace && (
              <div className={styles['result-list']}>
                {searchResults.map((place) => (
                  <div
                    key={place.id}
                    className={`${styles['result-list-item']} ${
                      pickedPlace?.name === place.place_name ? styles.active : ''
                    }`}
                    onClick={() => pickPlace(place)}
                  >
                    <span className={styles['result-list-name']}>{place.place_name}</span>
                    <span className={styles['result-list-address']}>
                      {place.road_address_name || place.address_name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {pickedPlace && (
              <div
                style={{
                  margin: '12px 18px 0',
                  padding: '12px 14px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 14,
                  background: '#FAF9FF',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700 }}>{pickedPlace.name}</div>
                <div style={{ marginTop: 4, fontSize: 11.5, color: 'rgba(27,22,63,0.58)' }}>
                  {pickedPlace.address}
                </div>
                <div style={{ marginTop: 5, fontSize: 11, color: 'var(--color-primary-500)' }}>
                  지도 위 마커를 드래그해서 위치를 조정할 수 있어요.
                </div>
              </div>
            )}

            {searchTarget === 'stay' && (
              <div ref={stayDateSectionRef} style={{ padding: '14px 16px 24px' }}>
                <div className={styles['section-head']} style={{ marginBottom: 8 }}>
                  <span className={styles['section-label']}>체류 기간</span>
                  {stayNights > 0 && (
                    <span className={styles['section-count']}>{stayNights}박 {stayNights + 1}일</span>
                  )}
                </div>

                {stayAllowedMinDate && stayAllowedMaxDate && (
                  <p className={styles.infoBanner}>
                    ⓘ 여행 기간 기준 {formatDot(stayAllowedMinDate)} ~ {formatDot(stayAllowedMaxDate)} 사이만 가능해요.
                  </p>
                )}

                <div>
                  <label className={styles['field-label']}>체크인 · 체크아웃</label>
                  <DateRangeSheet
                    checkIn={stayCheckIn}
                    checkOut={stayCheckOut}
                    min={stayAllowedMinDate || undefined}
                    max={stayAllowedMaxDate || undefined}
                    onConfirm={(nextCheckIn, nextCheckOut) => {
                      setStayCheckIn(nextCheckIn)
                      setStayCheckOut(nextCheckOut)
                    }}
                  />
                </div>

                {stayDateError && (
                  <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>
                    {stayDateError}
                  </p>
                )}
              </div>
            )}

            </div>

            <div style={{ padding: '14px 16px 16px', flexShrink: 0, borderTop: '1px solid var(--color-border)' }}>
              {/* 06 버튼 규칙 - 정보(숙박일수·숙소명)는 버튼 밖 캡션으로, 버튼엔 행동만 담음 */}
              {searchTarget === 'stay' && pickedPlace && stayNights > 0 && (
                <p className={styles.hint} style={{ marginBottom: 8 }}>
                  {stayNights}박 · {pickedPlace.name}
                </p>
              )}
              <button
                type="button"
                className={styles['btn-primary']}
                disabled={!canConfirmPlace}
                style={!canConfirmPlace ? { background: 'var(--button-bg-disabled)', color: '#fff', cursor: 'default', width: '100%' } : { width: '100%' }}
                onClick={confirmPlace}
              >
                {!pickedPlace
                  ? '지도에서 장소를 골라주세요'
                  : searchTarget === 'stay' && (!stayCheckIn || !stayCheckOut)
                    ? '체크인·체크아웃을 골라주세요'
                    : searchTarget === 'stay' && stayDateError
                      ? '체류 기간을 확인해주세요'
                      : searchTarget === 'stay'
                        ? `숙소로 ${editingStayId != null ? '수정' : '추가'}`
                        : '이 장소로 정하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
