// 트립 버디(챗봇) 아이콘 - 말풍선+로봇 얼굴 하이브리드 레퍼런스 디자인을
// 우리 브랜드 보라 톤으로 재현. 안테나 · 반짝임(알림) 표시 · 말풍선 꼬리 ·
// 캡슐형 눈이 있는 화면(screen)까지 레퍼런스 구성 그대로 가져옴.
// ChatbotFab(플로팅 버튼)과 ChatbotView(헤더·말풍선 아바타)가 공용으로 씀.
export default function FenggoIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#6D57FC" />

      {/* 안테나 */}
      <line x1="24" y1="13" x2="24" y2="8" stroke="#EDE9FF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="6.2" r="2.6" fill="#EDE9FF" />

      {/* 반짝임(알림) 표시 */}
      <line x1="36.5" y1="9.5" x2="33.5" y2="13.5" stroke="#EDE9FF" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="40" y1="14" x2="36" y2="16.3" stroke="#EDE9FF" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="41" y1="20" x2="36.5" y2="20" stroke="#EDE9FF" strokeWidth="2.2" strokeLinecap="round" />

      {/* 말풍선 꼬리 */}
      <path d="M14 32.5 L14 39.5 L20.5 33.5 Z" fill="#EDE9FF" />

      {/* 말풍선 몸체 */}
      <rect x="9.5" y="13" width="28" height="21" rx="10.5" fill="#EDE9FF" />

      {/* 화면(스크린) */}
      <rect x="13.5" y="17.5" width="20" height="12" rx="6" fill="#4A3AC9" />

      {/* 눈 - 캡슐형 */}
      <rect x="18.5" y="20.5" width="4" height="6" rx="2" fill="#EDE9FF" />
      <rect x="25.5" y="20.5" width="4" height="6" rx="2" fill="#EDE9FF" />
    </svg>
  )
}
