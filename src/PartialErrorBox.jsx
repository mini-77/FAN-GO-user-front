import styles from './PartialErrorBox.module.css'

/**
 * 부분 영역 에러 (11_impact_plan.md 13번 섹션, 09_v1_v2_master.md V1-P37-005/006·V1-P38-001~004).
 * 화면 전체가 아니라 한 구역(예: 이동 시간 조회)만 실패했을 때, 화면 전체를 에러로
 * 덮지 않고 그 구역 안에서만 실패를 보여주는 용도. 화면 진입 자체가 불가능한 경우는
 * 이 컴포넌트 대상이 아니고(그건 전체 화면 에러), 화면은 정상인데 일부 데이터만
 * 실패했을 때만 씀.
 *
 * 아직 어떤 화면에도 연결하지 않았음 - 실제로 구역 단위로 실패할 수 있는 지점(예:
 * 이동 시간 조회 API)이 어디인지, 재시도 시 무엇을 다시 호출해야 하는지는 화면별로
 * 확인이 필요해서(11_impact_plan.md "백엔드 확인 필요" 참고) 재사용 가능한 틀만
 * 먼저 만들어둠.
 *
 * 사용 예: <PartialErrorBox message="이동 시간을 불러오지 못했어요" onRetry={refetch} />
 */
export default function PartialErrorBox({ message, onRetry }) {
  return (
    <div className={styles.box}>
      <p className={styles.message}>{message}</p>
      <button type="button" className={styles['retry-btn']} onClick={onRetry}>
        다시 시도
      </button>
    </div>
  )
}
