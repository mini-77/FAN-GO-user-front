import { useState } from 'react'
import Icon from './Icon'
import { useLanguage } from './LanguageContext'
import styles from './PickerSheet.module.css'

// 04 팝업 & 모달 - "다크 시트 · 시스템 피커" 규칙 적용.
// 네이티브 <input type="date"/"time">는 그대로 값 선택에 쓰되(OS 피커가 접근성이 좋아서),
// 그 값을 다크 배경 시트에 감싸고 "닫기"/"선택" 두 버튼으로만 확정 여부를 결정하게 함 -
// 예전엔 브라우저 기본 입력창이라 어디까지가 "선택 확정"인지 불명확했음.
export default function PickerSheet({
  type,
  value,
  onChange,
  min,
  max,
  onConfirm,
  placeholder,
  formatValue,
  className,
  triggerId,
}) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState(value || '')

  function open() {
    setDraft(value || '')
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function confirm() {
    onChange(draft)
    setIsOpen(false)
    if (onConfirm) onConfirm(draft)
  }

  const displayText = value ? (formatValue ? formatValue(value) : value) : (placeholder ?? t('picker.selectPlaceholder'))

  return (
    <>
      <button
        type="button"
        id={triggerId}
        className={`${className || ''} ${styles.trigger} ${!value ? styles.placeholder : ''}`}
        onClick={open}
      >
        <span className={styles.triggerText}>{displayText}</span>
        <Icon
          name={type === 'time' ? 'clock' : 'calendar'}
          size={16}
          color={value ? 'var(--color-primary-500)' : 'rgba(12, 10, 28, 0.4)'}
        />
      </button>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
          data-fab-hide="true"
        >
          <div className={styles.sheet}>
            <p className={styles.label}>{type === 'date' ? t('picker.selectDate') : t('picker.selectTime')}</p>
            <input
              type={type}
              className={styles.nativeInput}
              value={draft}
              min={min}
              max={max}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className={styles.actions}>
              <button type="button" className={styles.closeBtn} onClick={close}>
                {t('picker.close')}
              </button>
              <button type="button" className={styles.selectBtn} onClick={confirm} disabled={!draft}>
                {t('picker.select')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
