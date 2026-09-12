import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'fango_dark_mode'

function loadInitialDarkMode() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch (e) {
    return false
  }
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(loadInitialDarkMode)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(isDarkMode))
    } catch (e) {
      // 무시
    }
    // body에 dark-mode 클래스를 붙였다 뗐다 함 - index.html에 있는 전역 CSS가
    // 이 클래스를 보고 화면 전체 색을 반전시킴 (화면 하나하나 CSS 파일을 다 안 고쳐도 됨).
    document.body.classList.toggle('dark-mode', isDarkMode)
  }, [isDarkMode])

  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 사용법: const { isDarkMode, toggleDarkMode } = useTheme()
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme은 <ThemeProvider> 안에서만 쓸 수 있어요. App.jsx 확인해주세요.')
  }
  return ctx
}
