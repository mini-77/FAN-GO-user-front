import { Navigate } from 'react-router-dom'
import { useTrip } from './TripContext'

// tripdataview(=TripDateView) 등 "이벤트를 먼저 골라야만" 들어올 수 있는 화면들을
// 감싸는 문지기 컴포넌트.
// - selectedEvent가 없으면(=EventSelectView를 거치지 않았으면) 무조건 /trip/events로 돌려보냄
// - 주소창에 직접 /trip/date 쳐서 들어오거나, 새로고침해도 똑같이 막힘
export default function RequireEvent({ children }) {
  const { tripData } = useTrip()

  if (!tripData.selectedEvent) {
    return <Navigate to="/trip/events" replace />
  }

  return children
}
