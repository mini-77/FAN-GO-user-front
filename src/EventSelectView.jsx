import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch } from './api'
import AppHeader from './AppHeader'
import EventDetailModal from './EventDetailModal'
import styles from './EventSelectView.module.css'

// 오늘 날짜의 00:00 기준 - 이미 지난 날짜는 화면에 안 보여줌
// (원래는 백엔드 GET /events/main이 "앞으로 있을 일정"만 내려줘야 하는데,
// 지금은 지난 일정까지 다 내려주고 있어서 프론트에서 한 번 더 걸러줌)
function getTodayStart() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

// Date 객체를 'YYYY-MM-DD'로 바꿀 때 절대 toISOString()을 쓰면 안 됨 - UTC로 변환하면서
// 한국 시간 기준 날짜가 하루 당겨지는 버그가 생김 (예: 9/18 로컬 자정 -> UTC로는 9/17 15:00,
// 그래서 toISOString().slice(0,10)을 하면 "9/17"이 나와버림). 로컬 값 그대로 조립해야 함.
function toLocalIsoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 멀티데이 이벤트(start_dt~end_dt)를 하루짜리 카드 여러 개로 쪼갬 (백엔드는 원본 그대로 주고,
// 하루씩 쪼개서 보여주는 건 프론트 몫이라고 명세에 적혀있음)
function expandEventToDayCards(event) {
  const start = new Date(event.start_dt)
  const end = new Date(event.end_dt)
  const cards = []

  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  const todayStart = getTodayStart()
  let dayIndex = 1
  const totalDays = Math.round((endDay - cursor) / (1000 * 60 * 60 * 24)) + 1

  while (cursor <= endDay) {
    // 이미 지난 날짜(오늘 이전)는 카드로 안 만듦
    if (cursor >= todayStart) {
      const dateStr = toLocalIsoDate(cursor) // YYYY-MM-DD
      const dateLabel = `${String(cursor.getMonth() + 1).padStart(2, '0')}.${String(cursor.getDate()).padStart(2, '0')}`
      // 시간 정보는 이벤트 전체에 start_dt 하나뿐이라, 매일 같은 시각으로 가정 (TODO: 실제로 날짜별 시간이
      // 다르면 백엔드에 날짜별 시간 필드 추가 필요)
      const timeLabel = start.toTimeString().slice(0, 5)

      cards.push({
        key: `${event.event_no}-${dateStr}`,
        event_no: event.event_no,
        event_date: dateStr,
        dateLabel,
        timeLabel,
        title: event.event_nm + (totalDays > 1 ? ` (${dayIndex}일차)` : ''),
        address: event.add,
        artist_group_no: event.artist_group_no,
      })
    }

    cursor.setDate(cursor.getDate() + 1)
    dayIndex += 1
  }

  return cards
}

export default function EventSelectView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()

  const [favoriteGroups, setFavoriteGroups] = useState([])
  const [groupFilter, setGroupFilter] = useState('') // '' = 전체(즐겨찾기 그룹 합산)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedCard, setSelectedCard] = useState(
    tripData.selectedEvent
      ? { key: `${tripData.selectedEvent.event_no}-${tripData.selectedEvent.event_date}` }
      : null
  )
  const [detailCard, setDetailCard] = useState(null) // 팝업용 - 정보 확인 목적으로 띄우는 카드
  const [errorMessage, setErrorMessage] = useState('')
  // 목록이 길어지면 한 번에 다 안 보여주고 5개씩 "더보기"로 늘려서 보여줌
  const PAGE_SIZE = 5
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // 즐겨찾기 그룹 목록 (드롭다운용) - 최초 1회만
  useEffect(() => {
    let cancelled = false
    async function loadFavoriteGroups() {
      try {
        const res = await apiFetch('/me/favorite-groups')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setFavoriteGroups(data)
      } catch (e) {
        // 조용히 무시 - 그룹 필터 없이도 전체 이벤트는 보여줄 수 있음
      }
    }
    loadFavoriteGroups()
    return () => {
      cancelled = true
    }
  }, [])

  // 이벤트 목록 - groupFilter 바뀔 때마다 다시 불러옴
  useEffect(() => {
    let cancelled = false
    async function loadEvents() {
      setIsLoading(true)
      setLoadError('')
      try {
        const url = groupFilter
          ? `/events/main?artist_group_no=${groupFilter}`
          : '/events/main'
        const res = await apiFetch(url)
        if (res.status === 401) {
          throw new Error('로그인이 만료됐어요. 다시 로그인해주세요.')
        }
        if (res.status === 403) {
          const data = await res.json().catch(() => null)
          throw new Error(
            typeof data?.detail === 'string' ? data.detail : '즐겨찾기한 그룹이 아니에요.'
          )
        }
        if (!res.ok) throw new Error('이벤트 목록을 불러오지 못했어요.')
        const data = await res.json()
        if (!cancelled) {
          setEvents(data)
          setVisibleCount(PAGE_SIZE)
        }
      } catch (e) {
        if (!cancelled) setLoadError(e.message || '이벤트 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadEvents()
    return () => {
      cancelled = true
    }
  }, [groupFilter])

  const dayCards = useMemo(() => events.flatMap(expandEventToDayCards), [events])

  function selectCard(card) {
    setSelectedCard(card)
    setErrorMessage('')
    setDetailCard(card) // 선택과 동시에 정보 확인 팝업도 띄움
  }

  const selectedCardData = dayCards.find((c) => selectedCard && c.key === selectedCard.key)

  const districtLabel = useMemo(() => {
    if (!selectedCardData) return null
    const match = selectedCardData.address?.match(/(\S+구)/)
    return match ? match[1] : selectedCardData.address
  }, [selectedCardData])

  function goNext() {
    setErrorMessage('')
    if (!selectedCardData) {
      setErrorMessage('이벤트를 하나 골라주세요.')
      return
    }
    updateTrip({
      selectedEvent: {
        event_no: selectedCardData.event_no,
        event_date: selectedCardData.event_date,
        title: selectedCardData.title,
        address: selectedCardData.address,
        artist_group_no: selectedCardData.artist_group_no,
      },
    })
    navigate('/trip/date')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.header}>
          <div className={styles['header-row']}>
            <span className={styles['step-label']}>01 — 04</span>
          </div>
          <h1 className={styles.title}>어떤 이벤트에 참여하시나요?</h1>
          <div className={styles['progress-bar']}>
            <div className={`${styles['progress-seg']} ${styles.active}`} />
            <div className={styles['progress-seg']} />
            <div className={styles['progress-seg']} />
            <div className={styles['progress-seg']} />
          </div>
        </div>

        <div className={styles['filter-section']}>
          <div>
            <label className={styles['field-label']}>그룹 · 아티스트</label>
            <select
              className={styles.select}
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            >
              <option value="">전체 아티스트</option>
              {favoriteGroups.map((g) => (
                <option key={g.artist_group_no} value={g.artist_group_no}>
                  {g.group_nm}
                </option>
              ))}
            </select>
          </div>
          <p className={styles.hint}>
            가입할 때 고른 팀의 콘서트와 공식 팬미팅만 보여 드려요. 하나만 고를 수 있고, 고른
            <br />
            이벤트는 시작일시와 주소가 그대로 지도에 꽂혀요.
          </p>
        </div>

        <div className={styles['event-list']}>
          {isLoading && <p className={styles.hint}>이벤트 목록을 불러오는 중이에요...</p>}
          {!isLoading && loadError && <p className={styles.hint}>{loadError}</p>}
          {!isLoading && !loadError && dayCards.length === 0 && (
            <p className={styles.hint}>
              고를 수 있는 이벤트가 없어요. 가입할 때 고른 팀의 예정된 콘서트/팬미팅이 없거나,
              팬덤을 먼저 골라야 해요.
            </p>
          )}
          {!isLoading &&
            !loadError &&
            dayCards.slice(0, visibleCount).map((card) => {
              const isSelected = selectedCard?.key === card.key
              return (
                <div
                  key={card.key}
                  className={`${styles['event-row']} ${isSelected ? styles.pinned : ''}`}
                  onClick={() => selectCard(card)}
                >
                  <div className={styles['event-datetime']}>
                    <span className={styles['event-date']}>{card.dateLabel}</span>
                    <span className={styles['event-time']}>{card.timeLabel}</span>
                  </div>
                  <div className={styles['event-text']}>
                    <span className={styles['event-title']}>{card.title}</span>
                    <span className={styles['event-venue']}>{card.address}</span>
                  </div>
                  <span className={styles['event-toggle']}>{isSelected ? '고정 ✓' : '＋'}</span>
                </div>
              )
            })}
          {!isLoading && !loadError && dayCards.length > visibleCount && (
            <button
              type="button"
              className={styles['load-more-btn']}
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            >
              더보기 ({dayCards.length - visibleCount})
            </button>
          )}
        </div>

        <div className={styles['map-summary']}>
          {selectedCardData ? (
            <>
              <p className={styles['map-summary-text']}>{selectedCardData.title}</p>
              <p className={styles['map-summary-sub']}>
                {selectedCardData.dateLabel} · {selectedCardData.timeLabel} · {districtLabel}
              </p>
            </>
          ) : (
            <p className={styles['map-summary-text']}>아직 고른 이벤트가 없어요</p>
          )}
        </div>

        {errorMessage && (
          <p className={styles.hint} style={{ padding: '0 16px', color: 'var(--color-danger)' }}>
            {errorMessage}
          </p>
        )}

        <div className={styles.footer} data-bottom-bar="true">
          <button
            type="button"
            className={styles['btn-primary']}
            style={!selectedCardData ? { background: '#D9D4F5', color: 'var(--color-primary-600)', cursor: 'default' } : undefined}
            onClick={goNext}
          >
            다음: 기간·숙소
          </button>
        </div>
      </div>

      {detailCard && (
        <EventDetailModal
          card={detailCard}
          onClose={() => setDetailCard(null)}
        />
      )}
    </div>
  )
}
