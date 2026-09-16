// 이제 프론트 서버가 프록시로 중계하니까, 브라우저 입장에서는 전부 같은 origin
// (지금 켜져있는 프론트 주소) 요청으로 보여요. vite.config.js의 server.proxy 설정과 짝을 이룸.
const API_BASE = '/api'

// 여러 요청이 동시에 401을 맞아도 /auth/refresh는 한 번만 호출되게 하기 위한 잠금장치
let refreshPromise = null

function callRefresh() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      // 다음번 401 때 다시 시도할 수 있게 풀어줌
      refreshPromise = null
    })
  }
  return refreshPromise
}

/**
 * fetch를 그대로 쓰되, access_token이 만료(401)됐을 때 자동으로
 * POST /auth/refresh를 호출해서 갱신하고 원래 요청을 한 번 더 시도해줌.
 * 갱신도 실패하면(재로그인 필요) 401 응답을 그대로 반환하니, 호출하는 쪽에서
 * res.status === 401 체크해서 로그인 화면으로 보내면 됨.
 *
 * 사용법은 fetch랑 거의 같음:
 *   const res = await apiFetch('/me')
 *   const res = await apiFetch('/signup', { method: 'POST', headers: {...}, body: ... })
 *
 * path는 '/me'처럼 API_BASE 뒤에 붙는 경로만 써도 되고, 필요하면 전체 주소도 그대로 써도 됨.
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const finalOptions = { credentials: 'include', ...options }

  const res = await fetch(url, finalOptions)

  // /auth/refresh 자기 자신이 401나면 무한루프 방지를 위해 그냥 반환
  if (res.status !== 401 || url.includes('/auth/refresh') || url.includes('/signin')) {
    return res
  }

  const refreshRes = await callRefresh()
  if (!refreshRes.ok) {
    // 갱신 실패 - refresh_token까지 만료된 경우라 재로그인이 필요함. 원래 401을 그대로 돌려줌.
    return res
  }

  // 토큰 갱신 성공 - 원래 요청 한 번 더 시도
  return fetch(url, finalOptions)
}

// 08 에러 화면 규칙 - 보안·신뢰 원칙: 사용자는 원본 에러(브라우저 fetch 실패 메시지,
// JSON 파싱 오류 등 영어 기술 문구)를 절대 보면 안 되고, 항상 사람이 이해할 문장만 봐야 함.
// 이 앱에서 직접 던지는 에러는 항상 친절한 한국어 문장이라 e.message를 그대로 써도 안전하고,
// 그 외(네트워크 예외 등 영어/기술적 메시지)는 안전한 대체 문구로 치환함.
// 한글 포함 여부로 "우리가 직접 던진 에러인지"를 구분함 - 원본 영어 에러가 실수로라도
// 화면에 노출되는 걸 막는 마지막 방어선.
// 백엔드가 돌려준 에러 문구(회원가입 검증 실패 등)도 마찬가지 - FastAPI/Pydantic 검증
// 메시지 같은 건 기본적으로 영어라서 그대로 노출하면 안 됨. 문자열 하나만 검사할 때 씀.
export function safeText(text, fallback) {
  if (text && /[가-힣]/.test(text)) return text
  return fallback
}

export function safeErrorMessage(e, fallback) {
  return safeText(e?.message, fallback)
}

// TokenRefreshScheduler(30분 주기 선제 갱신)도 이 락을 같이 써야 함 - 안 그러면
// 마침 사용자 요청이 401을 맞아 apiFetch가 refresh 중일 때 스케줄러가 동시에
// 또 /auth/refresh를 쏴서, 회전형(1회용) refresh_token이 이미 소모된 상태로
// 두 번째 요청이 도착해 "유효하지 않은 리프레시 토큰입니다" 에러가 남.
export { API_BASE, callRefresh }
