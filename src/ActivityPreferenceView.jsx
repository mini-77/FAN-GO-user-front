import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch, safeErrorMessage } from './api'
import AppHeader from './AppHeader'
import styles from './ActivityPreferenceView.module.css'

const MAX_RANK = 3
const RANK_LABELS = ['1순위', '2순위', '3순위']

// 카테고리 이름 → 부제(설명) 매칭용. API는 이름만 주고 부제는 안 주기 때문에, 최종 디자인에
// 나온 설명 문구를 이름 기준으로 붙여줌. 못 찾으면 부제 없이 이름만 표시.
// 화면에 보여줄 "순서" - 실제 DB ctg_nm 원본 이름 기준 (ctg_no 6~13)
// ⚠ 실제 DB엔 "성지"가 3개(성지 디저트/카페·성지 음식점·기타 성지)로 세분화돼 있고
// "카페"/"식당" 같은 일반 카테고리 자체가 없어서, 원하시는 8개 이름(생일카페·성지·팝업/굿즈샵·
// 유적지·카페·식당·관광지·쇼핑)을 순서대로 그대로 보여드리려면 실제 DB 항목 중 하나씩을
// 그 이름표 자리에 배치하는 방식일 수밖에 없어요. 아래는 그 대응표입니다.
const CATEGORY_ORDER = [
  '생일 카페', // → "생일카페"
  '기타 성지', // → "성지"
  '팝업/굿즈', // → "팝업/굿즈샵"
  '문화/유적지', // → "유적지"
  '성지 디저트/카페', // → "카페"
  '성지 음식점', // → "식당"
  '여행지', // → "관광지"
  '쇼핑', // → "쇼핑"
]

// 백엔드 원본 이름 → 화면에 보여줄 이름 (요청하신 8개 명칭 그대로)
const DISPLAY_NAME_MAP = {
  '생일 카페': '생일카페',
  '기타 성지': '성지',
  '팝업/굿즈': '팝업/굿즈샵',
  '문화/유적지': '유적지',
  '성지 디저트/카페': '카페',
  '성지 음식점': '식당',
  여행지: '관광지',
}

const SUBTITLE_MAP = {
  '생일 카페': '진행중인 생일카페',
  '기타 성지': '뮤비 스팟 · 각종 성지 순례',
  '팝업/굿즈': '공식 · 비공식',
  '문화/유적지': 'K-문화 체험',
  '성지 디저트/카페': '아티스트 단골',
  '성지 음식점': '아티스트 단골 맛집',
  여행지: '인기 관광지 추천',
  쇼핑: '백화점 아웃렛 잡화',
}

// TODO: 실제 DB에 ctg(카테고리) 데이터가 없을 경우를 대비한 미리보기용 배열.
// 백엔드 API 문서 기준: 예전 interest 테이블은 삭제됐고 GET /interests는 이제
// ctg 테이블(ctg_type_no 2/3)에서 조회함 - 필드명도 ctg_no/ctg_nm으로 바뀜.
const PREVIEW_CATEGORIES = CATEGORY_ORDER.map((name, i) => ({
  ctg_no: `preview-${i + 1}`,
  ctg_nm: name,
}))

export default function ActivityPreferenceView() {
  const navigate = useNavigate()
  const { tripData, updateTrip } = useTrip()
  // 배열 순서 = 고른 순서 = 순위 (0번째가 1순위) - 값은 ctg_no
  // 뒤로 갔다가 다시 오는 경우, tripData에 이미 저장된 이전 선택을 그대로 복원함
  const [rankedIds, setRankedIds] = useState(() => (tripData.rankedCategoryIds || []).map((c) => c.id))
  const [interests, setInterests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadInterests() {
      setIsLoading(true)
      setLoadError('')
      try {
        const res = await apiFetch('/interests')
        if (!res.ok) throw new Error('선호 카테고리를 불러오지 못했어요.')
        const data = await res.json()
        if (!cancelled) {
          if (data.length === 0) {
            setInterests(PREVIEW_CATEGORIES)
            setIsPreview(true)
          } else {
            setInterests(data)
            setIsPreview(false)
          }
        }
      } catch (e) {
        if (!cancelled) {
          // API 호출 자체가 실패해도(서버 꺼짐, CORS, 401 등) 화면은 미리보기로 보이게 함
          setInterests(PREVIEW_CATEGORIES)
          setIsPreview(true)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadInterests()
    return () => {
      cancelled = true
    }
  }, [])

  function toggleCategory(id) {
    setErrorMessage('')
    setRankedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id)
      }
      if (prev.length >= MAX_RANK) return prev
      return [...prev, id]
    })
  }

  function resetRanking() {
    setRankedIds([])
    setErrorMessage('')
  }

  const isFormValid = rankedIds.length > 0

  function goNext() {
    if (!isFormValid) {
      setErrorMessage('선호 카테고리를 1개 이상 골라주세요.')
      return
    }
    updateTrip({
      // rank 순서 그대로: [{ id: ctg_no, name: ctg_nm }, ...] - 배열 순서 = 우선순위
      rankedCategoryIds: rankedIds.map((id) => {
        const found = interests.find((i) => i.ctg_no === id)
        const rawName = found?.ctg_nm || String(id)
        return { id, name: DISPLAY_NAME_MAP[rawName] || rawName }
      }),
    })
    navigate('/trip/pace')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        {/* 뒤로가기는 브라우저 history(-1) 대신 화면을 명시적으로 지정 - 새로고침·직접 진입으로
            히스토리가 없어도 항상 올바른 이전 화면(날짜·숙소 선택)으로 감 */}
        <AppHeader onBack={() => navigate('/trip/date')} />
        <div className={styles.header}>
          <h1 className={styles.title}>선호 액티비티</h1>
          <div className={styles['progress-bar']}>
            <div className={styles['progress-fill']} style={{ width: '75%' }} />
          </div>
          <div className={styles['progress-caption']}>
            <span>3 / 4</span>
            <span>75%</span>
          </div>
        </div>

        <div className={styles.scrollArea}>
        <div className={styles.section}>
          <div className={styles['section-head']}>
            <span className={styles['section-label']}>선호 카테고리</span>
            <span className={styles['section-count']}>
              {rankedIds.length} / {interests.length}
            </span>
          </div>
          {isPreview && (
            <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>
              ⚠ 실제 DB 데이터가 아직 없어서, 화면 확인용 미리보기 카테고리를 보여주고 있어요.
            </p>
          )}
          {isLoading && <p className={styles.hint}>카테고리 목록을 불러오는 중이에요...</p>}
          {!isLoading && loadError && <p className={styles.hint}>{loadError}</p>}

          {!isLoading && !loadError && (
            <div className={styles['category-grid']}>
              {[...interests]
                .sort((a, b) => {
                  const ia = CATEGORY_ORDER.indexOf(a.ctg_nm)
                  const ib = CATEGORY_ORDER.indexOf(b.ctg_nm)
                  return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
                })
                .map((interest) => {
                const id = interest.ctg_no
                const rankIndex = rankedIds.indexOf(id)
                const isSelected = rankIndex !== -1
                const isLocked = !isSelected && rankedIds.length >= MAX_RANK
                const rankClass =
                  rankIndex === 0 ? 'rank-1' : rankIndex === 1 ? 'rank-2' : rankIndex === 2 ? 'rank-3' : ''
                const subtitle = SUBTITLE_MAP[interest.ctg_nm]
                const displayName = DISPLAY_NAME_MAP[interest.ctg_nm] || interest.ctg_nm

                return (
                  <div
                    key={id}
                    className={`${styles['category-card']} ${rankClass ? styles[rankClass] : ''} ${isLocked ? styles.locked : ''}`}
                    onClick={() => toggleCategory(id)}
                  >
                    {isSelected && (
                      <span className={styles['rank-badge']}>{RANK_LABELS[rankIndex]}</span>
                    )}
                    <span className={styles['category-name']}>{displayName}</span>
                    {subtitle && <span className={styles['category-sub']}>{subtitle}</span>}
                  </div>
                )
              })}
            </div>
          )}

          {/* 초기화는 카테고리 그리드 바로 아래, 스코프가 분명한 텍스트 링크로 배치 -
              하단 고정 버튼 자리에 확인 버튼과 묶어두지 않음 */}
          <button
            type="button"
            className={styles['reset-link']}
            onClick={resetRanking}
            disabled={rankedIds.length === 0}
          >
            초기화
          </button>

          <p className={styles.hint}>고른 순서대로 순위가 정해져요.</p>
        </div>

        {errorMessage && (
          <p className={styles.hint} style={{ padding: '0 16px', color: 'var(--color-danger)' }}>
            {errorMessage}
          </p>
        )}

        {/* 하단 고정 바가 아니라 목록의 마지막 항목으로 스크롤에 같이 움직이게 함
            (사용자 요청 - 다른 화면과 동일하게 고정 해제) */}
        <div className={styles.footer} data-bottom-bar="true">
          <button
            type="button"
            className={`${styles['btn-primary']} ${!isFormValid ? styles.disabled : ''}`}
            onClick={goNext}
            disabled={!isFormValid}
          >
            동선 스타일
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
