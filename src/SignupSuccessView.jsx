import { useNavigate } from 'react-router-dom'
import AppHeader from './AppHeader'
import Icon from './Icon'
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
          {/* 09 카피&용어 - "계정" 단독 명사형 대신 확정 표기 "가입하기"로 통일 (SignupView와 동일) */}
          <h1 className={styles.title}>가입하기</h1>
        </div>

        <div className={styles.body}>
          <div className={styles['check-badge']}><Icon name="check" size={36} strokeWidth={2.5} color="#fff" /></div>

          <div className={styles['text-block']}>
            {/* 09 카피&용어 - 화면 제목/안내는 부드러운 해요체로 (합쇼체 "완료되었습니다" 사용 금지) */}
            <h2 className={styles['success-title']}>가입이 완료됐어요</h2>
            <p className={styles['success-subtitle']}>
              FAN:GO와 함께
              <br />
              최고의 팬 여정을 시작해 보세요.
            </p>
          </div>

          <div className={styles['feature-list']}>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}><Icon name="star" size={18} color="var(--color-primary-500)" /></div>
              <div className={styles['feature-text']}>
                <span className={styles['feature-title']}>팬덤 일정 생성</span>
                <span className={styles['feature-desc']}>아티스트 일정을 한눈에 확인할 수 있어요</span>
              </div>
            </div>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}><Icon name="calendar" size={18} color="var(--color-primary-500)" /></div>
              <div className={styles['feature-text']}>
                <span className={styles['feature-title']}>여행 일정 계획</span>
                <span className={styles['feature-desc']}>
                  콘서트에 맞춘 최적의 여행을 계획할 수 있어요
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer} data-bottom-bar="true">
          <button
            type="button"
            className={styles['btn-primary']}
            onClick={() => navigate('/home')}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  )
}
