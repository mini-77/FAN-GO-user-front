import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import AppHeader from './AppHeader'
import styles from './ConfirmView.module.css'

// trip_density_no: 백엔드 확인 완료 - 1=A(여유 우선) / 2=B(적당히) / 3=C(많이 보기)
// (선택 UI 자체는 PaceView.jsx로 옮겨감 - "동선 스타일"은 그 화면 담당이 맞아서)
const PACE_OPTIONS = [
  { id: 'A', density_no: 1 },
  { id: 'B', density_no: 2 },
  { id: 'C', density_no: 3 },
]
const PACE_NAMES = { A: 'A · 여유 우선', B: 'B · 적당히 (AI 추천)', C: 'C · 많이 보기' }

function formatDot(isoDate) {
  return isoDate ? isoDate.replaceAll('-', '.') : ''
}

function daysBetween(startIso, endIso) {
  const start = new Date(startIso)
  const end = new Date(endIso)
  return Math.round((end - start) / (1000 * 60 * 60 * 24))
}

// "[아티스트명] 이벤트명" 형식의 제목에서 아티스트명 뒤에 줄바꿈을 넣어줌
function splitEventTitle(title) {
  const match = title?.match(/^(\[[^\]]*\])\s*(.*)$/)
  if (!match) return [title]
  return [match[1], match[2]]
}

export default function ConfirmView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  const selectedPace = tripData.selectedPace || 'B'
  const [submitError, setSubmitError] = useState('')

  const {
    selectedEvent,
    tripDates,
    stays,
    departure,
    arrival,
    rankedCategoryIds,
    paceMembers,
    paceMemberNames,
    allEventMemberIds,
    isWholeGroupSelected,
    paceArtistGroupNo,
  } = tripData

  const firstDeparture = departure || null
  const finalArrival = arrival || null

  // 저장소에 쌓인 실제 값들로 요약 목록 구성
  // "팬덤" 항목은 삭제, "참여행사"가 01번(제일 위)으로 옴
  const summary = [
    {
      num: '01',
      label: '참여행사',
      value: selectedEvent
        ? undefined
        : '고른 이벤트 없음 (이벤트 선택 화면에서 먼저 골라주세요)',
      events: selectedEvent
        ? [{ title: selectedEvent.title, sub: `${formatDot(selectedEvent.event_date)} · ${selectedEvent.address}` }]
        : null,
    },
    {
      num: '02',
      label: '시작일 · 완료일',
      value: tripDates
        ? `${formatDot(tripDates.startDate)} — ${tripDates.endDate?.slice(5).replace('-', '.')} · ${daysBetween(tripDates.startDate, tripDates.endDate)}박`
        : '-',
      sub: tripDates ? `매일 ${tripDates.startTime} — ${tripDates.endTime}` : '',
    },
    {
      num: '03',
      label: '숙소 · 출발지',
      value: stays.length > 0 ? stays.map((s) => s.name.split(' · ')[0]).join(' · ') : '숙소 없음',
      sub: `출발지 · ${firstDeparture ? firstDeparture.name : '미입력'} / 도착지 · ${finalArrival ? finalArrival.name : '미입력'}`,
    },
    {
      num: '04',
      label: '선호 카테고리',
      value:
        rankedCategoryIds.length > 0
          ? rankedCategoryIds.map((c) => c.name).join(' · ')
          : '선택 안 함',
    },
    {
      num: '05',
      label: '선호 멤버',
      value: isWholeGroupSelected
        ? '그룹 전체'
        : paceMemberNames && paceMemberNames.length > 0
          ? paceMemberNames.join(' · ')
          : '특정 멤버 없음 (그룹 전체 일정 기준)',
    },
    {
      num: '06',
      label: '동선 스타일',
      value: PACE_NAMES[selectedPace] || selectedPace,
    },
  ]

  function handleCreateItinerary() {
    setSubmitError('')

    if (!selectedEvent) {
      setSubmitError('이벤트를 먼저 골라주세요.')
      return
    }
    if (rankedCategoryIds.length === 0) {
      setSubmitError('선호 카테고리를 1개 이상 골라주세요.')
      return
    }
    if (!firstDeparture) {
      setSubmitError('여행 시작 지점(1일차 출발지)을 먼저 정해주세요.')
      return
    }
    if (!finalArrival) {
      setSubmitError('여행 완료 지점(마지막날 도착지)을 먼저 정해주세요.')
      return
    }
    if (isWholeGroupSelected && !paceArtistGroupNo) {
      setSubmitError('그룹 정보를 확인할 수 없어요. 동선 스타일 화면부터 다시 진행해주세요.')
      return
    }
    if (!isWholeGroupSelected) {
      const artistNos = paceMembers.length > 0 ? paceMembers : allEventMemberIds
      if (!artistNos || artistNos.length === 0) {
        setSubmitError('멤버 정보를 확인할 수 없어요. 앞 화면부터 다시 진행해주세요.')
        return
      }
    }

    // 실제 3단계 API 호출(POST /trips → recommend → trip-routes)은
    // TripGeneratingView(로딩 화면)에서 실행함 - 오래 걸리는 작업이라 화면 분리
    updateTrip({ selectedPace })
    navigate('/trip/generating')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        {/* 뒤로가기는 브라우저 history(-1) 대신 화면을 명시적으로 지정 - 새로고침·직접 진입으로
            히스토리가 없어도 항상 올바른 이전 화면(동선 스타일)으로 감 */}
        <AppHeader onBack={() => navigate('/trip/pace')} />
        <div className={styles.header}>
          <h1 className={styles.title}>이대로 진행할까요?</h1>
          <div className={styles['progress-bar']}>
            <div className={styles['progress-fill']} style={{ width: '100%' }} />
          </div>
          <div className={styles['progress-caption']}>
            <span>4 / 4</span>
            <span>100%</span>
          </div>
        </div>

        <div className={styles.scrollArea}>
          <div className={styles['summary-list']}>
            {summary.map((row) => (
              <div key={row.num} className={styles['summary-row']}>
                {!row.events && <span className={styles['summary-label']}>{row.label}</span>}
                {row.value && <span className={styles['summary-value']}>{row.value}</span>}
                {row.sub && <span className={styles['summary-sub']}>{row.sub}</span>}
                {row.events &&
                  row.events.map((ev) => (
                    <div key={ev.title} className={styles['event-item']}>
                      <div className={styles['event-title']}>
                        {splitEventTitle(ev.title).map((line, i) => (
                          <span key={i}>
                            {i > 0 && <br />}
                            {line}
                          </span>
                        ))}
                      </div>
                      <div className={styles['event-sub']}>{ev.sub}</div>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {submitError && (
            <p className={styles.hint} style={{ padding: '10px 22px 0', color: 'var(--color-danger)' }}>
              {submitError}
            </p>
          )}
        </div>

        <div className={styles.footer} data-bottom-bar="true">
          <span className={styles['footer-note']}>선택한 스타일로 동선을 만들어요</span>
          <button
            type="button"
            className={styles['btn-primary']}
            onClick={handleCreateItinerary}
          >
            일정 만들기
          </button>
        </div>
      </div>
    </div>
  )
}
