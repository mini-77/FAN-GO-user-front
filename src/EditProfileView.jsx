import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import { apiFetch, safeErrorMessage, safeText } from './api'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import styles from './EditProfileView.module.css'

const MAX_ARTISTS = 2
const MAX_PHOTO_BYTES = 5 * 1024 * 1024 // 5MB - 백엔드 명세 기준
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export default function EditProfileView() {
  const navigate = useNavigate()
  const { tripData, updateTrip, resetTripPlanning } = useTrip()
  const account = tripData.account || {}

  const [nickname, setNickname] = useState(account.nickname || '')
  const [nationality, setNationality] = useState(account.nationality || '')
  const [selectedLanguage, setSelectedLanguage] = useState(account.selectedLanguage || null)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [selectedArtistIds, setSelectedArtistIds] = useState(
    new Set((tripData.selectedArtists || []).map((a) => a.id))
  )

  const [nationalities, setNationalities] = useState([])
  const [langs, setLangs] = useState([])
  const [artistGroups, setArtistGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  async function loadOptions() {
    setIsLoading(true)
    setLoadError('')
    try {
      const [natRes, langRes, artistRes] = await Promise.all([
        apiFetch('/nationalities'),
        apiFetch('/langs'),
        apiFetch('/artist-groups'),
      ])
      if (!natRes.ok || !langRes.ok || !artistRes.ok) {
        throw new Error('설정에 필요한 목록을 불러오지 못했어요.')
      }
      const natData = await natRes.json()
      const langData = await langRes.json()
      const artistData = await artistRes.json()

      const sortedNat = [...natData].sort((a, b) =>
        a.nationality_nm.localeCompare(b.nationality_nm, 'ko')
      )
      setNationalities(sortedNat)
      setLangs(langData)
      setArtistGroups(artistData)
    } catch (e) {
      setLoadError(safeErrorMessage(e, '설정에 필요한 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [profileImg, setProfileImg] = useState(account.profileImg || null)

  function toggleArtist(id) {
    setSelectedArtistIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (next.size >= MAX_ARTISTS) return prev
        next.add(id)
      }
      return next
    })
  }

  async function handleSave() {
    setSaveError('')

    if (!nickname.trim()) {
      setSaveError('닉네임을 입력해 주세요.')
      return
    }

    setIsSaving(true)

    // 명세상 "안 보낸 필드는 그대로 유지"라서, 바꾼 값들만 보내면 됨.
    // favorite_group_nos는 예외로 - 보내는 순간 기존 즐겨찾기를 통째로 교체하니, 뭔가 골랐을 때만 보냄.
    const payload = {
      nickname,
      nationality_no: nationality ? Number(nationality) : undefined,
      lang_no: selectedLanguage ? Number(selectedLanguage) : undefined,
    }
    if (selectedArtistIds.size > 0) {
      payload.favorite_group_nos = Array.from(selectedArtistIds)
    }

    try {
      const res = await apiFetch('/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 401) {
        setSaveError('로그인이 만료됐어요. 다시 로그인해주세요.')
        setIsSaving(false)
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const detail = data?.detail
        let message = '저장 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.'
        if (typeof detail === 'string') message = detail
        else if (detail?.message) message = detail.message
        else if (Array.isArray(detail) && detail[0]?.msg) message = detail[0].msg
        setSaveError(message)
        setIsSaving(false)
        return
      }

      const me = await res.json()
      const updatedArtists = artistGroups
        .filter((a) => selectedArtistIds.has(a.artist_group_no))
        .map((a) => ({ id: a.artist_group_no, name: a.group_nm }))

      // 그룹이 실제로 바뀌었는지 비교 (id 집합 기준) - 바뀌었을 때만 여행 계획 초기화.
      // 예: NCT+BTS -> 블랙핑크+트와이스로 바꾸면, 이전에 골라둔 NCT 콘서트/멤버 선택이
      // tripData에 그대로 남아있으면 안 되니까 여기서 지워줌.
      const prevIds = new Set((tripData.selectedArtists || []).map((a) => a.id))
      const nextIds = new Set(updatedArtists.map((a) => a.id))
      const groupsChanged =
        updatedArtists.length > 0 &&
        (prevIds.size !== nextIds.size || [...prevIds].some((id) => !nextIds.has(id)))

      updateTrip({
        account: {
          ...account,
          nickname: me.nickname,
          email: me.login_id,
          nationality: me.nationality_no,
          selectedLanguage: me.lang_no,
        },
        selectedArtists: updatedArtists.length > 0 ? updatedArtists : tripData.selectedArtists,
      })
      if (groupsChanged) {
        resetTripPlanning()
      }
      navigate('/account')
    } catch (e) {
      setSaveError('서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.')
      setIsSaving(false)
    }
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setSaveError('')

    // 서버까지 보내기 전에 미리 걸러줌 (백엔드 명세: jpg/png/webp, 5MB 이하)
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setSaveError('jpg, png, webp 형식의 사진만 올릴 수 있어요.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setSaveError('사진 용량은 5MB 이하만 가능해요.')
      e.target.value = ''
      return
    }

    setIsUploadingPhoto(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await apiFetch('/me/profile-image', {
        method: 'POST',
        body: formData,
      })
      if (res.status === 401) {
        setSaveError('로그인이 만료됐어요. 다시 로그인해주세요.')
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const detail = data?.detail
        const rawMessage = typeof detail === 'string' ? detail : detail?.message
        // 08 에러 화면 규칙 - 백엔드 detail이 영어 기술 메시지일 수 있어 그대로 노출하지 않음
        setSaveError(safeText(rawMessage, '사진 업로드에 실패했어요.'))
        return
      }
      const me = await res.json()
      setProfileImg(me.profile_img)
      updateTrip({ account: { ...account, profileImg: me.profile_img } })
    } catch (e) {
      setSaveError('서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsUploadingPhoto(false)
      e.target.value = ''
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader />
        <div className={styles.header}>
          <span className={styles.title}>정보수정</span>
          <button type="button" className={styles['save-btn-top']} onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>

        {loadError && (
          <div style={{ padding: '0 22px' }}>
            <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>{loadError}</p>
            <button type="button" className={styles['avatar-change-btn']} onClick={loadOptions}>
              다시 시도
            </button>
          </div>
        )}

        <div className={styles.body}>
          <div className={styles['avatar-block']}>
            {profileImg ? (
              <img
                src={profileImg.startsWith('http') ? profileImg : `/api${profileImg}`}
                alt="프로필 사진"
                className={styles.avatar}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className={styles.avatar}>{(nickname || 'U').slice(0, 2).toUpperCase()}</div>
            )}
            <label className={styles['avatar-change-btn']}>
              {isUploadingPhoto ? '업로드 중...' : '프로필 사진 변경'}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                disabled={isUploadingPhoto}
              />
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles['field-label']}>닉네임</label>
            <input
              className={styles['field-input']}
              type="text"
              placeholder="표시 이름"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles['field-label']}>이메일</label>
            <input
              className={`${styles['field-input']} ${styles.disabled}`}
              type="text"
              value={account.email || ''}
              disabled
            />
          </div>

          <div className={styles.field}>
            <label className={styles['field-label']}>국적</label>
            <select
              className={styles['field-select']}
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              disabled={isLoading}
            >
              <option value="">국적 선택</option>
              {nationalities.map((n) => (
                <option key={n.nationality_no} value={n.nationality_no}>
                  {n.nationality_nm}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['pw-block']}>
            <span className={styles['section-label']}>비밀번호 변경</span>
            <p className={styles.infoBannerMuted}>비밀번호 변경 기능은 아직 준비 중이에요 (관련 API 대기 중).</p>
            <div className={styles.field}>
              <label className={styles['field-label']}>현재 비밀번호</label>
              <input
                className={styles['field-input']}
                type="password"
                placeholder="현재 비밀번호"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                disabled
              />
            </div>
            <div className={styles.field}>
              <label className={styles['field-label']}>새 비밀번호</label>
              <input
                className={styles['field-input']}
                type="password"
                placeholder="8자 이상, 영문+숫자"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                disabled
              />
            </div>
          </div>

          <div className={styles['artist-block']}>
            <span className={styles['section-label']}>관심 아티스트</span>
            <div className={styles['artist-tags']}>
              {artistGroups.map((a) => {
                const isActive = selectedArtistIds.has(a.artist_group_no)
                return (
                  <button
                    key={a.artist_group_no}
                    type="button"
                    className={`${styles['artist-tag']} ${isActive ? styles.active : ''}`}
                    onClick={() => toggleArtist(a.artist_group_no)}
                  >
                    {a.group_nm}
                  </button>
                )
              })}
            </div>
            <p className={styles.hint}>고른 팀 기준으로 이벤트와 성지가 다시 정렬돼요.</p>
          </div>
        </div>

        {saveError && (
          <p className={styles.hint} style={{ padding: '0 22px', color: 'var(--color-danger)' }}>
            {saveError}
          </p>
        )}

        <div className={styles.footer} data-bottom-bar="true">
          <button type="button" className={styles['save-btn']} onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}
