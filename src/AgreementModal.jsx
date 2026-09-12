import { useEffect } from 'react'
import styles from './AgreementModal.module.css'

// 회원가입 화면의 "이용약관/위치정보/개인정보" 링크를 누르면 뜨는 팝업.
// - onClose: 그냥 닫기 (X 버튼, 바깥 영역 클릭)
// - onAgree: "동의하고 닫기" - 체크박스를 true로 만들고 닫음
export default function AgreementModal({ title, content, onClose, onAgree }) {
  // 모달 열려있는 동안 뒷배경 스크롤 방지
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            ✕
          </button>
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
