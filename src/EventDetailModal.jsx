import { useEffect, useState } from 'react'
import { apiFetch } from './api'
import { EVENT_POSTERS } from './eventPosters'
import modalStyles from './EventDetailModal.module.css'

// EventSelectView에서 이벤트 카드를 눌렀을 때 뜨는 팝업.
// PlaceDetailModal.jsx와 같은 구조(오버레이+시트, ESC/배경클릭 닫기)를 따르되,
// 내용은 "공식 이벤트 정보"(포스터/장소/시간)만 확인하는 용도.
// 참여 그룹/멤버는 안 보여줌 - 사용자 선택은 이미 정해져 있고, 여긴 확인용 팝업이라서.
//
// props:
//  - card: EventSelectView의 dayCards 항목 하나 (클릭 시 이미 선택 처리는 EventSelectView에서 끝남)
//          { event_no, event_date, dateLabel, timeLabel, title, address, artist_group_no }
//  - onClose: 닫기 (확인용 팝업이라 별도 선택/이동 액션 없음)
export default function EventDetailModal({ card, onClose }) {
  const [detail, setDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!card?.event_no) {
      setIsLoading(false)
      setLoadError('이벤트 정보를 찾을 수 없어요.')
      return
    }
    let cancelled = false
    async function load() {
      setIsLoading(true)
      setLoadError('')
      try {
        const res = await apiFetch(`/events/${card.event_no}`)
        if (!res.ok) throw new Error('이벤트 정보를 불러오지 못했어요.')
        const data = await res.json()
        if (!cancelled) setDetail(data)
      } catch (e) {
        if (!cancelled) setLoadError(e.message || '이벤트 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [card?.event_no])

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={modalStyles.overlay} onClick={handleOverlayClick}>
      <div className={modalStyles.sheet}>
        <button type="button" className={modalStyles.closeBtn} onClick={onClose} aria-label="닫기">
          ✕
        </button>

        {isLoading && <p className={modalStyles.desc} style={{ padding: 24 }}>불러오는 중이에요...</p>}
        {!isLoading && (loadError || !detail) && (
          <p className={modalStyles.desc} style={{ padding: 24 }}>{loadError}</p>
        )}

        {!isLoading && detail && (
          <>
            {(() => {
              // 백엔드 event_img_url이 우선, 없으면 프론트에서 관리하는 링크 매핑(eventPosters.js)을
              // 이벤트 이름으로 찾아봄 - event_no 대신 화면에 보이는 이름 그대로 키로 쓰니까
              // 개발자도구 없이도 등록 가능
              const posterUrl = detail.event_img_url || EVENT_POSTERS[detail.event_nm || card.title]
              // 포스터 사진이 없으면 MAP 자리표시자 대신 행사명·일시 정보를 바로 보여줌
              return posterUrl ? (
                <div className={modalStyles['hero-wrap']}>
                  <img src={posterUrl} alt={detail.event_nm} className={modalStyles['hero-img']} />
                </div>
              ) : (
                <div className={modalStyles['map-area']}>
                  <p className={modalStyles['map-name']}>{detail.event_nm || card.title}</p>
                  <p className={modalStyles['map-sub']}>
                    {card.dateLabel} · {card.timeLabel}
                  </p>
                </div>
              )
            })()}

            <div className={modalStyles.body}>
              <p className={modalStyles.breadcrumb}>{detail.add || card.address}</p>

              <h1 className={modalStyles.title}>{detail.event_nm || card.title}</h1>

              <p className={modalStyles.meta}>
                {card.dateLabel} 입장 {detail.enter_tm || ''} / 시작 {card.timeLabel}
              </p>
              <p className={modalStyles.metaSub}>
                {card.address} · {detail.event_type_nm || '콘서트'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
