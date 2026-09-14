import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch, safeErrorMessage } from './api'
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
  const memberListRef = useRef(null)
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
        if (!cancelled) setLoadError(safeErrorMessage(e, '멤버 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
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

  // 초기화 버튼 공통 가이드 - 그리드 밖에서 전체 선택을 지우는 별도 동작.
  // 선택만 지우는 게 아니라 스크롤도 목록 맨 위로 되돌려서, 뭐가 다 풀렸는지 바로 보이게 함.
  function resetSelection() {
    setSelectedMembers(new Set())
    setIsWholeGroupSelected(false)
    memberListRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
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
        {/* 뒤로가기는 브라우저 history(-1) 대신 화면을 명시적으로 지정 - 새로고침·직접 진입으로
            히스토리가 없어도 항상 올바른 이전 화면(선호 액티비티)으로 감 */}
        <AppHeader onBack={() => navigate('/trip/activities')} />
        <div className={styles.header}>
          <h1 className={styles.title}>동선 스타일을 정해 주세요</h1>
          <div className={styles['progress-bar']}>
            <div className={styles['progress-fill']} style={{ width: '100%' }} />
          </div>
          <div className={styles['progress-caption']}>
            <span>4 / 4</span>
            <span>100%</span>
          </div>
        </div>

        <div className={styles.scrollArea}>
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

          {/* 04 팝업&모달 - 바텀시트 멀티선택: 화면 하단에서 올라오는 시트 + 딤 배경,
              바깥을 탭하면 취소(닫기) 가능. X 버튼은 따로 안 둠(초기화/확인 두 버튼이 곧 닫는 방법). */}
          {isOpen && (
            <div
              className={styles.sheetOverlay}
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsOpen(false)
              }}
              data-fab-hide="true"
            >
            <div className={styles['picker-panel']}>
              {isLoading && <p className={styles.hint}>멤버 목록을 불러오는 중이에요...</p>}
              {!isLoading && loadError && <p className={styles.hint}>{loadError}</p>}

              {!isLoading && !loadError && (
                <>
                  {/* 배지&칩 확정사항 - 다중 인원(멤버) 선택은 2열 칩 그리드로 고정.
                      "전체(선택 안 함)"은 목록 맨 앞 칩 하나로 두고, 별도 텍스트 링크로
                      만들지 않음. 다중 선택 가능하되 "전체" 칩을 고르면 나머지는 자동 해제 */}
                  <div>
                    <span className={styles['panel-group-label']}>멤버 선택</span>
                    <div className={styles['member-list']} ref={memberListRef}>
                      <button
                        type="button"
                        className={`${styles['member-chip']} ${isWholeGroupSelected ? styles.selected : ''}`}
                        onClick={toggleWholeGroup}
                      >
                        전체 (선택 안 함)
                      </button>
                      {members.map((m) => {
                        const isSelected = selectedMembers.has(m.artist_no)
                        return (
                          <button
                            key={m.artist_no}
                            type="button"
                            className={`${styles['member-chip']} ${isSelected ? styles.selected : ''}`}
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
                        ? '전체(선택 안 함) 선택됨'
                        : selectedNames.length > 0
                          ? `${selectedNames.join(', ')} 선택됨`
                          : '선택 안 함'}
                    </span>
                  </div>

                  {/* 안내 문구 - 선택이 결과에 미치는 영향을 1줄로, 그리드와 버튼 사이 */}
                  <p className={styles['info-banner']}>
                    ⓘ{' '}
                    {isWholeGroupSelected
                      ? '그룹 전체를 선택하면 그룹 활동 일정 위주로 추천받아요.'
                      : '멤버를 선택하면 그 멤버 일정을 우선 추천받아요.'}
                  </p>

                  {/* 초기화 버튼 공통 가이드 - 확인 버튼과 짝을 이뤄 왼쪽에, 비율 40:60 */}
                  <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                    <button
                      type="button"
                      className={styles['reset-btn']}
                      style={{ flex: '0 1 40%', textAlign: 'center' }}
                      onClick={resetSelection}
                    >
                      초기화
                    </button>
                    <button
                      type="button"
                      className={styles['confirm-btn']}
                      style={{ flex: '0 1 60%' }}
                      onClick={() => setIsOpen(false)}
                    >
                      확인
                    </button>
                  </div>
                </>
              )}
            </div>
            </div>
          )}

          <p className={styles.hint}>
            {isWholeGroupSelected
              ? '그룹 전체를 선택하면 그룹 활동 일정 위주로 추천 받아요.'
              : '멤버 선택시 멤버별 일정을 우선 추천 받아요.'}
          </p>
        </div>

        {/* 멤버 선택을 먼저 끝내야("확인") 받아볼 동선 안 선택이 보이게 함 - 한 번에
            고를 게 너무 많아 보이지 않도록 단계를 나눔 */}
        {!isOpen && (
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
        )}

        {/* 하단 고정 바가 아니라 콘텐츠의 마지막 항목으로 스크롤에 같이 움직이게 함
            (사용자 요청 - 다른 화면과 동일하게 고정 해제) */}
        {!isOpen && (
          <div className={styles.footer}>
            <button type="button" className={styles['btn-primary']} onClick={goNext}>
              다음: 확인
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
