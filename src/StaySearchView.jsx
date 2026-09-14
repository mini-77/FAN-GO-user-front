import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTrip } from './TripContext'
import AppHeader from './AppHeader'
import Icon from './Icon'
import DateRangeSheet from './DateRangeSheet'
import styles from './StaySearchView.module.css'

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null
  const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : null
}

// Date를 'YYYY-MM-DD'로 바꿀 때 로컬 날짜 기준으로 (toISOString은 타임존 버그 있음)
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
// SDK가 이 시간 안에 안 뜨면 "실패"로 간주 (index.html 스크립트 태그 자체가 없거나,
// appkey가 틀렸거나, 네트워크가 막혀서 아예 안 뜨는 경우를 위한 안전장치)
const SDK_LOAD_TIMEOUT_MS = 6000

export default function StaySearchView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tripData, updateTrip } = useTrip()

  // TripDateView에서 "수정" 버튼으로 들어올 때 넘겨줌:
  // navigate('/trip/stay-search', { state: { editStay: stay } })
  // 있으면 "새로 추가"가 아니라 "이 숙소를 수정"하는 걸로 동작함 (날짜는 기존 값 유지, 위치만 바꿈)
  const editStay = location.state?.editStay || null

  // ScheduleTableView/TripDateView의 "위치변경"으로 들어올 때 넘겨줌:
  // navigate('/trip/stay-search', { state: { editLocation: { field: 'departure'|'arrival', date } } })
  // date가 있으면 그 날짜용 dayLocationOverrides에, 없으면(1일차/마지막날) tripData.departure/arrival에 바로 저장.
  // 이 모드일 땐 숙소가 아니라 "지점"만 고르는 거라 체크인/체크아웃 날짜 입력 자체가 없음.
  const editLocation = location.state?.editLocation || null
  const isLocationOnlyMode = Boolean(editLocation)

  const mapRef = useRef(null) // 지도를 그릴 div
  const mapObjRef = useRef(null) // kakao.maps.Map 인스턴스
  const placesRef = useRef(null) // kakao.maps.services.Places 인스턴스
  const markersRef = useRef([]) // 지금 지도 위에 떠있는 마커들 (검색될 때마다 지우고 다시 그림)
  const selectedMarkerRef = useRef(null) // 선택된 숙소의 드래그 가능한 메인 마커

  // 'loading' | 'ready' | 'error' — 카카오맵 SDK/지도 자체의 상태
  const [sdkStatus, setSdkStatus] = useState('loading')
  const [query, setQuery] = useState(editStay ? editStay.name.split('·')[0].trim() : '홍대')
  const [searchResults, setSearchResults] = useState([])
  // 'idle' | 'searching' | 'ok' | 'zero' | 'error' — 검색 요청 자체의 상태
  // (검색 결과 0건과 검색 실패를 구분하기 위해 따로 둠)
  const [searchStatus, setSearchStatus] = useState('idle')
  const [selected, setSelected] = useState(null) // { name, address, lat, lng }
  const [checkIn, setCheckIn] = useState(editStay?.checkIn || '')
  const [checkOut, setCheckOut] = useState(editStay?.checkOut || '')
  const [locationError, setLocationError] = useState('')
  const [dateRangeError, setDateRangeError] = useState('')

  // 숙소 체크인/체크아웃은 TripDateView에서 정한 여행 기간(시작일~종료일) 기준 전후 +1일까지만
  // 고를 수 있게 함 - 여행 기간이 3일이면 숙소는 그 앞뒤로 하루씩 여유를 두고 잡을 수 있는 정도로 제한.
  const { startDate: tripStartDate, endDate: tripEndDate } = tripData.tripDates || {}
  const allowedMinDate = tripStartDate ? addDaysToIso(tripStartDate, -1) : null
  const allowedMaxDate = tripEndDate ? addDaysToIso(tripEndDate, 1) : null

  function validateStayDates(nextCheckIn, nextCheckOut) {
    if (!allowedMinDate || !allowedMaxDate) return ''
    if (nextCheckIn && (nextCheckIn < allowedMinDate || nextCheckIn > allowedMaxDate)) {
      return `체크인은 ${allowedMinDate.slice(5)} ~ ${allowedMaxDate.slice(5)} 사이여야 해요.`
    }
    if (nextCheckOut && (nextCheckOut < allowedMinDate || nextCheckOut > allowedMaxDate)) {
      return `체크아웃은 ${allowedMinDate.slice(5)} ~ ${allowedMaxDate.slice(5)} 사이여야 해요.`
    }
    // 다른 숙소들과 날짜가 겹치면 안 됨 (수정 중인 숙소 자기 자신은 비교에서 제외)
    if (nextCheckIn && nextCheckOut) {
      const overlapsWith = tripData.stays.find((s) => {
        if (editStay && s.id === editStay.id) return false
        return nextCheckIn < s.checkOut && s.checkIn < nextCheckOut
      })
      if (overlapsWith) {
        return `'${overlapsWith.name}' 숙소랑 날짜가 겹쳐요 (${overlapsWith.checkIn} ~ ${overlapsWith.checkOut}).`
      }
    }
    return ''
  }

  // 카카오맵 SDK 로드 + 지도 생성 (최초 1번)
  useEffect(() => {
    let cancelled = false
    let timeoutId = null

    if (!window.kakao || !window.kakao.maps) {
      console.warn(
        '[카카오맵] SDK를 못 찾았어요. index.html에 <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=...">가 있는지 확인해주세요.'
      )
      // 스크립트가 뒤늦게 붙는 경우를 대비해 잠깐 기다렸다가 그래도 없으면 에러 처리
      timeoutId = setTimeout(() => {
        if (!cancelled) setSdkStatus('error')
      }, SDK_LOAD_TIMEOUT_MS)
      return () => {
        cancelled = true
        clearTimeout(timeoutId)
      }
    }

    // window.kakao.maps.load 콜백이 안 불릴 가능성(appkey 오류 등)에 대비한 타임아웃
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
          console.error('[카카오맵] 지도 생성 실패', e)
          setSdkStatus('error')
        }
      })
    } catch (e) {
      console.error('[카카오맵] SDK 초기화 실패', e)
      clearTimeout(timeoutId)
      setSdkStatus('error')
    }

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  // 검색 결과 마커들을 지도에 그리는 함수
  function drawResultMarkers(results) {
    const map = mapObjRef.current
    if (!map) return

    // 이전 마커 지우기
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    if (results.length === 0) return

    const bounds = new window.kakao.maps.LatLngBounds()
    results.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x)
      const marker = new window.kakao.maps.Marker({ map, position })
      window.kakao.maps.event.addListener(marker, 'click', () => selectPlace(place))
      markersRef.current.push(marker)
      bounds.extend(position)
    })
    map.setBounds(bounds)
  }

  // 검색어로 카카오 장소검색(키워드) 실행
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
        // ERROR 등 그 외 상태 - 카카오 서버 쪽 문제나 네트워크 문제로 봄
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

  // 검색어 바뀔 때마다 살짝 텀 두고 검색 (매 타이핑마다 API 호출하지 않도록)
  useEffect(() => {
    if (sdkStatus !== 'ready') return
    const timer = setTimeout(() => runSearch(query), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sdkStatus])

  // 후보 목록에서 하나를 선택 - 메인(드래그 가능) 마커로 표시
  function selectPlace(place) {
    const map = mapObjRef.current
    setSelected({
      name: place.place_name,
      address: place.road_address_name || place.address_name,
      lat: Number(place.y),
      lng: Number(place.x),
    })

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setMap(null)
    }
    const position = new window.kakao.maps.LatLng(place.y, place.x)
    const marker = new window.kakao.maps.Marker({ map, position, draggable: true, zIndex: 10 })
    window.kakao.maps.event.addListener(marker, 'dragend', () => {
      const pos = marker.getPosition()
      setSelected((prev) => (prev ? { ...prev, lat: pos.getLat(), lng: pos.getLng() } : prev))
    })
    selectedMarkerRef.current = marker
    map.setLevel(3) // 확대해서 선택한 위치를 자세히 보여줌
    map.panTo(position)
  }

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

  const nights = nightsBetween(checkIn, checkOut)
  const stayDateError = isLocationOnlyMode ? '' : validateStayDates(checkIn, checkOut)
  // 새로 추가하는 경우에만 3개 제한 체크 (수정 중인 건 이미 3개 안에 포함된 거라 상관없음,
  // 위치전용모드는 숙소가 아니라서 이 제한 자체가 상관없음)
  const maxStaysError =
    !isLocationOnlyMode && !editStay && tripData.stays.length >= 3
      ? '숙소는 최대 3개까지만 등록할 수 있어요.'
      : ''
  const canAdd = isLocationOnlyMode
    ? Boolean(selected)
    : selected && nights && !stayDateError && !maxStaysError

  function addStay() {
    if (!canAdd) return

    // 위치전용모드 - 숙소가 아니라 "출발지/도착지" 하나만 정하는 거라 저장 방식이 다름
    if (isLocationOnlyMode) {
      const newPlace = {
        type: 'custom',
        name: selected.name,
        address: selected.address,
        lat: selected.lat,
        lon: selected.lng,
      }
      if (!editLocation.date) {
        // 1일차 출발지 / 마지막날 도착지 - tripData.departure 또는 arrival에 바로 저장
        updateTrip({ [editLocation.field]: newPlace })
      } else {
        // 중간 날짜 - 그 날짜용 dayLocationOverrides에만 저장
        const prevOverrides = tripData.dayLocationOverrides || {}
        const prevForDay = prevOverrides[editLocation.date] || {}
        updateTrip({
          dayLocationOverrides: {
            ...prevOverrides,
            [editLocation.date]: { ...prevForDay, [editLocation.field]: newPlace },
          },
        })
      }
      navigate(-1) // 원래 있던 화면(ScheduleTableView 등)으로 돌아감
      return
    }

    const savedStay = {
      id: editStay ? editStay.id : Date.now(),
      name: selected.name,
      address: selected.address,
      lat: selected.lat,
      lon: selected.lng,
      checkIn,
      checkOut,
    }
    if (editStay) {
      // 수정 모드 - 같은 id를 가진 기존 숙소를 새 값으로 교체
      updateTrip({
        stays: tripData.stays.map((s) => (s.id === editStay.id ? savedStay : s)),
      })
    } else {
      updateTrip({ stays: [...tripData.stays, savedStay] })
    }
    navigate('/trip/date')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isLocationOnlyMode ? (
              <>
                {editLocation.field === 'departure' ? '출발지를' : '도착지를'}
                <br />
                지도에서 찾아요
              </>
            ) : editStay ? (
              <>
                숙소 위치를
                <br />
                수정해요
              </>
            ) : (
              <>
                숙소를 검색해
                <br />
                지도에 표시해요
              </>
            )}
          </h1>
          <div className={styles['search-row']}>
            <span className={styles['search-icon']}>⌕</span>
            <input
              className={styles['search-input']}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="지역, 역, 숙소 이름으로 검색"
              disabled={sdkStatus === 'error'}
            />
            {query && (
              <button type="button" className={styles['clear-btn']} onClick={() => setQuery('')}>
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.scrollArea}>
        {/* 실제 카카오맵이 그려지는 영역 */}
        <div className={styles['map-area']}>
          <div ref={mapRef} className={styles['map-canvas']} />
          {sdkStatus === 'loading' && (
            <div className={styles['map-loading']}>지도를 불러오는 중이에요...</div>
          )}
          {sdkStatus === 'error' && (
            <div className={styles['map-loading']}>
              지도를 불러오지 못했어요. 인터넷 연결을 확인하거나 잠시 후 새로고침 해주세요.
            </div>
          )}
          {sdkStatus === 'ready' && searchStatus === 'ok' && searchResults.length > 0 && (
            <div className={styles['map-badge']}>{searchResults.length}곳 검색됨</div>
          )}
          <button
            type="button"
            className={styles['map-locate-btn']}
            title="내 위치"
            onClick={useMyLocation}
            disabled={sdkStatus !== 'ready'}
          >
            ⊙
          </button>
        </div>

        {locationError && (
          <p className={styles['field-label']} style={{ padding: '10px 16px 0', color: 'var(--color-danger)' }}>
            {locationError}
          </p>
        )}

        <div className={styles['result-section']}>
          {searchStatus === 'zero' && (
            <p className={styles['field-label']}>
              '{query}'(으)로 검색된 곳이 없어요. 다른 키워드로 검색해보세요.
            </p>
          )}
          {searchStatus === 'error' && (
            <p className={styles['field-label']} style={{ color: 'var(--color-danger)' }}>
              검색 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.
            </p>
          )}

          {/* 검색 결과 후보 목록 */}
          {searchStatus === 'ok' && searchResults.length > 0 && (
            <div className={styles['result-list']}>
              {searchResults.slice(0, 5).map((place) => (
                <div
                  key={place.id}
                  className={`${styles['result-list-item']} ${
                    selected?.name === place.place_name ? styles.active : ''
                  }`}
                  onClick={() => selectPlace(place)}
                >
                  <span className={styles['result-list-name']}>{place.place_name}</span>
                  <span className={styles['result-list-address']}>
                    {place.road_address_name || place.address_name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {selected ? (
            <div className={styles['result-card']}>
              <div className={styles['result-icon']}><Icon name="building" size={18} color="var(--color-primary-500)" /></div>
              <div>
                <div className={styles['result-name-row']}>
                  <span className={styles['result-name']}>{selected.name}</span>
                </div>
                <p className={styles['result-address']}>{selected.address}</p>
                <p className={styles['result-detail']}>지도 위 마커를 드래그해서 위치를 조정할 수 있어요.</p>
              </div>
            </div>
          ) : (
            <p className={styles['field-label']}>
              검색 결과 목록에서 숙소를 하나 선택해주세요.
            </p>
          )}

          {!isLocationOnlyMode && (
            <>
              <div className={styles['stay-head']}>
                <span className={styles['stay-label']}>체류 기간</span>
                {nights && <span className={styles['stay-nights']}>{nights}박 {nights + 1}일</span>}
              </div>

              {allowedMinDate && allowedMaxDate && (
                <p className={styles['field-label']}>
                  여행 기간 기준 {allowedMinDate.slice(5)} ~ {allowedMaxDate.slice(5)} 사이만 가능해요.
                </p>
              )}

              <DateRangeSheet
                checkIn={checkIn}
                checkOut={checkOut}
                min={allowedMinDate || undefined}
                max={allowedMaxDate || undefined}
                onConfirm={(nextCheckIn, nextCheckOut) => {
                  setCheckIn(nextCheckIn)
                  setCheckOut(nextCheckOut)
                }}
              />

              {stayDateError && (
                <p className={styles['field-label']} style={{ color: 'var(--color-danger)' }}>
                  {stayDateError}
                </p>
              )}
              {maxStaysError && (
                <p className={styles['field-label']} style={{ color: 'var(--color-danger)' }}>
                  {maxStaysError}
                </p>
              )}
            </>
          )}

          {/* 06 버튼 규칙 - 정보(숙박일수)는 버튼 밖 캡션으로, 버튼엔 행동만 담음 */}
          {!isLocationOnlyMode && nights && selected && (
            <p style={{ margin: '0 0 8px', fontSize: 12.5, color: 'var(--color-ink-600)' }}>
              {nights}박 · {selected.name}
            </p>
          )}
        </div>
        </div>

        <div className={styles.footer}>
          <div className={styles['bottom-row']}>
            <button
              type="button"
              className={styles['btn-primary']}
              disabled={!canAdd}
              style={!canAdd ? { background: '#D9D4F5', color: '#fff', cursor: 'default' } : undefined}
              onClick={addStay}
            >
              {isLocationOnlyMode
                ? selected
                  ? `${selected.name}(으)로 정하기`
                  : '지도에서 장소를 골라주세요'
                : !selected
                  ? '지도에서 장소를 골라주세요'
                  : `숙소로 ${editStay ? '수정' : '추가'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
