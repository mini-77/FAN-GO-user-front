import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'fango_language'

// 화면에 아직 없는 번역 키를 찾거나, 브라우저 언어가 지원 목록에 없을 때 쓰는 최종 fallback.
// 서비스 대상이 해외 팬덤이라 한국어보다 영어를 기본값으로 둠.
const DEFAULT_LANGUAGE = 'en'

// 드롭다운 등에서 목록을 그릴 때 이 배열을 그대로 쓰면 됨 (순서 = 화면에 보여줄 순서)
export const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'th', 'id']

// 브라우저 locale(navigator.language, 예: 'zh-TW', 'zh', 'en-US', 'fr')을
// 우리가 지원하는 언어 코드로 매핑. 지원 목록에 없는 언어는 전부 영어로 감.
function detectBrowserLanguage() {
  try {
    const raw = (navigator.language || navigator.userLanguage || '').toLowerCase()
    if (!raw) return DEFAULT_LANGUAGE

    if (raw.startsWith('ko')) return 'ko'
    if (raw.startsWith('ja')) return 'ja'
    if (raw.startsWith('th')) return 'th'
    if (raw.startsWith('id') || raw === 'in') return 'id'
    if (raw.startsWith('zh')) {
      if (raw.includes('tw') || raw.includes('hk') || raw.includes('hant')) return 'zh-TW'
      return 'zh-CN'
    }
    if (raw.startsWith('en')) return 'en'

    return DEFAULT_LANGUAGE
  } catch (e) {
    return DEFAULT_LANGUAGE
  }
}

function loadInitialLanguage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && translations[saved]) return saved
    return detectBrowserLanguage()
  } catch (e) {
    return DEFAULT_LANGUAGE
  }
}

function resolveKey(dict, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict)
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(loadInitialLanguage)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch (e) {
      // 무시
    }
  }, [language])

  function t(key) {
    const value =
      resolveKey(translations[language], key) ?? resolveKey(translations[DEFAULT_LANGUAGE], key)
    if (value === undefined) {
      console.warn(`[i18n] 번역 키를 찾을 수 없어요: "${key}"`)
      return key
    }
    return value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage는 <LanguageProvider> 안에서만 쓸 수 있어요. App.jsx 확인해주세요.')
  }
  return ctx
}
