import { useEffect } from 'react'
import styles from './AgreementModal.module.css'

// 회원가입 화면의 "이용약관/위치정보/개인정보" 링크를 누르면 뜨는 팝업.
// 결정이 필요한 모달(약관 동의)이라 반드시 "닫기"/"동의하고 닫기" 중 하나를 골라야 함 —
// X나 바깥 영역 클릭으로 아무 선택 없이 빠져나갈 수 있게 하지 않음 (디자인 가이드 04번 규칙).
export default function AgreementModal({ title, content, onClose, onAgree }) {
  // 모달 열려있는 동안 뒷배경 스크롤 방지
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.body}>
          <pre className={styles.contentText}>{content}</pre>
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.secondaryBtn} onClick={onClose}>
            닫기
          </button>
          <button type="button" className={styles.primaryBtn} onClick={onAgree}>
            동의하고 닫기
          </button>
        </div>
      </div>
    </div>
  )
}
