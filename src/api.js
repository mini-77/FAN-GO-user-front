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

export { API_BASE }
