import { useNavigate } from 'react-router-dom'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import Icon from './Icon'
import { useLanguage } from './LanguageContext'
import styles from './SignupSuccessView.module.css'

export default function SignupSuccessView() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        {/* 완료 화면 헤더 - PDF "5.완료 화면" 규칙: 로그인 후 구성(언어 필 + 메뉴 아이콘) 그대로 유지 */}
        <AppHeader showBack={false} showProfile />
        <div className={styles.header}>
          {/* 이전 단계 타이틀("가입하기")을 남기지 않고 완료 전용 문구로 교체 */}
          <h1 className={styles.title}>{t('signupSuccess.title')}</h1>
        </div>

        <div className={styles.body}>
          <div className={styles['check-badge']}><Icon name="check" size={36} strokeWidth={2.5} color="#fff" /></div>

          {/* 완료 화면 재구성 - 카드 2개(불릿) 구조 대신 헤드카피 1줄 + 불릿 2개(라인아이콘)
              (09 카피&용어 - 부드러운 해요체, 합쇼체 "완료되었습니다" 사용 금지) */}
          <p className={styles.headcopy}>{t('signupSuccess.headcopy')}</p>

          <ul className={styles['bullet-list']}>
            <li className={styles.bullet}>
              <Icon name="star" size={18} strokeWidth={1.5} color="var(--color-primary-500)" />
              <span>{t('signupSuccess.bulletFandom')}</span>
            </li>
            <li className={styles.bullet}>
              <Icon name="calendar" size={18} strokeWidth={1.5} color="var(--color-primary-500)" />
              <span>{t('signupSuccess.bulletTrip')}</span>
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
              {t('signupSuccess.goHome')}
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}
