import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from './translations'
import { apiFetch } from './api'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'fango_language'

// 화면에 아직 없는 번역 키를 찾거나, 브라우저 언어가 지원 목록에 없을 때 쓰는 최종 fallback.
// 서비스 대상이 해외 팬덤이라 한국어보다 영어를 기본값으로 둠.
const DEFAULT_LANGUAGE = 'en'

// 드롭다운 등에서 목록을 그릴 때 이 배열을 그대로 쓰면 됨 (순서 = 화면에 보여줄 순서)
export const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'th', 'id']

// 헤더 언어 필("KR ⌄") 표기용 - 09 헤더 규칙: 지구본 아이콘 대신 국가코드 2자만 표기.
// nativeName은 선택 목록(다크시트/드롭다운)에 쓰는 각 언어의 자체 표기.
export const LANGUAGE_LABELS = {
  ko: { pill: 'KR', nativeName: '한국어' },
  en: { pill: 'EN', nativeName: 'English' },
  ja: { pill: 'JP', nativeName: '日本語' },
  'zh-CN': { pill: 'CN', nativeName: '简体中文' },
  'zh-TW': { pill: 'TW', nativeName: '繁體中文' },
  th: { pill: 'TH', nativeName: 'ภาษาไทย' },
  id: { pill: 'ID', nativeName: 'Bahasa Indonesia' },
}

// 백엔드 /langs가 내려주는 lang_no <-> 앱 언어 코드 매핑 (원래 LoginView.jsx에 있던 것을
// 헤더 언어 필로 옮김 - 09_v1_v2_master.md, 14_step3_partial_implementation.md 12번 참고)
// 백엔드는 중국어를 간체/번체로 나누지 않고 "中文" 하나만 내려주므로 4번은 zh-CN(간체)으로 매핑함.
const LANG_NO_TO_CODE = { 1: 'ko', 2: 'en', 3: 'ja', 4: 'zh-CN', 5: 'th', 6: 'id' }

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
  // 백엔드가 실제로 지원하는 언어 목록 ([{lang_no, lang_nm}, ...]) - 헤더 언어 필의 선택
  // 목록으로 씀. 앱 전체에서 한 번만 불러오면 되므로 Provider(=App 최상단)에서 로드함.
  // 불러오기 전이거나 실패하면 빈 배열 - 이땐 AppHeader가 SUPPORTED_LANGUAGES로 대체함.
  // (기존 값을 덮어쓰지 않음 - 예전 LoginView는 로드 후 첫 번째 언어로 강제 전환했는데,
  //  이 로직을 화면마다 항상 떠 있는 AppHeader로 옮기면 사용자가 골라둔 언어가 화면
  //  전환마다 계속 초기화되는 문제가 생겨서 그 부작용은 가져오지 않음)
  const [apiLanguages, setApiLanguages] = useState([])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch (e) {
      // 무시
    }
  }, [language])

  useEffect(() => {
    let cancelled = false
    async function loadLangs() {
      try {
        const res = await apiFetch('/langs')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setApiLanguages(data)
      } catch (e) {
        // 목록을 못 불러와도 AppHeader가 SUPPORTED_LANGUAGES로 대체하므로 무시
      }
    }
    loadLangs()
    return () => {
      cancelled = true
    }
  }, [])

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
    <LanguageContext.Provider value={{ language, setLanguage, t, apiLanguages, LANG_NO_TO_CODE }}>
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
