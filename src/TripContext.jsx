import { createContext, useContext, useEffect, useState } from 'react'

const TripContext = createContext(null)

const STORAGE_KEY = 'fango_trip_data'

const initialTripData = {
  account: null, // { email, nickname, phone, password, passwordConfirm, nationality, selectedLanguage }
  selectedArtists: [], // artist_group_no 배열 (회원가입 때 고른 즐겨찾기 그룹)
  selectedEvent: null, // { event_no, event_date, title, address, artist_group_no } - 이벤트 선택 화면에서 하나만 고름
  tripDates: { startDate: '2026-09-13', endDate: '2026-09-15', startTime: '09:00', endTime: '21:00' },
  stays: [], // 예전엔 예시 숙소 2개가 하드코딩돼 있었는데, 이벤트 날짜와 안 맞아 에러 나서 삭제함.
             // 사용자가 숙소검색 화면에서 직접 추가해야 함.

  // 출발지(첫날)/완료지(마지막날) - 딱 이 2개만 사용자가 정함. 중간 날짜는 화면에서 따로
  // 안 물어보고 시스템이 알아서 숙소 기준으로 처리함 (날짜별 입력 화면은 따로 없음).
  // 값 형태: { type: 'airport'|'stay'|'custom', name, address, lat, lon } | null
  // - departure(첫날 출발지)는 프리셋 없이 사용자가 지도에서 직접 검색해서 정확한 위치를 찍어야 함.
  // - arrival(마지막날 완료지)은 등록된 숙소가 있으면 자동으로 채워주고, 필요하면 수정 가능.
  departure: null,
  arrival: null,
  // 중간 날짜들의 출발/도착도 동선 추천에 똑같이 중요해서, 숙소 기준 자동값을 사용자가
  // 언제든 지도로 덮어쓸 수 있게 여기에 저장함. { [날짜]: { departure: {...}|null, arrival: {...}|null } }
  // 숙소 자동값은 "기본값"일 뿐이고, 여기 값이 있으면 이게 우선함.
  dayLocationOverrides: {},

  rankedCategoryIds: [], // 선호 카테고리 순위 배열 (0번째 = 1순위), { id: ctg_no, name: ctg_nm }
  paceMembers: [], // artist_no 배열 (POST /trips의 artist_nos로 그대로 들어감)
  paceMemberNames: [], // 화면 표시용 이름 배열
  allEventMemberIds: [], // 특정 멤버 선택 안 했을 때 fallback용 (해당 이벤트 그룹 멤버 전체)
  isWholeGroupSelected: false, // PaceView에서 "그룹 전체 선택"을 골랐는지
  paceArtistGroupNo: null, // 그룹 전체 선택 시 POST /trips의 artist_group_no로 보낼 값
  selectedPace: null, // 'A' | 'B' | 'C' - ConfirmView("이대로 진행할까요?")에서 확정
  tripNo: null, // POST /trips 성공 후 받은 여행 번호 (POST /trip-routes 등에서 씀)
  routesSaved: false, // POST /trip-routes로 동선을 한 번이라도 저장했는지 - true면 이후엔 PUT으로 재수정
}

// 즐겨찾기 그룹이 바뀌었을 때 초기화해야 할 필드들 - "이벤트 하나 = 그룹 하나" 기준으로
// 동선을 짜는 서비스라서, 그룹이 바뀌면 이전에 고른 이벤트(다른 그룹 콘서트)를 기준으로
// 진행 중이던 여행 계획 전체가 더 이상 유효하지 않음. account/selectedArtists는 그대로 둠.
const TRIP_PLANNING_RESET_FIELDS = {
  selectedEvent: null,
  stays: [],
  departure: null,
  arrival: null,
  dayLocationOverrides: {},
  rankedCategoryIds: [],
  paceMembers: [],
  paceMemberNames: [],
  allEventMemberIds: [],
  isWholeGroupSelected: false,
  paceArtistGroupNo: null,
  selectedPace: null,
  tripNo: null,
  routesSaved: false,
  generatedDays: undefined,
  generatedSummary: undefined,
  generatedWarning: undefined,
}

// 브라우저에 저장된 값이 있으면 그걸로 시작, 없거나 깨져있으면 기본값으로 시작
function loadInitialTripData() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return initialTripData
    const parsed = JSON.parse(saved)
    // 새로 추가된 필드가 나중에 생겨도 기본값이랑 합쳐서 안전하게 채워줌
    const merged = { ...initialTripData, ...parsed }

    // 예전 버전(dailyPlans 배열 방식)으로 저장된 데이터가 브라우저에 남아있을 수 있어서 정리.
    // departure/arrival이 옛날처럼 문자열이면 무시하고 null로 되돌림 (다시 입력받으면 됨).
    if (typeof merged.departure === 'string') merged.departure = null
    if (typeof merged.arrival === 'string') merged.arrival = null
    delete merged.dailyPlans

    return merged
  } catch (e) {
    return initialTripData
  }
}

export function TripProvider({ children }) {
  const [tripData, setTripData] = useState(loadInitialTripData)

  // tripData가 바뀔 때마다 브라우저에 자동 저장 (새로고침해도 유지됨)
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tripData))
    } catch (e) {
      // 저장 용량 초과 등 - 조용히 무시 (앱 동작에는 지장 없음)
    }
  }, [tripData])

  // partial을 기존 tripData에 얕게 merge. 배열/객체를 통째로 교체할 때 사용.
  function updateTrip(partial) {
    setTripData((prev) => ({ ...prev, ...partial }))
  }

  // 로그아웃/회원가입 새로 시작할 때 등, 완전히 초기화하고 싶을 때 사용
  function resetTrip() {
    setTripData(initialTripData)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      // 무시
    }
  }

  // 마이페이지에서 즐겨찾기 그룹을 바꿨을 때 사용 - 계정 정보(account, selectedArtists)는
  // 그대로 두고, 이전 그룹 기준으로 진행 중이던 여행 계획 관련 상태만 지움.
  // 이렇게 안 하면 그룹을 바꿔도 예전에 고른 이벤트(예: NCT 콘서트)가 tripData에 남아있어서,
  // PaceView 등에서 새로 바꾼 그룹(예: 블랙핑크) 대신 예전 그룹 멤버가 계속 뜨는 문제가 생김.
  function resetTripPlanning() {
    setTripData((prev) => ({ ...prev, ...TRIP_PLANNING_RESET_FIELDS }))
  }

  return (
    <TripContext.Provider value={{ tripData, updateTrip, resetTrip, resetTripPlanning }}>
      {children}
    </TripContext.Provider>
  )
}

// 각 화면에서는 이 훅 하나로 저장소를 읽고 쓸 수 있음:
// const { tripData, updateTrip } = useTrip()
export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) {
    throw new Error('useTrip은 <TripProvider> 안에서만 쓸 수 있어요. App.jsx 확인해주세요.')
  }
  return ctx
}
