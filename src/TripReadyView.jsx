import { useNavigate } from 'react-router-dom'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import { useLanguage } from './LanguageContext'
import styles from './TripReadyView.module.css'

// TripGeneratingView에서 동선 생성이 다 끝나면 이 화면으로 넘어옴.
// "동선 보기" 버튼을 눌러야 실제 결과 화면으로 이동함 - 지도와 목록을 같이 보여주는
// ItineraryView를 먼저 보여주고, 목록만 보는 ScheduleTableView는 거기서 넘어가게 함.
export default function TripReadyView() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className={styles.screen}>
      <AppHeader showBack={false} showProfile={false} />
      <div className={styles.body}>
        <div className={styles['check-circle']}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M10 21 L17 27 L30 13"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* 09 카피&용어 - 화면 제목은 부드러운 해요체로 (합쇼체 "준비되었습니다" 사용 금지) */}
        <h1 className={styles.title}>
          {t('tripReady.titleLine1')}
          <br />
          {t('tripReady.titleLine2')}
        </h1>
        <p className={styles.subtitle}>{t('tripReady.subtitle')}</p>
      </div>

      <div className={styles.footer} data-bottom-bar="true">
        <button type="button" className={styles['btn-primary']} onClick={() => navigate('/trip/itinerary')}>
          {t('tripReady.viewRouteButton')}
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
