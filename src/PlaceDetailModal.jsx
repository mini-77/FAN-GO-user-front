import { useEffect, useState } from 'react'
import { apiFetch, safeErrorMessage } from './api'
import { useLanguage } from './LanguageContext'
import Icon from './Icon'
import styles from './PlaceDetailView.module.css'
import modalStyles from './PlaceDetailModal.module.css'

// cong_level(0=한산 1=보통 2=혼잡 3=매우혼잡)별 막대/텍스트 색상
const CONGESTION_COLORS = ['#34C759', '#FFC107', '#FF9500', '#FF3B30']

// 장소를 눌렀을 때 뜨는 팝업 - PlaceDetailView에 있던 내용(사진/총점수/혼잡도/지도링크)을
// 페이지 이동 없이 모달로 그대로 보여줌.
// props: eventNo(필수), tripRouteEventNo(좋아요용, 없으면 좋아요 버튼 안 보임),
//        liked(초기 좋아요 상태), businessHours(호출한 화면이 이미 갖고 있으면 넘겨줌), onClose
export default function PlaceDetailModal({ eventNo, tripRouteEventNo, liked: initialLiked, businessHours, onClose }) {
  const { t } = useLanguage()
  const [place, setPlace] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [liked, setLiked] = useState(Boolean(initialLiked))
  const [isLiking, setIsLiking] = useState(false)
  const [congestion, setCongestion] = useState(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!eventNo) {
      setIsLoading(false)
      setLoadError(t('placeDetail.placeNotFound'))
      return
    }
    let cancelled = false
    async function loadPlace() {
      setIsLoading(true)
      setLoadError('')
      try {
        const res = await apiFetch(`/events/${eventNo}`)
        if (res.status === 404) throw new Error(t('placeDetail.placeDoesNotExist'))
        if (!res.ok) throw new Error(t('placeDetail.loadFailed'))
        const data = await res.json()
        if (!cancelled) setPlace(data)
      } catch (e) {
        if (!cancelled) setLoadError(safeErrorMessage(e, t('placeDetail.loadFailed')))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadPlace()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventNo])

  // 예상 혼잡도 - 인증 불필요, 서버가 현재(KST) 요일/시간대 기준으로 계산해 내려줌
  useEffect(() => {
    if (!eventNo) return
    let cancelled = false
    async function loadCongestion() {
      try {
        const res = await apiFetch(`/events/${eventNo}/congestion`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setCongestion(data)
      } catch (e) {
        // 혼잡도는 부가 정보라 실패해도 "준비 중"으로만 보이면 되고 화면 전체를 막지 않음
      }
    }
    loadCongestion()
    return () => {
      cancelled = true
    }
  }, [eventNo])

  async function toggleLike() {
    if (!tripRouteEventNo || isLiking) return
    setIsLiking(true)
    const nextLiked = !liked
    try {
      const res = await apiFetch(`/trip-route-events/${tripRouteEventNo}/like`, {
        method: nextLiked ? 'POST' : 'DELETE',
      })
      if (res.ok) setLiked(nextLiked)
    } catch (e) {
      // 무시
    } finally {
      setIsLiking(false)
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const reviews = place?.external_reviews || []
  const overallScore =
    reviews.length > 0
      ? Math.round(reviews.reduce((sum, r) => sum + (r.total_score || 0), 0) / reviews.length)
      : null

  function formatHours() {
    if (!businessHours || !businessHours.has_data) return null
    if (businessHours.is_closed) return t('businessHours.closedToday')
    return t('businessHours.openClose')(businessHours.open_tm, businessHours.close_tm)
  }
  const hoursText = formatHours()

  return (
    <div className={modalStyles.overlay} onClick={handleOverlayClick} data-fab-hide="true">
      <div className={modalStyles.sheet}>
        <button type="button" className={modalStyles.closeBtn} onClick={onClose} aria-label={t('placeDetail.close')}>
          <Icon name="close" size={16} />
        </button>

        {isLoading && <p className={styles.desc} style={{ padding: 24 }}>{t('common.loading')}</p>}
        {!isLoading && (loadError || !place) && (
          <p className={styles.desc} style={{ padding: 24 }}>{loadError}</p>
        )}

        {!isLoading && place && (
          <>
            {place.event_img_url ? (
              <div className={styles['hero-wrap']}>
                <img src={place.event_img_url} alt={place.event_nm} className={styles['hero-img']} />
              </div>
            ) : (
              <div className={styles['map-area']}>
                <div className={styles['map-blob']} />
                <p className={styles['map-label']}>MAP</p>
                <p className={styles['map-name']}>
                  {place.event_nm} · {place.add}
                </p>
              </div>
            )}

            <div className={styles.body}>
              {place.event_img_url && (
                <div className={styles['map-row']}>
                  <span className={styles['photo-credit']}>{t('placeDetail.photoCredit')}</span>
                </div>
              )}
              <p className={styles.breadcrumb}>
                {place.event_nm} · {place.add}
              </p>

              <div className={styles['title-row']}>
                <h1 className={styles.title}>{place.event_nm}</h1>
                {tripRouteEventNo && (
                  <button
                    type="button"
                    className={styles['like-btn']}
                    style={liked ? { background: '#FFE9DE', color: '#FF7A5C' } : undefined}
                    onClick={toggleLike}
                    disabled={isLiking}
                  >
                    <Icon name="heart" size={14} filled={liked} /> {t('placeDetail.like')}
                  </button>
                )}
              </div>

              {hoursText && <p className={styles.hours}>{hoursText}</p>}

              {place.event_desc && (
                <div className={styles['quote-block']}>
                  <p className={styles['quote-text']}>{place.event_desc}</p>
                </div>
              )}

              {overallScore != null && (
                <div className={styles['score-card']}>
                  <div className={styles['score-num-block']}>
                    <div className={styles['score-num']}>{overallScore}</div>
                    <div className={styles['score-num-label']}>{t('schedule.totalScore')}</div>
                  </div>
                  <div className={styles['score-bar-block']}>
                    <span className={styles['score-bar-label']}>{t('placeDetail.fangoScore')}</span>
                    <div className={styles['score-bar-track']}>
                      <div
                        className={styles['score-bar-fill']}
                        style={{ width: `${Math.min(100, overallScore)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {overallScore != null && (
                <p className={styles.desc}>{t('placeDetail.scoreDesc')}</p>
              )}

              {/* 혼잡도 - GET /events/{event_no}/congestion. cong_level 0~3(한산~매우혼잡)을
                  막대 5개 중 (cong_level+1)개를 채우는 방식으로 표현. 데이터가 없으면(has_data:false)
                  혼잡도 영역 자체를 표시하지 않음 */}
              {congestion?.has_data && (
                <div className={styles['congestion-row']}>
                  <span className={styles['congestion-label']}>{t('placeDetail.currentCongestion')}</span>
                  <div className={styles['congestion-bars']}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={styles['congestion-bar']}
                        style={
                          i <= congestion.cong_level
                            ? { background: CONGESTION_COLORS[congestion.cong_level] }
                            : undefined
                        }
                      />
                    ))}
                  </div>
                  <span
                    className={styles['congestion-text']}
                    style={{ color: CONGESTION_COLORS[congestion.cong_level] }}
                  >
                    {congestion.cong_label}
                  </span>
                </div>
              )}

              <div className={styles['link-row']}>
                <a
                  className={styles['link-btn']}
                  href={`https://map.kakao.com/link/search/${encodeURIComponent(place.event_nm)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('placeDetail.openInKakaoMap')}
                </a>
                <a
                  className={styles['link-btn']}
                  href={`https://www.google.com/maps/search/${encodeURIComponent(place.event_nm)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('placeDetail.openInGoogleMap')}
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
