import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { useLanguage } from './LanguageContext'
import styles from './LocationSearchModal.module.css'

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 }
const SDK_LOAD_TIMEOUT_MS = 6000

// TripDateView.jsx의 "공용 지도 검색 오버레이"와 동일한 모양·동작을 하는 독립 컴포넌트.
// 숙소 체크인/체크아웃 같은 필드는 없고, 장소 하나를 지도에서 골라 확정하는 용도로만 씀
// (ScheduleTableView의 "위치변경"처럼 이미 여행이 시작된 화면에서 출발/도착지만 바꿀 때).
//
// props:
//  - title: 팝업 헤더에 보여줄 문구 (예: "출발지 검색")
//  - initialPlace: { name, address, lat, lon } | null - 미리 채워둘 장소(수정 진입 시)
//  - onConfirm(place): 확정 버튼 눌렀을 때 호출
//  - onClose(): 닫기
export default function LocationSearchModal({ title, initialPlace, onConfirm, onClose }) {
  const { t } = useLanguage()
  const mapRef = useRef(null)
  const mapObjRef = useRef(null)
  const placesRef = useRef(null)
  const markersRef = useRef([])
  const selectedMarkerRef = useRef(null)

  const [sdkStatus, setSdkStatus] = useState('loading')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchStatus, setSearchStatus] = useState('idle')
  const [pickedPlace, setPickedPlace] = useState(initialPlace || null)
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
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
          const center = initialPlace
            ? new window.kakao.maps.LatLng(initialPlace.lat, initialPlace.lon)
            : new window.kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng)
          const map = new window.kakao.maps.Map(mapRef.current, {
            center,
            level: initialPlace ? 3 : 5,
          })
          mapObjRef.current = map
          placesRef.current = new window.kakao.maps.services.Places()
          setSdkStatus('ready')

          if (initialPlace) {
            const marker = new window.kakao.maps.Marker({
              map,
              position: center,
              draggable: true,
              zIndex: 10,
            })
            window.kakao.maps.event.addListener(marker, 'dragend', () => {
              const pos = marker.getPosition()
              setPickedPlace((prev) => (prev ? { ...prev, lat: pos.getLat(), lon: pos.getLng() } : prev))
            })
            selectedMarkerRef.current = marker
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  function useMyLocation() {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError(t('locationSearch.geoUnsupported'))
      return
    }
    if (!mapObjRef.current) {
      setLocationError(t('locationSearch.mapNotReady'))
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
          setLocationError(t('locationSearch.geoPermissionDenied'))
        } else {
          setLocationError(t('locationSearch.geoFailed'))
        }
      }
    )
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles['search-overlay']} onClick={handleOverlayClick} data-fab-hide="true">
      <div
        className={styles['search-panel']}
        style={{ maxHeight: '95vh', overflowY: 'auto', borderRadius: 24 }}
      >
        <div className={styles['search-panel-header']}>
          <span>{title}</span>
          <button type="button" className={styles['close-btn']} onClick={onClose}>
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
            placeholder={t('locationSearch.searchPlaceholder')}
            disabled={sdkStatus === 'error'}
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('locationSearch.clearSearch')}
              style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 6, display: 'flex' }}
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>

        <div className={styles['map-area']} style={{ position: 'relative', height: '317px', minHeight: '317px' }}>
          <div ref={mapRef} className={styles['map-canvas']} style={{ width: '100%', height: '100%' }} />
          {sdkStatus === 'loading' && <div className={styles['map-loading']}>{t('locationSearch.mapLoading')}</div>}
          {sdkStatus === 'error' && (
            <div className={styles['map-loading']}>
              {t('locationSearch.mapLoadError')}
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
              {t('locationSearch.resultsCount')(searchResults.length)}
            </div>
          )}
          <button
            type="button"
            title={t('locationSearch.myLocation')}
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

        {locationError && (
          <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>
            {locationError}
          </p>
        )}

        {searchStatus === 'zero' && (
          <p className={styles.hint}>{t('locationSearch.zeroResult')(query)}</p>
        )}
        {searchStatus === 'error' && (
          <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>
            {t('locationSearch.searchError')}
          </p>
        )}

        {searchStatus === 'ok' && searchResults.length > 0 && (
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
            <div style={{ marginTop: 4, fontSize: 11.5, color: 'rgba(27,22,63,0.58)' }}>{pickedPlace.address}</div>
            <div style={{ marginTop: 5, fontSize: 11, color: 'var(--color-primary-500)' }}>
              {t('locationSearch.dragHint')}
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ padding: '14px 16px 16px' }}>
          <button
            type="button"
            className={styles['btn-primary']}
            disabled={!pickedPlace}
            style={!pickedPlace ? { background: 'var(--button-bg-disabled)', color: '#fff', cursor: 'default', width: '100%' } : { width: '100%' }}
            onClick={() => pickedPlace && onConfirm(pickedPlace)}
          >
            {!pickedPlace ? t('locationSearch.pickPlaceholder') : t('locationSearch.confirmPlace')(pickedPlace.name)}
          </button>
        </div>
      </div>
    </div>
  )
}
