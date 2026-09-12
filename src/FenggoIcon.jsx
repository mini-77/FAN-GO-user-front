// 트립 버디(챗봇) 아이콘 - 말풍선 모양 얼굴. 각진 사각형 몸체는 그대로 두고,
// 눈은 동그랗게, 입은 부드러운 미소 곡선으로만 살짝 풀어서 무섭지 않게 다듬음.
// ChatbotFab(플로팅 버튼)과 ChatbotView(헤더·말풍선 아바타)가 공용으로 씀.
export default function FenggoIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#6D57FC" />

      {/* 말풍선 몸체 - 각진 사각형 */}
      <rect x="11" y="12" width="26" height="22" rx="6" fill="#EDE9FF" />

      {/* 눈 - 동그랗고 부드럽게 */}
      <circle cx="19" cy="22" r="2.5" fill="#4A3AC9" />
      <circle cx="29" cy="22" r="2.5" fill="#4A3AC9" />

      {/* 입 - 부드러운 미소 곡선 */}
      <path d="M18.5 27c1.8 2.4 5.2 2.4 7 0" stroke="#4A3AC9" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}
