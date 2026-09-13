// 01 컬러 규칙 — 점수·퍼센트(0~100) 색은 항상 이 기준 고정: 80~100 Success, 50~79 Warning, 0~49 Danger
export function scoreColor(score) {
  if (score == null) return '#5C5D6E'
  if (score >= 80) return '#2E9E5B'
  if (score >= 50) return '#E5A02E'
  return '#E5484D'
}
