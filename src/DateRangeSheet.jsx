import { useState } from 'react'
import Icon from './Icon'
import styles from './DateRangeSheet.module.css'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function toLocalIsoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseIsoDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// 달력 그리드용 - 이번 달 1일이 무슨 요일인지 맞춰서 앞에 빈 칸을 채우고,
// 이번 달 날짜를 전부 넣음 (다음 달 날짜로 안 넘어가게 딱 이번 달까지만)
function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = firstDay.getDay()
  const cells = Array(leadingBlanks).fill(null)
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(toLocalIsoDate(new Date(year, month, d)))
  }
  return cells
}

/**
 * 체크인/체크아웃을 달력 하나에서 순서대로 두 번 눌러서 정하는 바텀시트.
 * 첫 번째 탭 = 체크인, 그 이후 더 나중 날짜를 탭하면 체크아웃 확정. 범위 안쪽은 옅게 강조.
 * min/max 밖 날짜는 눌러도 반응하지 않음(회색 처리).
 * 사용 예: <DateRangeSheet checkIn={checkIn} checkOut={checkOut} min={allowedMinDate}
 *            max={allowedMaxDate} onConfirm={(nextIn, nextOut) => ...} />
 */
export default function DateRangeSheet({
  checkIn,
  checkOut,
  min,
  max,
  onConfirm,
  triggerId,
  // 시작일/종료일을 화면에 두 칸으로 따로 보여주고 싶을 때 씀 - ({ open, checkIn, checkOut })를
  // 받아서 트리거 영역 전체를 대신 그려줌(둘 중 어느 칸을 눌러도 같은 달력이 열리고,
  // 확정하면 onConfirm이 두 값을 한 번에 채움). 안 넘기면 기존처럼 칸 하나로 표시함.
  renderTrigger,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftIn, setDraftIn] = useState(checkIn || '')
  const [draftOut, setDraftOut] = useState(checkOut || '')
  const [viewDate, setViewDate] = useState(() =>
    parseIsoDate(checkIn || min || toLocalIsoDate(new Date()))
  )

  function open() {
    setDraftIn(checkIn || '')
    setDraftOut(checkOut || '')
    setViewDate(parseIsoDate(checkIn || min || toLocalIsoDate(new Date())))
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function confirm() {
    if (!draftIn || !draftOut) return
    onConfirm(draftIn, draftOut)
    setIsOpen(false)
  }

  function pickDay(iso) {
    if (min && iso < min) return
    if (max && iso > max) return

    // 체크인만 고른 상태에서 그 날짜를 다시 누르면 선택 해제(연하게로 되돌림) -
    // 해제 후 다른 날짜를 눌러도 정상적으로 다시 진하게 선택되게 함
    if (draftIn && !draftOut && iso === draftIn) {
      setDraftIn('')
      return
    }

    if (!draftIn || draftOut) {
      // 새로 시작 - 체크인부터 다시 고름
      setDraftIn(iso)
      setDraftOut('')
      return
    }
    if (iso > draftIn) {
      // 체크아웃까지 고르면 "선택" 버튼을 따로 안 눌러도 바로 확정하고 닫음 -
      // 화면이 낮은 기기에서 달력이 길어지면 하단 액션 버튼이 화면 밖으로
      // 밀려 안 보이는 경우가 있어서, 두 번째 탭만으로 완결되게 함
      setDraftOut(iso)
      onConfirm(draftIn, iso)
      setIsOpen(false)
    } else {
      // 체크인보다 이르거나 같은 날을 누르면 체크인을 그 날로 다시 잡음
      setDraftIn(iso)
    }
  }

  function changeMonth(delta) {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const cells = buildMonthGrid(year, month)

  const nights =
    draftIn && draftOut
      ? Math.round((parseIsoDate(draftOut) - parseIsoDate(draftIn)) / (1000 * 60 * 60 * 24))
      : null

  const displayText =
    checkIn && checkOut
      ? `${checkIn.slice(5).replace('-', '.')} — ${checkOut.slice(5).replace('-', '.')}`
      : '체크인 · 체크아웃 선택해주세요'

  return (
    <>
      {renderTrigger ? (
        renderTrigger({ open, checkIn, checkOut })
      ) : (
        <button
          type="button"
          id={triggerId}
          className={`${styles.trigger} ${!checkIn || !checkOut ? styles.placeholder : ''}`}
          onClick={open}
        >
          <span className={styles.triggerText}>{displayText}</span>
          <Icon
            name="calendar"
            size={16}
            color={checkIn && checkOut ? 'var(--color-primary-500)' : 'rgba(12, 10, 28, 0.4)'}
          />
        </button>
      )}

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
          data-fab-hide="true"
        >
          <div className={styles.sheet}>
            <p className={styles.label}>
              {!draftIn ? '체크인 날짜를 선택해주세요' : !draftOut ? '체크아웃 날짜를 선택해주세요' : `${nights}박 ${nights + 1}일`}
            </p>

            <div className={styles.monthNav}>
              <button type="button" className={styles.navBtn} onClick={() => changeMonth(-1)} aria-label="이전 달">
                ‹
              </button>
              <span className={styles.monthLabel}>{year}.{String(month + 1).padStart(2, '0')}</span>
              <button type="button" className={styles.navBtn} onClick={() => changeMonth(1)} aria-label="다음 달">
                ›
              </button>
            </div>

            <div className={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((w) => (
                <span key={w} className={styles.weekdayCell}>{w}</span>
              ))}
            </div>

            <div className={styles.grid}>
              {cells.map((iso, i) => {
                if (!iso) return <span key={`blank-${i}`} className={styles.cell} />
                const isDisabled = (min && iso < min) || (max && iso > max)
                const isStart = iso === draftIn
                const isEnd = iso === draftOut
                const isInRange = draftIn && draftOut && iso > draftIn && iso < draftOut
                const dayNum = Number(iso.slice(8, 10))
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`${styles.day} ${isDisabled ? styles.dayDisabled : ''} ${isStart ? styles.dayStart : ''} ${isEnd ? styles.dayEnd : ''} ${isInRange ? styles.dayInRange : ''}`}
                    disabled={isDisabled}
                    onClick={() => pickDay(iso)}
                  >
                    {dayNum}
                  </button>
                )
              })}
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.closeBtn} onClick={close}>
                닫기
              </button>
              <button type="button" className={styles.selectBtn} onClick={confirm} disabled={!draftIn || !draftOut}>
                선택
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
