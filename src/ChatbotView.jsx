import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, safeText } from './api'
import { useLanguage } from './LanguageContext'
import BottomNav from './BottomNav'
import FenggoIcon from './FenggoIcon'
import Icon from './Icon'
import styles from './ChatbotView.module.css'

// 세션 목록의 last_message_at을 "방금 / N분 전 / 어제 / N일 전 / 지난주" 식으로 표시
function formatRelativeTime(isoString, t) {
  if (!isoString) return ''
  const then = new Date(isoString)
  const now = new Date()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return t('chat.justNow')
  if (diffMin < 60) return t('chat.minutesAgo')(diffMin)
  if (diffHour < 24) return t('chat.hoursAgo')(diffHour)
  if (diffDay === 1) return t('chat.yesterday')
  if (diffDay < 7) return t('chat.daysAgo')(diffDay)
  return t('chat.lastWeek')
}

// 혼잡도 관련 답변일 때 보여줄 막대그래프 카드.
// ⚠️ /chat API가 시간대별 숫자를 안 내려줘서, 지금은 화면 모양만 보여주는 예시 데이터임.
// 백엔드가 실제 시간대별 혼잡도 수치를 내려주게 되면 이 하드코딩된 값을 그 데이터로 바꾸면 됨.
function buildDemoCongestion(t) {
  return {
    placeName: t('chat.demoPlaceName'),
    dayLabel: t('chat.demoDayLabel'),
    hours: [10, 12, 14, 16, 18, 20].map((h, i) => ({
      label: t('chat.demoHourLabel')(h),
      level: [1, 2, 2, 3, 3, 2][i],
    })),
  }
}

// 01 컬러 규칙 — 여유/혼잡 같은 점수·상태 색은 브랜드색이 아니라 Success/Warning/Danger로 고정
const LEVEL_COLOR = { 1: 'var(--color-success)', 2: 'var(--color-warning)', 3: 'var(--color-danger)' }
const LEVEL_HEIGHT = { 1: 18, 2: 34, 3: 52 }

function CongestionCard({ data, t }) {
  return (
    <div className={styles.congestionCard}>
      <span className={styles.congestionEyebrow}>{t('chat.congestionEyebrow')(data.dayLabel)}</span>
      <span className={styles.congestionTitle}>{data.placeName}</span>
      <span className={styles.congestionDesc}>{t('chat.congestionDesc')}</span>
      <div className={styles.congestionChart}>
        {data.hours.map((h) => (
          <div key={h.label} className={styles.congestionBarCol}>
            <div
              className={styles.congestionBar}
              style={{ height: LEVEL_HEIGHT[h.level], background: LEVEL_COLOR[h.level] }}
            />
            <span className={styles.congestionBarLabel}>{h.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.congestionLegend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: LEVEL_COLOR[1] }} /> {t('chat.legendCalm')}
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: LEVEL_COLOR[2] }} /> {t('chat.legendNormal')}
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: LEVEL_COLOR[3] }} /> {t('chat.legendCrowded')}
        </span>
      </div>
    </div>
  )
}

export default function ChatbotView() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const welcomeMessage = useMemo(
    () => ({ role: 'assistant', content: t('chat.welcomeMessage') }),
    [t]
  )
  // 빠른 질문 칩 - 누르면 그 문장 그대로 전송됨 (목업 기준 고정 문구)
  const quickReplies = t('chat.quickReplies')

  const [sessions, setSessions] = useState([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  // 08 리스트 섹션 규칙 — 길이가 정해지지 않은 리스트는 무한스크롤 대신 8~10개씩 "더보기"로
  // 불러옴 (EventSelectView/HistoryView와 동일 기준, 11_impact_plan.md 12번 섹션)
  const HISTORY_PAGE_SIZE = 8
  const [historyVisibleCount, setHistoryVisibleCount] = useState(HISTORY_PAGE_SIZE)
  const [currentSessionNo, setCurrentSessionNo] = useState(null)
  const [messages, setMessages] = useState([welcomeMessage])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const scrollRef = useRef(null)

  // 대화 히스토리 목록 불러오기 (최초 1회)
  useEffect(() => {
    let cancelled = false
    async function loadSessions() {
      setIsLoadingSessions(true)
      try {
        const res = await apiFetch('/chat/sessions')
        if (!res.ok) throw new Error(t('chat.loadSessionsError'))
        const data = await res.json()
        if (!cancelled) {
          setSessions(data)
          setHistoryVisibleCount(HISTORY_PAGE_SIZE)
        }
      } catch (e) {
        // 히스토리를 못 불러와도 새 대화 자체는 계속 가능해야 함
      } finally {
        if (!cancelled) setIsLoadingSessions(false)
      }
    }
    loadSessions()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoadingMessages])

  // 지난 대화 카드를 눌렀을 때, 그 세션의 메시지 전체를 불러와서 이어서 보여줌
  async function openSession(sessionNo) {
    if (sessionNo === currentSessionNo) return
    setErrorMessage('')
    setIsLoadingMessages(true)
    try {
      const res = await apiFetch(`/chat/sessions/${sessionNo}/messages`)
      if (!res.ok) throw new Error(t('chat.loadMessagesError'))
      const data = await res.json()
      setMessages(
        data.map((m) => ({
          role: m.role,
          content: m.content,
          sources: m.sources,
          isFallback: m.is_fallback,
        }))
      )
      setCurrentSessionNo(sessionNo)
    } catch (e) {
      setErrorMessage(t('chat.loadMessagesErrorRetry'))
    } finally {
      setIsLoadingMessages(false)
    }
  }

  // "새 대화" - 화면을 초기 환영 메시지로 되돌리고, 세션 번호를 비워서 다음 전송 때 새 세션이 생성되게 함
  function startNewChat() {
    setCurrentSessionNo(null)
    setMessages([welcomeMessage])
    setErrorMessage('')
  }

  async function sendMessage(rawText) {
    const text = (rawText ?? input).trim()
    if (!text || isSending) return
    if (text.length > 1000) {
      setErrorMessage(t('chat.messageTooLong'))
      return
    }

    setErrorMessage('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setIsSending(true)

    try {
      const res = await apiFetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, chat_session_no: currentSessionNo }),
      })

      if (!res.ok) {
        if (res.status === 404 || res.status === 403) {
          setCurrentSessionNo(null)
        }
        const data = await res.json().catch(() => null)
        const detail = data?.detail
        const rawMessage = typeof detail === 'string' ? detail : detail?.message
        // 08 에러 화면 규칙 - 백엔드 detail이 영어 기술 메시지일 수 있어 그대로 노출하지 않음
        const message = safeText(rawMessage, t('chat.sendMessageError'))
        setMessages((prev) => [...prev, { role: 'assistant', content: message, isError: true }])
        return
      }

      const data = await res.json()
      const isNewSession = currentSessionNo === null
      setCurrentSessionNo(data.chat_session_no)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          isFallback: data.is_fallback,
        },
      ])

      // 새 세션이 이번에 막 생성됐으면, 히스토리 목록 맨 위에도 즉시 반영
      if (isNewSession) {
        setSessions((prev) => [
          {
            chat_session_no: data.chat_session_no,
            created_at: new Date().toISOString(),
            last_message_at: new Date().toISOString(),
            preview: text.slice(0, 40),
          },
          ...prev,
        ])
      } else {
        setSessions((prev) =>
          prev.map((s) =>
            s.chat_session_no === data.chat_session_no
              ? { ...s, last_message_at: new Date().toISOString() }
              : s
          )
        )
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('login.connectionError'), isError: true },
      ])
    } finally {
      setIsSending(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        {/* 헤더 */}
        <div className={styles.header}>
          <button
            type="button"
            className={styles.headerIconBtn}
            onClick={() => navigate(-1)}
            aria-label={t('chat.close')}
          >
            <Icon name="close" size={16} color="#fff" />
          </button>
          <div className={styles.headerBotInfo}>
            <div className={styles.headerAvatar}><FenggoIcon size={44} /></div>
            <div className={styles.headerTexts}>
              <span className={styles.headerTitle}>{t('chat.tripBuddy')}</span>
              <span className={styles.headerStatus}>
                <span className={styles.statusDot} />
                {t('chat.availableNow')}
              </span>
            </div>
          </div>
        </div>

        {/* 대화 히스토리 */}
        <div className={styles.historySection}>
          <div className={styles.historySectionHeader}>
            <span className={styles.historyLabel}>{t('chat.chatHistory')}</span>
            <button type="button" className={styles.newChatLink} onClick={startNewChat}>
              {t('chat.newChat')}
            </button>
          </div>
          <div className={styles.historyList}>
            {isLoadingSessions && <p className={styles.historyHint}>{t('common.loading')}</p>}
            {!isLoadingSessions && sessions.length === 0 && (
              <p className={styles.historyHint}>{t('chat.noHistory')}</p>
            )}
            {!isLoadingSessions &&
              sessions.slice(0, historyVisibleCount).map((s) => (
                <button
                  type="button"
                  key={s.chat_session_no}
                  className={`${styles.historyCard} ${
                    s.chat_session_no === currentSessionNo ? styles.historyCardActive : ''
                  }`}
                  onClick={() => openSession(s.chat_session_no)}
                >
                  <span className={styles.historyIcon}><Icon name="chat" size={16} color="var(--color-primary-500)" /></span>
                  <span className={styles.historyTexts}>
                    <span className={styles.historyTitle}>{s.preview || t('chat.conversation')}</span>
                    <span className={styles.historyMeta}>{formatRelativeTime(s.last_message_at, t)}</span>
                  </span>
                </button>
              ))}
            {!isLoadingSessions && sessions.length > historyVisibleCount && (
              <button
                type="button"
                className={styles.historyLoadMoreBtn}
                onClick={() => setHistoryVisibleCount((v) => v + HISTORY_PAGE_SIZE)}
              >
                {t('common.loadMore')} <Icon name="chevronDown" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className={styles.chatArea} ref={scrollRef}>
          {isLoadingMessages && <p className={styles.chatHint}>{t('chat.loadingChat')}</p>}
          {!isLoadingMessages &&
            messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.messageRow} ${
                  m.role === 'user' ? styles.messageRowUser : ''
                }`}
              >
                {m.role === 'assistant' && <span className={styles.botAvatar}><FenggoIcon size={40} /></span>}
                <div
                  className={`${styles.bubble} ${
                    m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant
                  } ${m.isError ? styles.bubbleError : ''}`}
                >
                  {m.content}
                  {m.role === 'assistant' && m.isFallback && (
                    <div className={styles.fallbackTag}>{t('chat.fallbackTag')}</div>
                  )}
                  {m.role === 'assistant' && !m.isFallback && m.content.includes('혼잡') && (
                    <CongestionCard data={buildDemoCongestion(t)} t={t} />
                  )}
                </div>
              </div>
            ))}
          {isSending && (
            <div className={styles.messageRow}>
              <span className={styles.botAvatar}><FenggoIcon size={40} /></span>
              <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            </div>
          )}
        </div>

        {errorMessage && <p className={styles.inlineError}>{errorMessage}</p>}

        {/* 빠른 질문 칩 */}
        <div className={styles.quickReplies}>
          {quickReplies.map((q) => (
            <button
              type="button"
              key={q}
              className={styles.quickReplyChip}
              onClick={() => sendMessage(q)}
              disabled={isSending}
            >
              {q}
            </button>
          ))}
        </div>

        {/* 입력창 - 입력창과 전송 버튼을 하나의 둥근 알약 안에 담음(레퍼런스 목업 기준) */}
        <div className={styles.inputBar}>
          <div className={styles.inputWrap}>
            <input
              className={styles.input}
              type="text"
              placeholder={t('chat.inputPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={1000}
            />
            <button
              type="button"
              className={styles.sendBtn}
              onClick={() => sendMessage()}
              disabled={isSending || !input.trim()}
              aria-label={t('common.send')}
            >
              <Icon name="send" size={16} color="#fff" />
            </button>
          </div>
        </div>
        <BottomNav noBorder />
      </div>
    </div>
  )
}
