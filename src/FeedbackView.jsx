import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from './TripContext';
import { apiFetch, safeText } from './api';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';
import Icon from './Icon';
import { useLanguage } from './LanguageContext';
import styles from './FeedbackView.module.css';

// 이 화면은 "오늘 하루"가 아니라 "여행 전체가 끝난 후" 딱 1번 뜨는 평가 화면임.
// 정책: 여행이 완전히 끝난 후에만 제출 가능 (HistoryView에서 status==='완료'인 여행만 유도함).
// 제출한다고 이미 짜여진 동선이 바뀌지는 않음 - 순수 소감 기록 + 다음 여행 추천 참고용.
export default function FeedbackView() {
  const navigate = useNavigate();
  const { tripData } = useTrip();
  const { t } = useLanguage();
  const tripNo = tripData.tripNo;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedOptNo, setSelectedOptNo] = useState(null); // 단일선택 - GET /review-opts의 opt_no
  const [comment, setComment] = useState('');

  const [reviewOpts, setReviewOpts] = useState([]);
  const [isLoadingOpts, setIsLoadingOpts] = useState(true);
  const [optsError, setOptsError] = useState('');

  // 장소별 좋아요 - 여행 전체 장소 목록 (여러 날짜에 걸친 trip_route_event 전부)
  const [places, setPlaces] = useState([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);
  const [placesError, setPlacesError] = useState('');
  const [likingIds, setLikingIds] = useState(new Set());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // 제출 성공 후 "완료" 안내 오버레이 표시용

  // '한마디 더' 칩 목록
  useEffect(() => {
    let cancelled = false;
    async function loadOpts() {
      setIsLoadingOpts(true);
      setOptsError('');
      try {
        const res = await apiFetch('/review-opts');
        if (!res.ok) throw new Error(t('feedback.loadOptsFailed'));
        const data = await res.json();
        if (!cancelled) setReviewOpts(data);
      } catch (e) {
        if (!cancelled) setOptsError(t('feedback.loadOptsFailed'));
      } finally {
        if (!cancelled) setIsLoadingOpts(false);
      }
    }
    loadOpts();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 08 부분 영역 에러 규칙 - 이 목록만 실패해도 별점·태그 등 나머지 폼은 그대로 쓸 수 있게,
  // 여기만 재시도할 수 있는 별도 키를 둠
  const [placesRetryKey, setPlacesRetryKey] = useState(0);

  // 여행 전체 장소 목록 (날짜 구분 없이 전부) - visit_day를 안 주면 전체가 옴
  useEffect(() => {
    if (!tripNo) {
      setIsLoadingPlaces(false);
      return;
    }
    let cancelled = false;
    async function loadPlaces() {
      setIsLoadingPlaces(true);
      setPlacesError('');
      try {
        const res = await apiFetch(`/trips/${tripNo}/routes`);
        if (!res.ok) throw new Error(t('feedback.loadPlacesFailed'));
        const data = await res.json();
        // 일자별로 중첩된 걸 평평하게 펼침. 메인 이벤트(공연) 장소는 후기 대상이 아니므로 제외.
        const mainEventNo = tripData.selectedEvent?.event_no;
        const flat = (data || [])
          .flatMap((day) => (day.events || []).map((ev) => ({ ...ev, visit_day: day.visit_day })))
          .filter((ev) => ev.event_no !== mainEventNo);
        if (!cancelled) setPlaces(flat);
      } catch (e) {
        if (!cancelled) setPlacesError(t('feedback.loadPlacesFailed'));
      } finally {
        if (!cancelled) setIsLoadingPlaces(false);
      }
    }
    loadPlaces();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripNo, placesRetryKey]);

  async function togglePlaceLike(place) {
    const id = place.trip_route_event_no;
    if (likingIds.has(id)) return;
    setLikingIds((prev) => new Set(prev).add(id));
    const nextLiked = !place.liked;
    setPlaces((prev) => prev.map((p) => (p.trip_route_event_no === id ? { ...p, liked: nextLiked } : p)));
    try {
      const res = await apiFetch(`/trip-route-events/${id}/like`, {
        method: nextLiked ? 'POST' : 'DELETE',
      });
      if (!res.ok && res.status !== 204) throw new Error();
    } catch (e) {
      // 실패하면 되돌림
      setPlaces((prev) => prev.map((p) => (p.trip_route_event_no === id ? { ...p, liked: !nextLiked } : p)));
    } finally {
      setLikingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  // "완료" 버튼 - 여기서만 리뷰 저장 API(POST /trips/{trip_no}/review)를 호출함.
  const handleSubmit = async () => {
    setSubmitError('');

    if (!tripNo) {
      setSubmitError(t('feedback.tripNotFound'));
      return;
    }
    // 서버 규칙: opt_no/rating/review_content 셋 다 비어있으면 422
    if (!selectedOptNo && rating === 0 && !comment.trim()) {
      setSubmitError(t('feedback.minInputRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/trips/${tripNo}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opt_no: selectedOptNo || undefined,
          rating: rating > 0 ? rating : undefined,
          review_content: comment.trim() || undefined,
        }),
      });

      if (res.status === 409) {
        setSubmitError(t('feedback.alreadyReviewed'));
        setIsSubmitting(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail = data?.detail;
        let rawMessage = null;
        if (typeof detail === 'string') rawMessage = detail;
        else if (detail?.message) rawMessage = detail.message;
        else if (Array.isArray(detail) && detail[0]?.msg) rawMessage = detail[0].msg;
        // 08 에러 화면 규칙 - 백엔드 detail이 영어 기술 메시지일 수 있어 그대로 노출하지 않음
        setSubmitError(safeText(rawMessage, t('feedback.submitFailed')));
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (e) {
      setSubmitError(t('feedback.connectionError'));
      setIsSubmitting(false);
    }
  };

  // "이번엔 넘길게요" 버튼 - 절대 리뷰 저장 API를 호출하면 안 됨 (평가를 안 남기고 건너뜀).
  const handleSkip = () => {
    navigate('/trip/history');
  };

  if (isSubmitted) {
    return (
      <div className={styles.screen}>
        <div className={styles.card}>
          <AppHeader />
          <div className={styles.doneWrap}>
            <div className={styles.doneCircle} aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  style={{ stroke: 'var(--color-primary-500)' }}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* 09 카피&용어 - 부드러운 해요체로 (합쇼체 사용 금지) */}
            <p className={styles.doneTitle}>{t('feedback.doneTitle')}</p>
            <p className={styles.doneSub}>{t('feedback.doneSub')}</p>
            <button
              type="button"
              className={styles.submitButton}
              onClick={() => navigate('/trip/history')}
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{t('feedback.title')}</h1>
        </div>

        <div className={styles.body}>
          <div className={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={styles.starButton}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={t('feedback.starAriaLabel')(star)}
              >
                <span
                  className={`${styles.star} ${
                    star <= (hoverRating || rating) ? styles.starFilled : ''
                  }`}
                >
                  ★
                </span>
              </button>
            ))}
            <span className={styles.starHint}>{t('feedback.starHint')}</span>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>{t('feedback.tagSectionLabel')}</p>

            {isLoadingOpts && <p className={styles.starHint}>{t('common.loading')}</p>}
            {!isLoadingOpts && optsError && <p className={styles.starHint}>{optsError}</p>}

            {!isLoadingOpts && !optsError && (
              <div className={styles.tagRow}>
                {reviewOpts.map((opt) => (
                  <button
                    key={opt.opt_no}
                    type="button"
                    className={`${styles.tag} ${selectedOptNo === opt.opt_no ? styles.tagSelected : ''}`}
                    onClick={() =>
                      setSelectedOptNo((prev) => (prev === opt.opt_no ? null : opt.opt_no))
                    }
                  >
                    {opt.opt_nm}
                  </button>
                ))}
              </div>
            )}

            <textarea
              className={styles.textarea}
              placeholder={t('feedback.commentPlaceholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>{t('feedback.placeSectionLabel')}</p>

            {isLoadingPlaces && <p className={styles.starHint}>{t('common.loading')}</p>}
            {/* 08 부분 영역 에러 - 별점·태그 등 나머지 폼은 그대로 두고 이 목록 구역만 회색 박스로 */}
            {!isLoadingPlaces && placesError && (
              <div className={styles['partial-error']}>
                <p className={styles['partial-error-text']}>{placesError}</p>
                <button
                  type="button"
                  className={styles['partial-error-retry']}
                  onClick={() => setPlacesRetryKey((k) => k + 1)}
                >
                  {t('common.retry')}
                </button>
              </div>
            )}
            {!isLoadingPlaces && !placesError && places.length === 0 && (
              <p className={styles.starHint}>{t('feedback.noPlaces')}</p>
            )}

            {!isLoadingPlaces && !placesError && places.length > 0 && (
              <div className={styles.placeRow}>
                {places.map((place) => (
                  <button
                    key={place.trip_route_event_no}
                    type="button"
                    className={`${styles.placeChip} ${place.liked ? styles.placeChipDone : ''}`}
                    disabled={likingIds.has(place.trip_route_event_no)}
                    onClick={() => togglePlaceLike(place)}
                  >
                    <span>{place.event_nm}</span>
                    <span
                      className={`${styles.placeThumb} ${place.liked ? styles.placeThumbActive : ''}`}
                      aria-hidden="true"
                    >
                      <Icon name="thumbsUp" size={14} />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {submitError && (
            <p className={styles.starHint} style={{ color: 'var(--color-danger)' }}>
              {submitError}
            </p>
          )}

          {/* 이 화면은 원래도 고정 바가 아니라 .body 안 마지막 항목이었음 - 잘못 붙어있던
              data-bottom-bar만 제거(사용자 요청과 일치하도록 정리) */}
          <div className={styles.actionRow} data-bottom-bar="true">
            <button type="button" className={styles.skipButton} onClick={handleSkip}>
              {t('feedback.skipButton')}
            </button>
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('feedback.saving') : t('feedback.submitButton')}
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
