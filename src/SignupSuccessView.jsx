import { useNavigate } from 'react-router-dom'
import AppHeader from './AppHeader'
import styles from './SignupSuccessView.module.css'

export default function SignupSuccessView() {
  const navigate = useNavigate()

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader showBack={false} showProfile={false} />
        <div className={styles.header}>
          <div className={styles['header-row']}>
            <span className={styles['step-label']}>01 — 01</span>
          </div>
          <h1 className={styles.title}>계정 생성</h1>
        </div>

        <div className={styles.body}>
          <div className={styles['check-badge']}>✓</div>

          <div className={styles['text-block']}>
            <h2 className={styles['success-title']}>가입이 완료되었습니다</h2>
            <p className={styles['success-subtitle']}>
              FAN:GO와 함께
              <br />
              최고의 팬 여정을 시작해 보세요.
            </p>
          </div>

          <div className={styles['feature-list']}>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>★</div>
              <div className={styles['feature-text']}>
                <span className={styles['feature-title']}>팬덤 일정 생성</span>
                <span className={styles['feature-desc']}>아티스트 일정을 한눈에 확인할 수 있어요</span>
              </div>
            </div>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>🗓</div>
              <div className={styles['feature-text']}>
                <span className={styles['feature-title']}>여행 일정 계획</span>
                <span className={styles['feature-desc']}>
                  콘서트에 맞춘 최적의 여행을 계획할 수 있어요
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles['btn-primary']}
            onClick={() => navigate('/trip/events')}
          >
            여행 일정 만들기 →
          </button>
        </div>
      </div>
    </div>
  )
}
