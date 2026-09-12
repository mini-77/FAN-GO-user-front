import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch } from './api'
import AppHeader from './AppHeader'
import styles from './PaceView.module.css'

// 동선 스타일(밀도) 옵션 - 원래 ConfirmView에 있었는데, "동선 스타일을 정해주세요" 화면인
// 여기(PaceView)가 맞는 위치라서 옮겨옴. trip_density_no 매핑은 백엔드 확인 완료:
// 1=A(여유 우선) / 2=B(적당히) / 3=C(많이 보기)
const PACE_OPTIONS = [
  { id: 'A', density_no: 1, name: '여유 우선', desc: '적게 보고 오래 머물기' },
  { id: 'B', density_no: 2, name: '적당히 (AI 추천)', desc: '팬 취향 적합도가 가장 높은 안' },
  { id: 'C', density_no: 3, name: '많이 보기', desc: '하루에 최대한 많은 곳' },
]

export default function PaceView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  const [isOpen, setIsOpen] = useState(true)
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  // 값은 artist_no - 뒤로 갔다가 다시 오는 경우를 위해 tripData의 이전 선택을 복원함
  const [selectedMembers, setSelectedMembers] = useState(() => new Set(tripData.paceMembers || []))
  // "그룹 전체 선택" 여부 — 이게 true면 개별 멤버 선택은 무시하고
  // POST /trips에 artist_group_no로 보냄 (artist_group_no와 artist_nos는 배타적)
  const [isWholeGroupSelected, setIsWholeGroupSelected] = useState(Boolean(tripData.isWholeGroupSelected))
  // 동선 스타일(밀도) 선택 - 기본값은 B(적당히/AI 추천)
  const [selectedPace, setSelectedPace] = useState(tripData.selectedPace || 'B')

  const eventNo = tripData.selectedEvent?.event_no
  // ⚠️ 확인 필요: 실제 tripData.selectedEvent 구조에 artist_group_no가
  // 이 필드명으로 들어있는지 EventSelectView.jsx / GET /events/{event_no} 응답 확인해주세요.
  const artistGroupNo = tripData.selectedEvent?.artist_group_no

  useEffect(() => {
    if (!eventNo) {
      setIsLoading(false)
      setLoadError('앞에서 이벤트를 먼저 골라야 멤버 목록을 볼 수 있어요.')
      return
    }

    let cancelled = false
    async function loadMembers() {
      setIsLoading(true)
      setLoadError('')
      try {
        const res = await apiFetch(`/events/${eventNo}/members`)
        if (res.status === 401) {
          throw new Error('로그인이 만료됐어요. 다시 로그인해주세요.')
        }
        if (!res.ok) throw new Error('멤버 목록을 불러오지 못했어요.')
        const data = await res.json()
        if (!cancelled) setMembers(data)
      } catch (e) {
        if (!cancelled) setLoadError(e.message || '멤버 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadMembers()
    return () => {
      cancelled = true
    }
  }, [eventNo])

  function toggleMember(artistNo) {
    // 개별 멤버를 고르면 "그룹 전체 선택"은 자동으로 풀림 (배타적 관계)
    setIsWholeGroupSelected(false)
    setSelectedMembers((prev) => {
      const next = new Set(prev)
      if (next.has(artistNo)) next.delete(artistNo)
      else next.add(artistNo)
      return next
    })
  }

  function toggleWholeGroup() {
    setIsWholeGroupSelected((prev) => {
      const next = !prev
      // 그룹 전체를 선택하면 개별 멤버 선택은 비움 (배타적 관계)
      if (next) setSelectedMembers(new Set())
      return next
    })
  }

  function resetSelection() {
    setSelectedMembers(new Set())
    setIsWholeGroupSelected(false)
  }

  const selectedNames = members
    .filter((m) => selectedMembers.has(m.artist_no))
    .map((m) => m.artist_nm)

  const summaryLabel = isWholeGroupSelected
    ? `${tripData.selectedEvent?.title || '전체'} · 그룹 전체`
    : selectedMembers.size > 0
      ? `${selectedMembers.size}명 선택`
      : `${tripData.selectedEvent?.title || '전체'} · 멤버 전체`

  function goNext() {
    updateTrip({
      // POST /trips의 artist_nos로 그대로 들어갈 값 — 그룹 전체 선택 시엔 비움
      paceMembers: isWholeGroupSelected ? [] : Array.from(selectedMembers),
      paceMemberNames: isWholeGroupSelected ? [] : selectedNames,
      // 특정 멤버를 안 골랐을 때 "전체 멤버"로 보낼 수 있게 전체 목록도 같이 저장
      allEventMemberIds: members.map((m) => m.artist_no),
      // 그룹 전체 선택 시 POST /trips의 artist_group_no로 보낼 값
      isWholeGroupSelected,
      paceArtistGroupNo: isWholeGroupSelected ? artistGroupNo : null,
      selectedPace,
    })
    navigate('/trip/confirm')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.header}>
          <div className={styles['header-row']}>
            <span className={styles['step-label']}>04 — 04</span>
          </div>
          <h1 className={styles.title}>동선 스타일을 정해 주세요</h1>
          <div className={styles['progress-bar']}>
            <div className={`${styles['progress-seg']} ${styles.active}`} />
            <div className={`${styles['progress-seg']} ${styles.active}`} />
            <div className={`${styles['progress-seg']} ${styles.active}`} />
            <div className={`${styles['progress-seg']} ${styles.active}`} />
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles['field-label']}>일정 기준</span>

          <button
            type="button"
            className={styles['picker-btn']}
            onClick={() => setIsOpen((v) => !v)}
          >
            <span>{summaryLabel}</span>
            <span className={`${styles['picker-arrow']} ${isOpen ? styles.open : ''}`}>▼</span>
          </button>

          {isOpen && (
            <div className={styles['picker-panel']}>
              {isLoading && <p className={styles.hint}>멤버 목록을 불러오는 중이에요...</p>}
              {!isLoading && loadError && <p className={styles.hint}>{loadError}</p>}

              {!isLoading && !loadError && (
                <>
                  <div>
                    <span className={styles['panel-group-label']}>멤버</span>
                    <div className={styles['chip-row']}>
                      {/* 그룹 전체 선택 칩 — 개별 멤버 칩보다 앞에 표시 */}
                      <button
                        type="button"
                        className={`${styles['member-chip']} ${isWholeGroupSelected ? styles.active : ''}`}
                        onClick={toggleWholeGroup}
                      >
                        그룹 전체
                      </button>
                      {members.map((m) => {
                        const isSelected = selectedMembers.has(m.artist_no)
                        return (
                          <button
                            key={m.artist_no}
                            type="button"
                            className={`${styles['member-chip']} ${isSelected ? styles.active : ''}`}
                            onClick={() => toggleMember(m.artist_no)}
                          >
                            {m.artist_nm}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className={styles['selection-summary-row']}>
                    <span className={styles['selection-summary']}>
                      {isWholeGroupSelected
                        ? '그룹 전체 선택됨'
                        : selectedNames.length > 0
                          ? `${selectedNames.join(', ')} 선택됨`
                          : '선택 안 함'}
                    </span>
                  </div>

                  {/* 초기화/확인을 50:50 한 줄로 - 인라인 flex로 확실하게 고정 */}
                  <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                    <button
                      type="button"
                      className={styles['reset-btn']}
                      style={{ flex: 1, textAlign: 'center' }}
                      onClick={resetSelection}
                    >
                      초기화
                    </button>
                    <button
                      type="button"
                      className={styles['confirm-btn']}
                      style={{ flex: 1 }}
                      onClick={() => setIsOpen(false)}
                    >
                      확인
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <p className={styles.hint}>
            {isWholeGroupSelected
              ? '그룹 전체를 선택하면 그룹 활동 일정 위주로 추천 받아요.'
              : '멤버 선택시 멤버별 일정을 우선 추천 받아요.'}
          </p>
        </div>

        <div className={styles['pace-section']}>
          <span className={styles['pace-label']}>받아볼 동선 안</span>
          <div className={styles['pace-list']}>
            {PACE_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className={`${styles['pace-option']} ${selectedPace === opt.id ? styles.selected : ''}`}
                onClick={() => setSelectedPace(opt.id)}
              >
                <span className={styles['pace-letter']}>{opt.id}</span>
                <div className={styles['pace-text']}>
                  <span className={styles['pace-name']}>{opt.name}</span>
                  <span className={styles['pace-desc']}>{opt.desc}</span>
                </div>
                {selectedPace === opt.id && <span className={styles['pace-check']}>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {!isOpen && (
          <div className={styles.footer}>
            <button type="button" className={styles['btn-primary']} onClick={goNext}>
              다음: 확인
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
