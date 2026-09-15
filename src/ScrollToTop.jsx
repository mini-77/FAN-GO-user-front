import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 페이지(경로) 이동 시 이전 화면의 스크롤 위치가 남아있던 문제 - 화면 자체(.card 안
// .list/.body)는 매번 새로 마운트되는 DOM이라 스크롤이 저절로 0이지만, 데스크톱
// 미리보기 폭(카드가 뷰포트보다 커서 window 자체가 스크롤되는 경우)에서는
// window 스크롤 위치가 경로가 바뀌어도 그대로 남아있었음.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
