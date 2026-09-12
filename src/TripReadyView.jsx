import { useNavigate } from 'react-router-dom'
import styles from './TripReadyView.module.css'

// TripGeneratingView에서 동선 생성이 다 끝나면 이 화면으로 넘어옴.
// "동선 보러가기" 버튼을 눌러야 실제 결과 화면(ScheduleTableView)으로 이동함.
export default function TripReadyView() {
  const navigate = useNavigate()

  return (
    <div className={styles.screen}>
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
        <h1 className={styles.title}>
          새로운 동선이
          <br />
          준비되었습니다
        </h1>
        <p className={styles.subtitle}>다음 페이지에서 동선 정보를 확인하세요.</p>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles['btn-primary']} onClick={() => navigate('/trip/schedule')}>
          동선 보러가기 →
        </button>
      </div>
    </div>
  )
}
