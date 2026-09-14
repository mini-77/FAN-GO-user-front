import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from './TripContext'
import AppHeader from './AppHeader'
import AgreementModal from './AgreementModal'
import { TERMS_TEXT, LOCATION_TEXT, PRIVACY_TEXT } from './agreementTexts'
import styles from './SignupView.module.css'

export default function SignupView() {
  const navigate = useNavigate()
  const { updateTrip } = useTrip()

  // 국적 이름(nationality_nm) → 국제전화 코드. API가 이름만 주고 전화코드는 안 줘서
  // 이름 기준으로 매칭. 예전에 하드코딩했던 국가 목록(DB에 그대로 들어간 이름들) 기준으로 전부 매핑함.
  const COUNTRY_CALLING_CODES = {
    가나: '233', 가봉: '241', 가이아나: '592', 감비아: '220', 건지: '44',
    과들루프: '590', 과테말라: '502', 괌: '1671', 그레나다: '1473', 그리스: '30',
    그린란드: '299', 기니: '224', 기니비사우: '245', 나미비아: '264', 나우루: '674',
    나이지리아: '234', 남수단: '211', 남아프리카: '27', 네덜란드: '31',
    '네덜란드령 카리브': '599', 네팔: '977', 노르웨이: '47', 노퍽섬: '672',
    뉴질랜드: '64', 뉴칼레도니아: '687', 니우에: '683', 니제르: '227', 니카라과: '505',
    대만: '886', 대한민국: '82', 한국: '82', 덴마크: '45', 도미니카: '1767',
    '도미니카 공화국': '1809', 독일: '49', 동티모르: '670', 라오스: '856',
    라이베리아: '231', 라트비아: '371', 러시아: '7', 레바논: '961', 레소토: '266',
    레위니옹: '262', 루마니아: '40', 룩셈부르크: '352', 르완다: '250', 리비아: '218',
    리투아니아: '370', 리히텐슈타인: '423', 마다가스카르: '261', 마르티니크: '596',
    '마셜 제도': '692', 마요트: '262', '마카오(중국 특별행정구)': '853', 말라위: '265',
    말레이시아: '60', 말리: '223', 맨섬: '44', 멕시코: '52', 모나코: '377',
    모로코: '212', 모리셔스: '230', 모리타니: '222', 모잠비크: '258', 몬테네그로: '382',
    몬트세라트: '1664', 몰도바: '373', 몰디브: '960', 몰타: '356', 몽골: '976',
    미국: '1', '미국령 버진아일랜드': '1340', '미국령 해외 제도': '1', 미얀마: '95',
    미크로네시아: '691', 바누아투: '678', 바레인: '973', 바베이도스: '1246',
    '바티칸 시국': '379', 바하마: '1242', 방글라데시: '880', 버뮤다: '1441',
    베냉: '229', 베네수엘라: '58', 베트남: '84', 벨기에: '32', 벨라루스: '375',
    벨리즈: '501', '보스니아 헤르체고비나': '387', 보츠와나: '267', 볼리비아: '591',
    부룬디: '257', 부르키나파소: '226', 부베섬: '47', 부탄: '975',
    북마리아나제도: '1670', 북마케도니아: '389', 북한: '850', 불가리아: '359',
    브라질: '55', 브루나이: '673', 사모아: '685', 사우디아라비아: '966',
    '사우스조지아 사우스샌드위치 제도': '500', 산마리노: '378', '상투메 프린시페': '239',
    생마르탱: '590', 생바르텔레미: '590', '생피에르 미클롱': '508', 서사하라: '212',
    세네갈: '221', 세르비아: '381', 세이셸: '248', 세인트루시아: '1758',
    세인트빈센트그레나딘: '1784', '세인트키츠 네비스': '1869', 세인트헬레나: '290',
    소말리아: '252', '솔로몬 제도': '677', 수단: '249', 수리남: '597',
    스리랑카: '94', '스발바르제도-얀마웬섬': '47', 스웨덴: '46', 스위스: '41',
    스페인: '34', 슬로바키아: '421', 슬로베니아: '386', 시리아: '963',
    시에라리온: '232', 신트마르턴: '1721', 싱가포르: '65', 아랍에미리트: '971',
    아루바: '297', 아르메니아: '374', 아르헨티나: '54', '아메리칸 사모아': '1684',
    아이슬란드: '354', 아이티: '509', 아일랜드: '353', 아제르바이잔: '994',
    아프가니스탄: '93', 안도라: '376', 알바니아: '355', 알제리: '213', 앙골라: '244',
    '앤티가 바부다': '1268', 앵귈라: '1264', 에리트리아: '291', 에스와티니: '268',
    에스토니아: '372', 에콰도르: '593', 에티오피아: '251', 엘살바도르: '503',
    영국: '44', '영국령 버진아일랜드': '1284', '영국령 인도양 지역': '246', 예멘: '967',
    오만: '968', 오스트레일리아: '61', 호주: '61', 오스트리아: '43', 온두라스: '504',
    '올란드 제도': '358', '왈리스-푸투나 제도': '681', 요르단: '962', 우간다: '256',
    우루과이: '598', 우즈베키스탄: '998', 우크라이나: '380', 이라크: '964',
    이란: '98', 이스라엘: '972', 이집트: '20', 이탈리아: '39', 인도: '91',
    인도네시아: '62', 일본: '81', 자메이카: '1876', 잠비아: '260', 저지: '44',
    '적도 기니': '240', 조지아: '995', 중국: '86', '중앙 아프리카 공화국': '236',
    지부티: '253', 지브롤터: '350', 짐바브웨: '263', 차드: '235', 체코: '420',
    칠레: '56', 카메룬: '237', 카보베르데: '238', 카자흐스탄: '7', 카타르: '974',
    캄보디아: '855', 캐나다: '1', 케냐: '254', '케이맨 제도': '1345', 코모로: '269',
    코소보: '383', 코스타리카: '506', '코코스 제도': '61', 코트디부아르: '225',
    콜롬비아: '57', '콩고-브라자빌': '242', '콩고-킨샤사': '243', 쿠바: '53',
    쿠웨이트: '965', '쿡 제도': '682', 퀴라소: '599', 크로아티아: '385',
    크리스마스섬: '61', 키르기스스탄: '996', 키리바시: '686', 키프로스: '357',
    타지키스탄: '992', 탄자니아: '255', 태국: '66', '터크스 케이커스 제도': '1649',
    토고: '228', 토켈라우: '690', 통가: '676', 투르크메니스탄: '993', 투발루: '688',
    튀니지: '216', 튀르키예: '90', 터키: '90', '트리니다드 토바고': '1868',
    파나마: '507', 파라과이: '595', 파키스탄: '92', 파푸아뉴기니: '675', 팔라우: '680',
    '팔레스타인 지구': '970', '페로 제도': '298', 페루: '51', 포르투갈: '351',
    '포클랜드 제도': '500', 폴란드: '48', 푸에르토리코: '1787', 프랑스: '33',
    '프랑스령 기아나': '594', '프랑스령 남방 지역': '262', '프랑스령 폴리네시아': '689',
    피지: '679', 핀란드: '358', 필리핀: '63', '핏케언 제도': '64',
    '허드 맥도널드 제도': '672', 헝가리: '36', '홍콩(중국 특별행정구)': '852',
  }

  function getCallingCode(nationalityName) {
    const trimmed = (nationalityName || '').trim()
    const found = COUNTRY_CALLING_CODES[trimmed]
    if (!found) {
      // 매핑에 없는 이름이면 콘솔에 정확한 텍스트를 남겨서 원인 확인 가능하게 함
      console.warn('[국가번호 매핑 없음] 실제로 API가 준 국적 이름:', JSON.stringify(nationalityName))
    }
    return found || null
  }

  const [email, setEmail] = useState('')
  const [emailChecked, setEmailChecked] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailCheckError, setEmailCheckError] = useState('')
  const [emailCheckSuccess, setEmailCheckSuccess] = useState('')
  const [nickname, setNickname] = useState('')
  // 전화번호를 "국가번호"랑 "번호"로 분리. 국가번호는 국적 선택 시 자동으로 채워지고,
  // 사용자가 원하면 직접 고쳐 쓸 수도 있음 (예: 실제 쓰는 번호가 국적이랑 다른 나라 번호일 수 있어서).
  const [phoneCode, setPhoneCode] = useState('')
  const [phoneLocal, setPhoneLocal] = useState('')
  const [isPhoneCodeManuallyEdited, setIsPhoneCodeManuallyEdited] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nationality, setNationality] = useState('') // nationality_no (문자열로 select value에 담김)
  const [selectedLanguage, setSelectedLanguage] = useState(null) // lang_no
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [agreedLocation, setAgreedLocation] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    nickname: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    nationality: '',
  })

  // 영문 + 특수문자 포함 8자 이상
  const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]).{8,}$/
  const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function validateEmail(value) {
    return EMAIL_RULE.test(value) ? '' : '이메일 형식이 맞지 않아요.'
  }

  function validateNickname(value) {
    return value.trim() ? '' : '닉네임을 입력해 주세요.'
  }

  // 국가번호/전화번호 각각 확인. 국가번호는 숫자만, 전화번호는 숫자+하이픈만 허용.
  function validatePhone(code, local) {
    if (!code) return '국가번호를 확인해 주세요.'
    if (!/^\d{1,4}$/.test(code)) return '국가번호는 숫자만 입력해 주세요.'
    if (!local) return '휴대전화번호를 입력해 주세요.'
    if (!/^\d[\d\s-]*$/.test(local)) return '휴대전화번호는 숫자만 입력해 주세요.'
    return ''
  }

  function validatePassword(value) {
    if (!value) return '8자 이상, 영문과 특수문자를 섞어 주세요.'
    return PASSWORD_RULE.test(value) ? '' : '8자 이상, 영문과 특수문자를 섞어 주세요.'
  }

  function validatePasswordConfirm(value, currentPassword) {
    if (!value) return ''
    return value === currentPassword ? '' : '두 비밀번호가 서로 달라요.'
  }

  function validateNationality(value) {
    return value ? '' : '국적을 선택해 주세요.'
  }

  const [nationalities, setNationalities] = useState([])
  const [langs, setLangs] = useState([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [optionsError, setOptionsError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadOptions() {
      setIsLoadingOptions(true)
      setOptionsError('')
      try {
        const [natRes, langRes] = await Promise.all([
          fetch('/api/nationalities', { credentials: 'include' }),
          fetch('/api/langs', { credentials: 'include' }),
        ])
        if (!natRes.ok || !langRes.ok) throw new Error('옵션 목록을 불러오지 못했어요.')
        const natData = await natRes.json()
        const langData = await langRes.json()
        if (!cancelled) {
          // 국적 이름 가나다순 정렬
          const sortedNat = [...natData].sort((a, b) =>
            a.nationality_nm.localeCompare(b.nationality_nm, 'ko')
          )
          setNationalities(sortedNat)
          setLangs(langData)
          // 기본 화면 언어는 한국어로 (없으면 목록 첫 번째로)
          const koDefault = langData.find((l) => l.lang_nm === '한국어')
          setSelectedLanguage((koDefault || langData[0])?.lang_no ?? null)
        }
      } catch (e) {
        if (!cancelled) setOptionsError('국적/언어 목록을 불러오지 못했어요. 새로고침해주세요.')
      } finally {
        if (!cancelled) setIsLoadingOptions(false)
      }
    }

    loadOptions()
    return () => {
      cancelled = true
    }
  }, [])

  // 국적을 고르면, 그 국적에 매핑된 기본 언어 이름을 힌트로 보여줌 (실제 저장값은 아래에서 사용자가 직접 고른 lang_no)
  const defaultLangHint = (() => {
    const match = nationalities.find((n) => String(n.nationality_no) === String(nationality))
    return match ? match.lang_nm : 'English'
  })()

  function handleNationalityChange(nationalityNo) {
    setNationality(nationalityNo)
    const match = nationalities.find((n) => String(n.nationality_no) === String(nationalityNo))
    if (match) {
      // 화면 언어 목록(langs) 안에 그 이름의 언어가 실제로 있으면 자동으로 선택해줌
      const matchingLang = langs.find((l) => l.lang_nm === match.lang_nm)
      if (matchingLang) setSelectedLanguage(matchingLang.lang_no)

      // 국가번호 칸을 사용자가 직접 고친 적이 없으면, 새 국적 기준으로 자동 채움.
      // 한 번이라도 직접 고쳤으면(isPhoneCodeManuallyEdited) 이후엔 국적 바꿔도 안 건드림.
      const callingCode = getCallingCode(match.nationality_nm)
      if (callingCode && !isPhoneCodeManuallyEdited) {
        setPhoneCode(callingCode)
        setFieldErrors((prev) => ({ ...prev, phone: '' }))
      }
    }
  }

  async function handleCheckDuplicate() {
    if (!email) return
    const emailError = validateEmail(email)
    setFieldErrors((prev) => ({ ...prev, email: emailError }))
    if (emailError) return

    setIsCheckingEmail(true)
    setEmailCheckError('')
    setEmailCheckSuccess('')
    try {
      const res = await fetch(
        `/api/users/check-login-id?login_id=${encodeURIComponent(email)}`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('중복확인에 실패했어요.')
      const data = await res.json()
      if (data.available) {
        setEmailChecked(true)
        setEmailCheckError('')
        setEmailCheckSuccess('사용 가능한 이메일 주소예요.')
      } else {
        // ⚠️ 이 상태(emailChecked=false + emailCheckError 있음)일 땐 가입 버튼이
        // 실제로 눌리지 않게(disabled 속성) 처리함 - isFormValid가 false가 되고,
        // 아래 버튼에 disabled={!isFormValid}가 걸려있어서 클릭 자체가 막힘.
        setEmailChecked(false)
        setEmailCheckError('이미 사용 중인 이메일이에요.')
        setEmailCheckSuccess('')
      }
    } catch (e) {
      setEmailChecked(false)
      setEmailCheckError('중복확인 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.')
      setEmailCheckSuccess('')
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const phoneError = validatePhone(phoneCode, phoneLocal)

  const isFormValid =
    emailChecked &&
    EMAIL_RULE.test(email) &&
    nickname &&
    !phoneError &&
    password &&
    passwordConfirm &&
    nationality &&
    agreedTerms &&
    agreedPrivacy &&
    agreedLocation &&
    PASSWORD_RULE.test(password) &&
    password === passwordConfirm

  function goNext() {
    setErrorMessage('')

    const nextFieldErrors = {
      email: validateEmail(email),
      nickname: validateNickname(nickname),
      phone: validatePhone(phoneCode, phoneLocal),
      password: validatePassword(password),
      passwordConfirm: validatePasswordConfirm(passwordConfirm, password),
      nationality: validateNationality(nationality),
    }
    setFieldErrors(nextFieldErrors)
    const hasFieldError = Object.values(nextFieldErrors).some(Boolean)

    if (hasFieldError || !isFormValid) {
      if (!emailChecked) setErrorMessage('이메일 중복확인이 필요해요. 이메일 입력 후 다른 곳을 탭해주세요.')
      else if (!nationality) setErrorMessage('국적을 선택해주세요.')
      else if (!agreedTerms || !agreedPrivacy || !agreedLocation) setErrorMessage('필수 약관에 동의해주세요.')
      else setErrorMessage('입력값을 확인해 주세요.')
      return
    }

    // 국가번호+전화번호를 합쳐서 저장 (백엔드/다른 화면은 예전처럼 phone 하나로 받음)
    const phone = `+${phoneCode} ${phoneLocal}`.trim()

    // 실제 회원가입(POST /signup)은 아티스트 선택 화면에서 favorite_group_nos와
    // 합쳐서 한 번에 호출함. 여기서는 입력한 값들만 공용 저장소(TripContext)에 담아두고 이동.
    updateTrip({
      account: {
        email,
        nickname,
        phone,
        password,
        passwordConfirm,
        nationality,
        selectedLanguage,
      },
    })
    navigate('/signup/artists')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <AppHeader showProfile={false} />
        <div className={styles.body}>
          <h1 className={styles.title}>가입하기</h1>

        <div className={styles['form-field']}>
          <label className={styles['field-label']}>이메일</label>
          <input
            className={`${styles.input} ${email ? styles['input-highlighted'] : ''} ${fieldErrors.email || emailCheckError ? styles.inputError : ''}`}
            type="text"
            name="signup-email-x92"
            autoComplete="off"
            placeholder="mina_tan@google.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailChecked(false)
              setEmailCheckError('')
              setEmailCheckSuccess('')
              setFieldErrors((prev) => ({ ...prev, email: '' }))
            }}
            onBlur={(e) => {
              // 다른 영역을 탭하면 자동으로 유효성 검사(빈값 -> 형식) 후 중복확인까지 이어서 실행
              if (e.target.value) {
                handleCheckDuplicate()
              }
            }}
          />
          {fieldErrors.email ? (
            <p className={styles['field-hint-warning']}>{fieldErrors.email}</p>
          ) : isCheckingEmail ? (
            <p className={styles.hint}>중복확인 중이에요...</p>
          ) : emailCheckError ? (
            <p className={styles['field-hint-warning']}>{emailCheckError}</p>
          ) : emailCheckSuccess ? (
            <p className={styles['field-hint-success']}>
              <span className={styles['success-mark']}>✓</span> {emailCheckSuccess}
            </p>
          ) : null}
        </div>

        {/* 비밀번호 / 비밀번호 확인 - 이메일 바로 다음, 세로로 하나씩 */}
        <div className={styles['form-field']}>
          <label className={styles['field-label']}>비밀번호</label>
          <input
            className={`${styles.input} ${styles['input-en']} ${fieldErrors.password ? styles.inputError : ''}`}
            type="password"
            name="signup-pw-x92"
            autoComplete="off"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(e) =>
              setFieldErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }))
            }
          />
          {fieldErrors.password && (
            <p className={styles['field-hint-warning']}>
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className={styles['form-field']}>
          <label className={styles['field-label']}>비밀번호 확인</label>
          <input
            className={`${styles.input} ${styles['input-en']} ${fieldErrors.passwordConfirm ? styles.inputError : ''}`}
            type="password"
            name="signup-pw-confirm-x92"
            autoComplete="off"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onBlur={(e) =>
              setFieldErrors((prev) => ({
                ...prev,
                passwordConfirm: validatePasswordConfirm(e.target.value, password),
              }))
            }
          />
          {fieldErrors.passwordConfirm && (
            <p className={styles['field-hint-warning']}>
              {fieldErrors.passwordConfirm}
            </p>
          )}
        </div>

        <div className={styles['form-field']}>
          <label className={styles['field-label']}>닉네임</label>
          <input
            className={`${styles.input} ${fieldErrors.nickname ? styles.inputError : ''}`}
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={(e) =>
              setFieldErrors((prev) => ({ ...prev, nickname: validateNickname(e.target.value) }))
            }
          />
          {fieldErrors.nickname && (
            <p className={styles['field-hint-warning']}>
              {fieldErrors.nickname}
            </p>
          )}
        </div>

        {/* 국적: 국가번호 자동채움을 위해 휴대전화번호보다는 먼저 선택하도록 배치 */}
        <div className={styles['two-col']}>
          <div className={styles['form-field']}>
            <label className={styles['field-label']}>국적</label>
            <select
              className={`${styles.input} ${fieldErrors.nationality ? styles.inputError : ''}`}
              value={nationality}
              onChange={(e) => {
                handleNationalityChange(e.target.value)
                setFieldErrors((prev) => ({ ...prev, nationality: '' }))
              }}
              onBlur={(e) =>
                setFieldErrors((prev) => ({
                  ...prev,
                  nationality: validateNationality(e.target.value),
                }))
              }
              disabled={isLoadingOptions}
            >
              <option value="">{isLoadingOptions ? '불러오는 중...' : '국적 선택'}</option>
              {nationalities.map((n) => (
                <option key={n.nationality_no} value={n.nationality_no}>
                  {n.nationality_nm}
                </option>
              ))}
            </select>
            {fieldErrors.nationality && (
              <p className={styles['field-hint-warning']}>
                {fieldErrors.nationality}
              </p>
            )}
          </div>
          <div className={styles['form-field']}>
            <p className={styles['default-lang-hint']}>
              국적 기준 기본 언어: <strong>{defaultLangHint}</strong>
            </p>
          </div>
        </div>

        {optionsError && <p className={styles.error}>{optionsError}</p>}

        <div className={styles['form-field']}>
          <label className={styles['field-label']}>휴대전화번호</label>
          {/* 국가번호 + 전화번호를 하나의 박스 안에서, 국가번호가 맨 앞에 오게 */}
          <div className={`${styles['phone-single-box']} ${fieldErrors.phone ? styles.inputError : ''}`}>
            <span className={styles['phone-code-plus']}>+</span>
            <input
              className={styles['phone-code-input']}
              type="text"
              inputMode="numeric"
              placeholder="82"
              value={phoneCode}
              onChange={(e) => {
                setPhoneCode(e.target.value.replace(/[^\d]/g, ''))
                setIsPhoneCodeManuallyEdited(true)
              }}
              onBlur={() =>
                setFieldErrors((prev) => ({ ...prev, phone: validatePhone(phoneCode, phoneLocal) }))
              }
            />
            <span className={styles['phone-divider']} />
            <input
              className={styles['phone-local-input']}
              type="tel"
              placeholder="10-0000-0000"
              value={phoneLocal}
              onChange={(e) => setPhoneLocal(e.target.value)}
              onBlur={() =>
                setFieldErrors((prev) => ({ ...prev, phone: validatePhone(phoneCode, phoneLocal) }))
              }
            />
          </div>
          {fieldErrors.phone && (
            <p className={styles['field-hint-warning']}>
              {fieldErrors.phone}
            </p>
          )}
        </div>

        <div className={styles['agree-block']}>
          <label className={styles['agree-row']}>
            <input
              type="checkbox"
              className={styles['agree-checkbox']}
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
            />
            <span>
              <button
                type="button"
                className={styles['agree-link']}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveModal('terms')
                }}
              >
                이용약관
              </button>
              <span className={styles['agree-text']}> 동의 (필수)</span>
            </span>
          </label>
          <label className={styles['agree-row']}>
            <input
              type="checkbox"
              className={styles['agree-checkbox']}
              checked={agreedPrivacy}
              onChange={(e) => setAgreedPrivacy(e.target.checked)}
            />
            <span>
              <button
                type="button"
                className={styles['agree-link']}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveModal('privacy')
                }}
              >
                개인정보 수집 및 활용
              </button>
              <span className={styles['agree-text']}> 동의 (필수)</span>
            </span>
          </label>
          <label className={styles['agree-row']}>
            <input
              type="checkbox"
              className={styles['agree-checkbox']}
              checked={agreedLocation}
              onChange={(e) => setAgreedLocation(e.target.checked)}
            />
            <span>
              <button
                type="button"
                className={styles['agree-link']}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveModal('location')
                }}
              >
                위치정보 수집 및 이용
              </button>
              <span className={styles['agree-text']}> 동의 (필수)</span>
            </span>
          </label>
        </div>

        {activeModal === 'terms' && (
          <AgreementModal
            title="이용약관"
            content={TERMS_TEXT}
            onClose={() => setActiveModal(null)}
            onAgree={() => {
              setAgreedTerms(true)
              setActiveModal(null)
            }}
          />
        )}
        {activeModal === 'privacy' && (
          <AgreementModal
            title="개인정보 수집 및 활용 동의"
            content={PRIVACY_TEXT}
            onClose={() => setActiveModal(null)}
            onAgree={() => {
              setAgreedPrivacy(true)
              setActiveModal(null)
            }}
          />
        )}
        {activeModal === 'location' && (
          <AgreementModal
            title="위치정보 수집 및 이용 동의"
            content={LOCATION_TEXT}
            onClose={() => setActiveModal(null)}
            onAgree={() => {
              setAgreedLocation(true)
              setActiveModal(null)
            }}
          />
        )}


        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles['footer-row']}>
          {/* 09 카피&용어 - "다음 단계로 이동"은 콜론(:)+다음 화면명으로 표기.
              06 버튼 규칙 - 비활성 상태는 .disabled(#D9D4F5)만으로 구분, opacity 이중 적용 금지 */}
          <button
            className={`${styles['btn-primary']} ${!isFormValid ? styles.disabled : ''}`}
            onClick={goNext}
            disabled={!isFormValid}
          >
            다음: 아티스트 선택
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
