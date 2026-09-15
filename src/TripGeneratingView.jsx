import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch } from './api'
import Icon from './Icon'
import { useLanguage } from './LanguageContext'
import styles from './TripGeneratingView.module.css'

// trip_density_no: 백엔드 확인 완료 - 1=A(여유 우선) / 2=B(적당히) / 3=C(많이 보기)
const PACE_OPTIONS = [
  { id: 'A', density_no: 1 },
  { id: 'B', density_no: 2 },
  { id: 'C', density_no: 3 },
]

// 백엔드 에러 detail은 API 키·환경변수명·필드 경로 같은 개발자용 정보를 담고 있을 수 있어서
// 화면에 그대로 보여주지 않음 (디자인 가이드 - 보안·신뢰 원칙). 원본은 콘솔 로그로만 남기고,
// 사용자에게는 항상 미리 정해둔 사람이 이해할 문장(fallback)만 보여줌.
function parseErrorDetail(detail, fallback) {
  if (detail) console.error('[동선 생성 실패]', detail)
  return fallback
}

// ConfirmView에서 "동선 만들기" 버튼을 누르면 이 화면으로 넘어와서
// 실제 3단계 API 호출(POST /trips → POST /trips/{trip_no}/recommend → POST /trip-routes)을
// 여기서 실행함. 오래 걸리는 작업이라 별도 로딩 화면으로 분리함.
// 완료되면 /trip/ready(완료 안내)로, 실패하면 이 화면에서 에러+재시도 보여줌.
export default function TripGeneratingView() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  // 로딩 화면에서 스윽 지나가며 순환 표시할 문구 3개 - 자동 줄바꿈에 맡기면 이상한 지점에서
  // 잘려서, 쉼표 등 자연스러운 끊어읽기 지점에서 직접 2줄로 나눠둠 (언어별 배열은 translations.js에 있음)
  const LOADING_TITLES = t('tripGenerating.loadingTitles')
  const { tripData, updateTrip } = useTrip()
  const [progress, setProgress] = useState(0) // 0~100, 단계별로 올라감
  const [statusLabel, setStatusLabel] = useState(t('tripGenerating.startingLabel'))
  const [error, setError] = useState('')
  const hasStartedRef = useRef(false)
  const [titleIndex, setTitleIndex] = useState(0) // 항상 0번(5번 문구)부터 시작

  const {
    selectedEvent,
    tripDates,
    stays,
    departure,
    arrival,
    rankedCategoryIds,
    paceMembers,
    allEventMemberIds,
    isWholeGroupSelected,
    paceArtistGroupNo,
    selectedPace,
  } = tripData

  async function runGeneration() {
    setError('')
    setProgress(5)
    setStatusLabel(t('tripGenerating.startingLabel'))
    const startedAt = Date.now()
    // 문구 3개가 한 바퀴는 다 보이도록 최소 노출 시간을 보장함 - API가 빨리 끝나면
    // 두 번째 문구도 못 보고 바로 다음 화면으로 넘어가버리는 문제가 있었음
    const MIN_DURATION_MS = LOADING_TITLES.length * 3000

    if (!selectedEvent || rankedCategoryIds.length === 0 || !departure || !arrival) {
      setError(t('tripGenerating.missingInfoError'))
      return
    }

    let artistGroupNo = null
    let artistNos = null
    if (isWholeGroupSelected) {
      artistGroupNo = paceArtistGroupNo
      if (!artistGroupNo) {
        setError(t('confirm.errorNoGroupInfo'))
        return
      }
    } else {
      artistNos = paceMembers.length > 0 ? paceMembers : allEventMemberIds
      if (!artistNos || artistNos.length === 0) {
        setError(t('confirm.errorNoMemberInfo'))
        return
      }
    }

    const density = PACE_OPTIONS.find((p) => p.id === (selectedPace || 'B'))
    const accoms = stays.map((s) => ({
      accom_nm: s.name,
      add: s.address || '',
      accom_lat: s.lat || 0,
      accom_lon: s.lon || 0,
      check_in_dt: s.checkIn,
      check_out_dt: s.checkOut,
    }))

    const tripCreatePayload = {
      event_no: selectedEvent.event_no,
      event_date: selectedEvent.event_date,
      start_dt: tripDates.startDate,
      end_dt: tripDates.endDate,
      start_tm: `${tripDates.startDate}T${tripDates.startTime}:00`,
      end_tm: `${tripDates.endDate}T${tripDates.endTime}:00`,
      start_place: departure.name,
      start_place_lat: departure.lat,
      start_place_lon: departure.lon,
      end_place: arrival.name,
      end_place_lat: arrival.lat,
      end_place_lon: arrival.lon,
      accoms,
      ctg_nos: rankedCategoryIds.map((c) => c.id),
      trip_density_no: density?.density_no,
    }
    // 그룹 전체 선택이면 artist_group_no만, 개별 멤버 선택이면 artist_nos만 보냄.
    // 둘 다 항상 키를 넣고 안 쓰는 쪽을 null로 채우면, 백엔드가 "리스트가 와야 하는데 null이 왔다"고
    // 422(Input should be a valid list)를 내는 경우가 있어서 - 안 쓰는 키는 아예 객체에서 뺌.
    if (artistGroupNo) {
      tripCreatePayload.artist_group_no = artistGroupNo
    } else {
      tripCreatePayload.artist_nos = artistNos
    }

    function fail(message) {
      setError(message)
    }

    try {
      // 1단계 - 여행 생성
      setStatusLabel(t('tripGenerating.savingTripLabel'))
      const createRes = await apiFetch('/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripCreatePayload),
      })
      if (!createRes.ok) {
        const data = await createRes.json().catch(() => null)
        const message = parseErrorDetail(data?.detail, t('tripGenerating.tripSaveFailedError'))
        fail(message)
        return
      }
      const created = await createRes.json()
      const tripNo = created.trip_no
      setProgress(35)

      // 2단계 - 동선 추천 계산
      setStatusLabel(t('tripGenerating.calculatingLabel'))
      const recommendRes = await apiFetch(`/trips/${tripNo}/recommend`, { method: 'POST' })
      if (!recommendRes.ok) {
        const data = await recommendRes.json().catch(() => null)
        const message = parseErrorDetail(data?.detail, t('tripGenerating.routeCalcFailedError'))
        fail(message)
        return
      }
      const recommendResult = await recommendRes.json()
      const days = recommendResult.days || []
      const warning = recommendResult.warning || null
      setProgress(70)

      // 3단계 - 계산된 동선 저장
      setStatusLabel(t('tripGenerating.savingRouteLabel'))
      const routes = days.flatMap((day) =>
        (day.schedule || []).map((s) => ({ visit_day: day.visit_day, event_no: s.event_no }))
      )
      const saveRes = await apiFetch('/trip-routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip_no: tripNo, routes }),
      })
      if (!saveRes.ok) {
        const data = await saveRes.json().catch(() => null)
        const message = parseErrorDetail(data?.detail, t('tripGenerating.routeSaveFailedError'))
        fail(message)
        return
      }

      updateTrip({
        tripNo,
        routesSaved: true,
        generatedDays: days,
        generatedSummary: recommendResult.summary || null,
        generatedWarning: warning,
      })

      const elapsed = Date.now() - startedAt
      const remaining = Math.max(MIN_DURATION_MS - elapsed, 0)
      setTimeout(() => {
        setProgress(100)
        setStatusLabel(t('tripGenerating.completeLabel'))
        // 완료 표시를 잠깐 보여준 뒤 안내 화면으로 이동
        setTimeout(() => navigate('/trip/ready'), 500)
      }, remaining)
    } catch (e) {
      fail(t('login.connectionError'))
    }
  }

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    runGeneration()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 08 로딩 화면 규칙 - 메시지 전환은 2~3초 간격으로 자동 전환. 3초마다 다음 문구로
  // 스윽 넘어감, 에러 화면이면 멈춤
  useEffect(() => {
    if (error) return
    const timer = setInterval(() => {
      setTitleIndex((i) => (i + 1) % LOADING_TITLES.length)
    }, 3000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  function retry() {
    hasStartedRef.current = true
    runGeneration()
  }

  return (
    <div className={`${styles.screen} ${error ? styles.screenError : ''}`}>
      {!error && (
        <>
          {/* 08 로딩 화면 규칙 - 점(dot) 3개로 "현재 어떤 문구가 떠 있는지" 순번을 보여줌
              (같이 통통 튀는 범용 스피너가 아니라, 지금 문구에 해당하는 점만 강조) */}
          <div className={styles.spinner}>
            {LOADING_TITLES.map((_, i) => (
              <div
                key={i}
                className={`${styles['spinner-dot']} ${i === titleIndex ? styles.active : ''}`}
              />
            ))}
          </div>
          <h1 key={titleIndex} className={styles.title}>
            {LOADING_TITLES[titleIndex].map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p className={styles.subtitle}>{t('common.slogan')}</p>

          <div className={styles['progress-wrap']}>
            <div className={styles['progress-track']}>
              <div className={styles['progress-fill']} style={{ width: `${progress}%` }} />
            </div>
            <p className={styles['progress-label']}>{statusLabel}</p>
          </div>
        </>
      )}

      {error && (
        <div className={styles['error-box']}>
          <Icon name="warning" size={32} color="var(--color-danger)" style={{ marginBottom: 12 }} />
          <p className={styles['error-text']}>{error}</p>
          <div className={styles['error-actions']}>
            <button type="button" className={styles['btn-white']} onClick={retry}>
              {t('tripGenerating.retryButton')}
            </button>
            <button type="button" className={styles['btn-outline']} onClick={() => navigate('/trip/confirm')}>
              {t('tripGenerating.backButton')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
