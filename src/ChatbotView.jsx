import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from './api'
import BottomNav from './BottomNav'
import FenggoIcon from './FenggoIcon'
import styles from './ChatbotView.module.css'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: '안녕! 난 너의 완벽한 성지순례를 도울 트립 버디 팽고야 💜 궁금한 장소나 아티스트를 편하게 물어봐!',
}

// 빠른 질문 칩 - 누르면 그 문장 그대로 전송됨 (목업 기준 고정 문구)
const QUICK_REPLIES = ['🕒 영업시간 알려줘', '📖 여기에 어떤 에피소드가 있어?']

// 세션 목록의 last_message_at을 "방금 / N분 전 / 어제 / N일 전 / 지난주" 식으로 표시
function formatRelativeTime(isoString) {
  if (!isoString) return ''
  const then = new Date(isoString)
  const now = new Date()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return '방금'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay === 1) return '어제'
  if (diffDay < 7) return `${diffDay}일 전`
  return '지난주'
}

// 혼잡도 관련 답변일 때 보여줄 막대그래프 카드.
// ⚠️ /chat API가 시간대별 숫자를 안 내려줘서, 지금은 화면 모양만 보여주는 예시 데이터임.
// 백엔드가 실제 시간대별 혼잡도 수치를 내려주게 되면 이 하드코딩된 값을 그 데이터로 바꾸면 됨.
const DEMO_CONGESTION = {
  placeName: '고척 스카이돔 서측 광장',
  dayLabel: '토요일',
  hours: [
    { label: '10시', level: 1 },
    { label: '12시', level: 2 },
    { label: '14시', level: 2 },
    { label: '16시', level: 3 },
    { label: '18시', level: 3 },
    { label: '20시', level: 2 },
  ],
}

const LEVEL_COLOR = { 1: '#DED9FF', 2: '#A89BFF', 3: '#6D57FC' }
const LEVEL_HEIGHT = { 1: 18, 2: 34, 3: 52 }

function CongestionCard({ data }) {
  return (
    <div className={styles.congestionCard}>
      <span className={styles.congestionEyebrow}>평균 혼잡도 · {data.dayLabel}</span>
      <span className={styles.congestionTitle}>{data.placeName}</span>
      <span className={styles.congestionDesc}>이 시간대는 보통 붐비는 편이에요.</span>
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
          <span className={styles.legendDot} style={{ background: LEVEL_COLOR[1] }} /> 여유
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: LEVEL_COLOR[2] }} /> 보통
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: LEVEL_COLOR[3] }} /> 붐빔
        </span>
      </div>
    </div>
  )
}

export default function ChatbotView() {
  const navigate = useNavigate()

  const [sessions, setSessions] = useState([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [currentSessionNo, setCurrentSessionNo] = useState(null)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
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
        if (!res.ok) throw new Error('대화 목록을 불러오지 못했어요.')
        const data = await res.json()
        if (!cancelled) setSessions(data)
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
      if (!res.ok) throw new Error('대화 내용을 불러오지 못했어요.')
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
      setErrorMessage('대화 내용을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsLoadingMessages(false)
    }
  }

  // "새 대화" - 화면을 초기 환영 메시지로 되돌리고, 세션 번호를 비워서 다음 전송 때 새 세션이 생성되게 함
  function startNewChat() {
    setCurrentSessionNo(null)
    setMessages([WELCOME_MESSAGE])
    setErrorMessage('')
  }

  async function sendMessage(rawText) {
    const text = (rawText ?? input).trim()
    if (!text || isSending) return
    if (text.length > 1000) {
      setErrorMessage('메시지는 1000자 이내로 입력해 주세요.')
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
        const message =
          typeof detail === 'string'
            ? detail
            : detail?.message || '메시지를 보내는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.'
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
        { role: 'assistant', content: '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.', isError: true },
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
            aria-label="뒤로가기"
          >
            ←
          </button>
          <div className={styles.headerBotInfo}>
            <div className={styles.headerAvatar}><FenggoIcon size={44} /></div>
            <div className={styles.headerTexts}>
              <span className={styles.headerTitle}>트립 버디</span>
              <span className={styles.headerStatus}>
                <span className={styles.statusDot} />
                FENGGO 지금 응답 가능
              </span>
            </div>
          </div>
          <button
            type="button"
            className={styles.headerIconBtn}
            onClick={startNewChat}
            aria-label="새 대화"
          >
            ⟳
          </button>
        </div>

        {/* 대화 히스토리 */}
        <div className={styles.historySection}>
          <div className={styles.historySectionHeader}>
            <span className={styles.historyLabel}>대화 히스토리</span>
            <button type="button" className={styles.newChatLink} onClick={startNewChat}>
              새 대화
            </button>
          </div>
          <div className={styles.historyList}>
            {isLoadingSessions && <p className={styles.historyHint}>불러오는 중이에요...</p>}
            {!isLoadingSessions && sessions.length === 0 && (
              <p className={styles.historyHint}>아직 대화 기록이 없어요.</p>
            )}
            {!isLoadingSessions &&
              sessions.map((s) => (
                <button
                  type="button"
                  key={s.chat_session_no}
                  className={`${styles.historyCard} ${
                    s.chat_session_no === currentSessionNo ? styles.historyCardActive : ''
                  }`}
                  onClick={() => openSession(s.chat_session_no)}
                >
                  <span className={styles.historyIcon}>💬</span>
                  <span className={styles.historyTexts}>
                    <span className={styles.historyTitle}>{s.preview || '대화'}</span>
                    <span className={styles.historyMeta}>{formatRelativeTime(s.last_message_at)}</span>
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className={styles.chatArea} ref={scrollRef}>
          {isLoadingMessages && <p className={styles.chatHint}>대화를 불러오는 중이에요...</p>}
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
                    <div className={styles.fallbackTag}>관련 정보를 찾지 못했어요</div>
                  )}
                  {m.role === 'assistant' && !m.isFallback && m.content.includes('혼잡') && (
                    <CongestionCard data={DEMO_CONGESTION} />
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
          {QUICK_REPLIES.map((q) => (
            <button
              type="button"
              key={q}
              className={styles.quickReplyChip}
              onClick={() => sendMessage(q.replace(/^[^\s]+\s/, ''))}
              disabled={isSending}
            >
              {q}
            </button>
          ))}
        </div>

        {/* 입력창 */}
        <div className={styles.inputBar}>
          <input
            className={styles.input}
            type="text"
            placeholder="장소명이나 아티스트 이름을 입력해 보세요"
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
            aria-label="전송"
          >
            ➤
          </button>
        </div>
        <BottomNav />
      </div>
    </div>
  )
}
