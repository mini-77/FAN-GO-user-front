import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import { useLanguage } from './LanguageContext'
import styles from './ConfirmView.module.css'

// trip_density_no: 백엔드 확인 완료 - 1=A(여유 우선) / 2=B(적당히) / 3=C(많이 보기)
// (선택 UI 자체는 PaceView.jsx로 옮겨감 - "동선 스타일"은 그 화면 담당이 맞아서)
const PACE_OPTIONS = [
  { id: 'A', density_no: 1 },
  { id: 'B', density_no: 2 },
  { id: 'C', density_no: 3 },
]

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
  const { t } = useLanguage()
  const PACE_NAMES = {
    A: `A · ${t('pace.optionARelaxedName')}`,
    B: `B · ${t('pace.optionBModerateName')}`,
    C: `C · ${t('pace.optionCPackedName')}`,
  }
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

  // 필수 값이 하나라도 비어있으면 "일정 만들기" 버튼 자체를 막음 (handleCreateItinerary의
  // 개별 검증과 동일한 조건 - 버튼을 disabled로도 표시해서 클릭 자체가 안 되게 함)
  const isFormValid = Boolean(
    selectedEvent &&
      rankedCategoryIds.length > 0 &&
      firstDeparture &&
      finalArrival &&
      (isWholeGroupSelected
        ? paceArtistGroupNo
        : (paceMembers?.length > 0 || allEventMemberIds?.length > 0))
  )

  // 저장소에 쌓인 실제 값들로 요약 목록 구성
  // "팬덤" 항목은 삭제, "참여행사"가 01번(제일 위)으로 옴
  const summary = [
    {
      num: '01',
      label: t('confirm.participatingEvent'),
      value: selectedEvent
        ? undefined
        : t('confirm.noEventChosen'),
      events: selectedEvent
        ? [{ title: selectedEvent.title, sub: `${formatDot(selectedEvent.event_date)} · ${selectedEvent.address}` }]
        : null,
    },
    {
      num: '02',
      label: t('confirm.startEndDate'),
      value: tripDates
        ? `${formatDot(tripDates.startDate)} — ${tripDates.endDate?.slice(5).replace('-', '.')} · ${t('confirm.nightsCount')(daysBetween(tripDates.startDate, tripDates.endDate))}`
        : '-',
      sub: tripDates ? t('confirm.dailyTimeRange')(tripDates.startTime, tripDates.endTime) : '',
    },
    {
      num: '03',
      label: t('confirm.stayAndDeparture'),
      value: stays.length > 0 ? stays.map((s) => s.name.split(' · ')[0]).join(' · ') : t('confirm.noStay'),
      sub: `${t('confirm.departurePoint')} · ${firstDeparture ? firstDeparture.name : t('confirm.notEntered')} / ${t('confirm.arrivalPoint')} · ${finalArrival ? finalArrival.name : t('confirm.notEntered')}`,
    },
    {
      num: '04',
      label: t('activityPreference.categoryLabel'),
      value:
        rankedCategoryIds.length > 0
          ? rankedCategoryIds.map((c) => c.name).join(' · ')
          : t('confirm.notSelected'),
    },
    {
      num: '05',
      label: t('confirm.preferredMember'),
      value: isWholeGroupSelected
        ? t('pace.wholeGroup')
        : paceMemberNames && paceMemberNames.length > 0
          ? paceMemberNames.join(' · ')
          : t('confirm.noSpecificMember'),
    },
    {
      num: '06',
      label: t('confirm.paceStyle'),
      value: PACE_NAMES[selectedPace] || selectedPace,
    },
  ]

  function handleCreateItinerary() {
    setSubmitError('')

    if (!selectedEvent) {
      setSubmitError(t('confirm.errorNoEvent'))
      return
    }
    if (rankedCategoryIds.length === 0) {
      setSubmitError(t('activityPreference.selectAtLeastOne'))
      return
    }
    if (!firstDeparture) {
      setSubmitError(t('confirm.errorNoDeparture'))
      return
    }
    if (!finalArrival) {
      setSubmitError(t('confirm.errorNoArrival'))
      return
    }
    if (isWholeGroupSelected && !paceArtistGroupNo) {
      setSubmitError(t('confirm.errorNoGroupInfo'))
      return
    }
    if (!isWholeGroupSelected) {
      const artistNos = paceMembers.length > 0 ? paceMembers : allEventMemberIds
      if (!artistNos || artistNos.length === 0) {
        setSubmitError(t('confirm.errorNoMemberInfo'))
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
          <h1 className={styles.title}>{t('confirm.title')}</h1>
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

          {/* 하단 고정 바가 아니라 목록의 마지막 항목으로 스크롤에 같이 움직이게 함
              (사용자 요청 - 다른 화면과 동일하게 고정 해제) */}
          <div className={styles.footer} data-bottom-bar="true">
            <span className={styles['footer-note']}>{t('confirm.footerNote')}</span>
            <button
              type="button"
              className={styles['btn-primary']}
              style={!isFormValid ? { background: 'var(--button-bg-disabled)', cursor: 'default' } : undefined}
              onClick={handleCreateItinerary}
              disabled={!isFormValid}
            >
              {t('schedule.createNewSchedule')}
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}
