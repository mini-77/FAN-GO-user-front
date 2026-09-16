import { useEffect } from 'react'
import { useTrip } from './TripContext'
import { callRefresh } from './api'

// access_token 유효시간이 1시간이라, 로그인 상태인 동안 30분마다 미리 갱신해둠.
// 401 맞았을 때만 갱신하는 apiFetch의 재시도 로직(api.js)과 별개로, 사용자가 아무
// 요청도 안 보내고 오래 머물러 있다가 갑자기 만료되는 상황을 줄이기 위한 보완책.
const REFRESH_INTERVAL_MS = 30 * 60 * 1000

export default function TokenRefreshScheduler() {
  const { tripData } = useTrip()
  const isLoggedIn = !!tripData.account

  useEffect(() => {
    if (!isLoggedIn) return

    const timer = setInterval(() => {
      // apiFetch가 401 재시도로 이미 갱신 중이면 그 요청에 합류함(중복 호출 방지) -
      // 회전형 refresh_token이 이중으로 소모되어 무효화되는 걸 막아줌
      callRefresh().catch(() => {
        // 실패해도 조용히 무시 - 실제 요청에서 401 나면 apiFetch가 알아서 재시도함
      })
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [isLoggedIn])

  return null
}
