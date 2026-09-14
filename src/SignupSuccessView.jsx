import { useNavigate } from 'react-router-dom'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
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

          {/* 완료 화면 재구성 - 카드 2개(불릿) 구조 대신 헤드카피 1줄 + 불릿 2개(라인아이콘)
              (09 카피&용어 - 부드러운 해요체, 합쇼체 "완료되었습니다" 사용 금지) */}
          <p className={styles.headcopy}>
            가입이 완료됐어요. FAN:GO와 함께 최고의 팬 여정을 시작해 보세요.
          </p>

          <ul className={styles['bullet-list']}>
            <li className={styles.bullet}>
              <Icon name="star" size={18} strokeWidth={1.5} color="var(--color-primary-500)" />
              <span>팬덤 일정 생성 — 아티스트 일정을 한눈에 확인할 수 있어요</span>
            </li>
            <li className={styles.bullet}>
              <Icon name="calendar" size={18} strokeWidth={1.5} color="var(--color-primary-500)" />
              <span>여행 일정 계획 — 콘서트에 맞춘 최적의 여행을 계획할 수 있어요</span>
            </li>
          </ul>

          {/* 하단 고정 바가 아니라 콘텐츠의 마지막 항목으로 스크롤에 같이 움직이게 함
              (사용자 요청 - 다른 화면과 동일하게 고정 해제) */}
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

        <BottomNav />
      </div>
    </div>
  )
}
