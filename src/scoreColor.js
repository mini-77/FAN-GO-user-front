// 01 컬러 규칙 — 점수·퍼센트(0~100) 색은 항상 이 기준 고정: 80~100 Success, 50~79 Warning, 0~49 Danger
export function scoreColor(score) {
  if (score == null) return 'var(--color-ink-600)'
  if (score >= 80) return 'var(--color-success)'
  if (score >= 50) return 'var(--color-warning)'
  return 'var(--color-danger)'
}
