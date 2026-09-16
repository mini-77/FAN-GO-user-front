// 회원가입 화면의 약관 동의 팝업에 그대로 띄울 전문 텍스트.
// 실제 서비스 오픈 전에 [회사명]/[대표자]/[주소] 등 대괄호 표시된 부분은 채워 넣어야 함.
// 7개 지원 언어(ko/en/ja/zh-CN/zh-TW/th/id) 전문 번역을 담고 있음. 번역이 아직 없는 언어는
// 한국어 원문으로 폴백함 (getTermsText 등 helper 참고).

const TERMS_KO = `제1장 총칙

제1조 (목적)
본 약관은 이용자가 [회사명](이하 '회사')이 제공하는 "FAN:GO" 서비스(앱 및 웹, 이하 "서비스")의 이용과 관련하여 이용자와 회사 간의 권리, 의무 및 책임사항, 이용조건 및 절차 등 필요한 사항을 규정함을 목적으로 합니다.

제2조 (약관의 효력 및 변경)
1. 본 약관은 회사가 서비스 화면 또는 관련 웹사이트에 게시하고, 이에 동의한 이용자가 서비스에 가입함으로써 효력이 발생합니다.
2. 회사는 관계 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를 명시하여 적용일 7일 전부터 제19조의 방법으로 공지합니다. 다만 이용자에게 불리하거나 중대한 변경의 경우 적용일 30일 전부터 공지합니다.
3. 회사가 전항에 따라 변경 약관을 공지하면서 "적용일까지 거부의사를 표시하지 않으면 동의한 것으로 본다"는 뜻을 함께 고지하였음에도 이용자가 명시적으로 거부의사를 표시하지 않으면 변경에 동의한 것으로 봅니다.
4. 변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.

제3조 (약관 외 준칙)
본 약관에 명시되지 않은 사항은 「개인정보보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「위치정보의 보호 및 이용 등에 관한 법률」, 「콘텐츠산업진흥법」, 「저작권법」 등 관계 법령 및 회사가 정한 세부 이용지침에 따릅니다.

제4조 (용어의 정의)
본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
1. "서비스"란 회사가 제공하는, 이용자의 관심 아티스트·팬덤 정보를 바탕으로 관련 장소(POI)와 여행 동선을 추천하고 관련 정보를 제공하는 FAN:GO 앱 및 웹 서비스를 말합니다.
2. "이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.
3. "회원"이란 본 약관에 동의하고 회사가 요청하는 정보를 등록하여 가입을 승인받아 서비스를 이용하는 자를 말합니다.
4. "동선(추천 결과)"이란 회사의 추천 엔진이 이용자의 입력 정보와 장소 데이터를 바탕으로 생성하여 제공하는 여행 일정·경로 및 장소 추천 결과를 말합니다.
5. "장소(POI)"란 서비스가 추천·안내하는 성지, 카페, 공연장, 굿즈샵, 팝업스토어 등 지점 정보를 말합니다.
6. "게시물"이란 이용자가 서비스 내에 등록하는 피드백, 장소 오류신고(폐업·이전 등) 등 일체의 정보를 말합니다.
7. "제휴처"란 회사와 제휴계약을 체결하여 서비스에 관련 정보를 제공하거나 서비스를 통해 사업을 영위하는 사업자를 말합니다.


제2장 이용계약

제5조 (이용계약의 성립)
1. 이용자가 앱 또는 웹에서 본 약관에 "동의함"을 선택하고 회원가입을 신청하면, 회사가 이를 승낙함으로써 이용계약이 성립합니다.
2. 서비스는 전부 무료로 제공됩니다.

제6조 (이용신청 및 회원가입)
1. 이용신청은 이용자가 회사가 정한 가입 절차에 따라 필수 정보를 입력하고 본 약관 및 개인정보 수집·이용에 동의하는 방식으로 이루어집니다.
2. 회사가 회원가입 시 수집하는 항목은 서비스 제공(추천)에 필요한 최소 범위로 하며, 이메일·닉네임·국적·언어·팬덤·최애(관심 멤버) 등이 포함됩니다. 구체적 수집·이용·보관은 회사의 개인정보처리방침에 따릅니다.
3. 회원가입은 만 14세 이상인 자만 할 수 있으며, 회사는 만 14세 미만 아동의 회원가입을 제한합니다.

제7조 (이용신청의 승낙)
1. 회사는 제6조에 따른 유효한 이용신청을 승낙합니다.
2. 회사는 회원가입 완료 시점부터 서비스를 제공합니다.

제8조 (이용신청 승낙의 제한)
회사는 다음 각 호에 해당하는 신청에 대해서는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
1. 타인의 정보를 도용하거나 등록 내용에 허위 기재가 있는 경우
2. 회사의 업무상·기술상 사정으로 서비스 제공이 불가능한 경우
3. 회사가 정한 가입 절차·동의를 완료하지 않은 경우
4. 제18조의 이용자 의무를 위반하여 이용자격을 상실한 사실이 있는 경우
5. 기타 위법·부당한 신청이거나 이용자의 귀책사유로 회사가 승낙할 수 없는 경우


제3장 서비스 이용

제9조 (서비스의 내용)
회사는 이용자에게 다음 각 호의 서비스를 제공합니다.
1. 관심 아티스트·팬덤 기반 여행 동선(일정·경로) 자동 추천 서비스
2. 관련 장소(POI) 추천 및 장소 상세정보 제공 서비스
3. 공연·생일카페·팝업·굿즈 등 이벤트 정보 제공 서비스
4. 다국어 안내 서비스
5. 이용자 피드백 및 장소 오류신고 접수 서비스
6. 기타 회사가 서비스의 목적에 부합한다고 판단하여 제공하는 부가 서비스

제10조 (서비스의 이용 개시)
1. 회사는 이용자의 회원가입 완료 시부터 서비스 제공을 개시합니다.
2. 업무상·기술상 장애로 제공을 개시하지 못하는 경우 회사는 그 사유를 서비스 화면 등에 공지하거나 이용자에게 통지합니다.

제11조 (서비스의 이용시간)
1. 서비스 이용은 연중무휴 1일 24시간을 원칙으로 합니다.
2. 다만 시스템 점검, 통신망 장애, 외부 데이터·API 장애 등의 사유로 서비스가 일시 중지될 수 있으며, 회사는 원칙적으로 사전 공지하되 급박하거나 불가피한 경우 사후에 즉시 공지합니다.

제12조 (서비스의 변경 및 중지)
1. 회사는 서비스의 내용을 변경하여 제공할 수 있으며, 변경 시 그 내용과 제공일자를 제19조의 방법으로 공지합니다.
2. 회사는 다음 각 호의 경우 서비스의 전부 또는 일부를 제한·중지할 수 있습니다.
   (1) 설비 보수·점검 등 부득이한 경우
   (2) 정전, 설비 장애, 이용 폭주 등으로 정상 제공이 어려운 경우
   (3) 제휴처·외부 데이터 제공처와의 계약 종료 등 회사의 제반 사정
   (4) 천재지변, 국가비상사태 등 불가항력
3. 회사는 고의 또는 과실이 없는 한 본 조에 따른 변경·중지로 발생한 문제에 대하여 책임을 부담하지 않습니다.

제13조 (추천 결과의 성격과 한계)
1. 서비스가 제공하는 동선 및 장소 추천 결과는 이용자의 편의를 위한 참고 정보이며, 회사는 추천 결과의 정확성·적합성·특정 목적에의 부합을 보장하지 않습니다.
2. 추천 결과는 AI 알고리즘 및 외부 데이터를 기반으로 자동 생성되므로 실제 현장 상황과 다를 수 있습니다. 이용자는 방문 전 영업 여부·운영시간·입장 조건 등을 직접 확인하여야 합니다.
3. 이용자가 추천 결과를 신뢰하여 발생한 이동·비용·시간 손실 등에 대하여, 회사의 고의 또는 중대한 과실이 없는 한 회사는 책임을 부담하지 않습니다.

제14조 (장소 정보의 정확성 및 제3자 데이터)
1. 서비스는 공공 데이터 및 제3자 API(예: 지도·관광·공공 실시간 데이터 등)를 활용하여 장소·이벤트 정보를 제공하며, 해당 정보의 원 저작권 및 권리는 각 제공처에 있습니다.
2. 제3자가 제공하는 데이터의 정확성·최신성·연속성은 회사가 보증하지 않으며, 제3자 데이터의 오류·지연·중단으로 인한 손해에 대하여 회사는 고의 또는 과실이 없는 한 책임을 부담하지 않습니다.
3. 장소의 폐업·이전 등으로 정보가 부정확한 경우 이용자는 서비스 내 오류신고 기능을 통해 이를 회사에 알릴 수 있으며, 회사는 확인 절차를 거쳐 반영합니다.

제15조 (게시물·피드백·오류신고)
1. 이용자가 등록한 피드백·오류신고 등 게시물의 책임은 해당 이용자에게 있습니다.
2. 회사는 게시물이 다음 각 호에 해당한다고 판단되면 사전 통지 없이 게시 중단·삭제할 수 있습니다.
   (1) 타인의 명예를 훼손하거나 권리를 침해하는 경우
   (2) 공공질서·미풍양속에 반하거나 범죄와 결부되는 경우
   (3) 허위·광고성·기타 관계 법령이나 본 약관에 위반되는 경우
3. 회사는 서비스 개선 및 운영을 위하여 이용자의 피드백·오류신고를 활용할 수 있으며, 개인을 식별할 수 없는 형태의 통계로 보존할 수 있습니다.

제16조 (정보의 제공 및 광고의 게재)
1. 회사는 서비스 운영 관련 공지사항을 서비스 화면·웹사이트에 게재하거나 이메일·푸시 등으로 통지할 수 있습니다.
2. 회사는 이용자의 사전 동의를 얻은 경우에 한하여 이메일·문자·푸시 등으로 광고성 정보를 전송할 수 있으며, 이용자는 언제든지 수신을 거부할 수 있습니다.


제4장 계약당사자의 의무

제17조 (회사의 의무)
1. 회사는 관계 법령에 따라 이용자의 개인정보를 보호하며, 이용자의 동의 없이 제3자에게 제공·누설하지 않습니다. 단, 법령에 따라 권한 있는 기관이 적법한 절차로 요청하는 경우는 예외로 합니다.
2. 회사는 서비스 관련 이용자의 불만·문의를 신속히 처리하며, 즉시 처리가 어려운 경우 그 사유와 일정을 통지합니다.
3. 회사의 고의 또는 과실로 이용자에게 손해가 발생한 경우 회사가 책임을 부담하며, 그 범위는 통상손해에 한합니다.

제18조 (이용자의 의무)
1. 이용자는 다음 각 호의 행위를 하여서는 안 됩니다.
   (1) 이용신청·변경 시 허위 정보 기재 또는 타인 정보의 부정 사용
   (2) 회사·제3자의 저작권 등 지적재산권 침해
   (3) 서비스를 통해 얻은 정보를 회사의 사전 동의 없이 복제·유통·상업적으로 이용하는 행위
   (4) 서비스 운영을 고의로 방해하거나 시스템에 부하를 유발하는 행위(비정상적 크롤링·자동화 접근 포함)
   (5) 타인의 명예 훼손, 개인정보 무단 수집, 음란·불법 정보 게시 등
   (6) 기타 관계 법령 및 본 약관에 위반되는 행위
2. 서비스에 관한 저작권 및 지적재산권 등 모든 권리는 회사에 귀속되며, 이용자는 회사로부터 이용권을 부여받은 것으로서 이를 양도·판매·담보 제공할 수 없습니다.
3. 이용자가 본 조를 위반한 경우 회사는 이용제한, 이용계약 해지, 손해배상 청구 등의 조치를 취할 수 있습니다.

제19조 (이용자에 대한 통지)
1. 회사는 이용자에게 통지할 경우 서비스 화면·웹사이트 공지 또는 이용자가 등록한 이메일·푸시 등의 방법으로 할 수 있습니다.
2. 불특정 다수에 대한 통지는 서비스 화면 또는 웹사이트에 7일 이상 게시함으로써 개별 통지를 갈음할 수 있습니다.

제20조 (개인정보의 보호)
1. 회사는 관계 법령에 따라 이용자의 개인정보를 보호하며, 구체적 사항은 회사가 별도로 게시하는 개인정보처리방침에 따릅니다. 개인정보처리방침은 본 약관의 일부를 구성합니다.
2. 회사는 회원의 삭제(탈퇴) 요청을 접수일로부터 30일 이내에 처리합니다. 회사는 데이터 복구 및 이용자의 변심 등에 대비하여 삭제 요청 후 90일간의 보관 유예 기간을 두며, 유예 기간이 경과하면 이용자의 프로필 및 저장된 동선 정보를 완전히 삭제합니다. 다만 이용자가 등록한 피드백은 개인을 식별할 수 없는 익명 통계 형태로만 보존할 수 있습니다.


제5장 계약해지 및 이용제한

제21조 (계약해지 및 이용제한)
1. 이용자는 언제든지 서비스 내 탈퇴 절차를 통해 이용계약을 해지할 수 있습니다.
2. 회사는 이용자가 제18조의 의무를 위반한 경우 사전 통지 후(긴급한 경우 사후 통지) 이용을 제한하거나 이용계약을 해지할 수 있습니다.
3. 이용자는 본 조의 회사 조치에 대해 회사가 정한 절차에 따라 이의를 제기할 수 있으며, 회사가 이의를 정당하다고 인정하면 즉시 이용을 재개합니다.

제22조 (양도금지)
이용자는 서비스 이용권한 등 이용계약상 지위를 타인에게 양도·증여하거나 담보로 제공할 수 없습니다.


제6장 손해배상 등

제23조 (손해배상)
1. 본 약관을 위반하여 회사에 손해를 발생시킨 이용자는 그 손해를 배상하여야 합니다.
2. 이용자가 서비스 이용과 관련하여 제3자로부터 손해배상 청구 등 이의를 받게 하여 회사에 손해가 발생한 경우, 해당 이용자는 자신의 책임과 비용으로 회사를 면책시켜야 합니다.

제24조 (면책사항)
1. 회사는 천재지변, 불가항력, 또는 회사의 귀책사유가 아닌 사유로 발생한 서비스 이용장애에 대하여 책임을 부담하지 않습니다.
2. 회사는 제13조·제14조에 따라 추천 결과 및 제3자 데이터의 정확성·완전성을 보증하지 않으며, 이를 신뢰하여 발생한 손해에 대하여 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.
3. 회사는 이용자 상호 간 또는 이용자와 제3자(제휴처·장소 운영자 등) 간에 발생한 분쟁에 개입할 의무가 없으며, 이에 따른 손해를 배상할 책임을 부담하지 않습니다.

제25조 (준거법 및 관할)
1. 본 약관 및 서비스 이용과 관련한 분쟁에는 대한민국 법을 준거법으로 합니다.
2. 회사와 이용자 간 분쟁에 관한 소송은 「민사소송법」에 따른 관할 법원에 제기합니다.
3. 본 약관이 복수 언어로 제공되는 경우, 해석상 차이가 있을 때에는 한국어본을 기준으로 합니다.


부칙
본 약관은 [YYYY.MM.DD]부터 시행합니다.`

const LOCATION_KO = `※ 아래는 위치기반서비스 이용약관 중 제10조~제18조입니다.

제10조 (개인위치정보주체의 권리)
1. 이용자는 회사에 대하여 언제든지 개인위치정보를 이용한 위치기반서비스 제공 및 개인위치정보의 제3자 제공에 대한 동의의 전부 또는 일부를 철회할 수 있습니다. 이 경우 회사는 수집한 개인위치정보 및 위치정보 이용·제공사실 확인자료를 지체 없이 파기합니다.
2. 이용자는 회사에 대하여 언제든지 개인위치정보의 수집·이용 또는 제공의 일시적인 중지를 요구할 수 있으며, 회사는 이를 거절할 수 없으며 이를 위한 기술적 수단을 갖추고 있습니다.
3. 이용자는 회사에 대하여 아래 각 호의 자료에 대한 열람 또는 고지를 요구할 수 있고, 당해 자료에 오류가 있는 경우에는 그 정정을 요구할 수 있습니다. 이 경우 회사는 정당한 사유 없이 이용자의 요구를 거절할 수 없습니다.
   1) 본인에 대한 위치정보 수집·이용·제공사실 확인자료
   2) 본인의 개인위치정보가 「위치정보의 보호 및 이용 등에 관한 법률」 또는 다른 법률의 규정에 의하여 제3자에게 제공된 이유 및 내용
4. 이용자는 제1항 내지 제3항의 권리를 행사하기 위하여 서비스 내 설정 메뉴, 고객센터(대표전화), 전자우편 등 회사가 안내하는 절차를 통해 요구할 수 있으며, 회사는 지체 없이 관련 조치를 취합니다.

제11조 (법정대리인의 권리)
1. 회사는 14세 미만의 이용자에 대해서는 개인위치정보를 이용한 위치기반서비스 제공 및 개인위치정보의 제3자 제공에 대한 동의를 당해 이용자와 당해 이용자의 법정대리인으로부터 받아야 합니다. 이 경우 회사는 관계 법령이 정하는 방법에 따라 법정대리인의 동의 여부를 확인하며, 법정대리인은 제10조에 의한 이용자의 권리를 모두 가집니다.
2. 회사는 14세 미만 아동의 개인위치정보 또는 위치정보 이용·제공사실 확인자료를 이용약관에 명시 또는 고지한 범위를 넘어 이용하거나 제3자에게 제공하고자 하는 경우에는 14세 미만 아동과 그 법정대리인의 동의를 받아야 합니다. 단, 아래의 경우는 제외합니다.
   1) 위치정보 및 위치기반서비스 제공에 따른 위치정보 이용·제공사실 확인자료가 필요한 경우
   2) 통계작성, 학술연구 또는 시장조사를 위하여 특정 개인을 알아볼 수 없는 형태로 가공하여 제공하는 경우

제12조 (8세 이하의 아동 등의 보호의무자의 권리)
1. 회사는 아래 각 호에 해당하는 자(이하 "8세 이하의 아동 등")의 보호의무자가 8세 이하의 아동 등의 생명 또는 신체보호를 위하여 개인위치정보의 이용 또는 제공에 동의하는 경우에는 본인의 동의가 있는 것으로 봅니다.
   1) 8세 이하의 아동
   2) 피성년후견인
   3) 장애인복지법 제2조 제2항 제2호의 규정에 따른 정신적 장애를 가진 자로서 장애인 고용촉진 및 직업재활법 제2조 제2호의 규정에 따라 중증장애인에 해당하는 자(장애인복지법 제32조의 규정에 따라 장애인 등록을 한 자에 한합니다)
2. 전항의 규정에 따른 8세 이하 아동 등의 보호의무자는 해당 아동을 사실상 보호하는 자로서 다음 각 호에 해당하는 자를 말합니다.
   1) 8세 이하의 아동의 법정대리인 또는 「보호시설에 있는 미성년자의 후견 직무에 관한 법률」 제3조의 규정에 따른 후견인
   2) 피성년후견인의 법정대리인
   3) 본 조 제1항 제3호의 자의 법정대리인 또는 장애인복지법 제58조 제1항 제1호의 규정에 따른 장애인 생활시설(국가 또는 지방자치단체가 설치·운영하는 시설에 한합니다)의 장, 정신보건법 제3조 제4호의 규정에 따른 정신질환자 사회복귀시설(국가 또는 지방자치단체가 설치·운영하는 시설에 한합니다)의 장, 동법 동조 제5호의 규정에 따른 정신요양시설의 장
3. 8세 이하의 아동 등의 생명 또는 신체의 보호를 위하여 개인위치정보의 이용 또는 제공에 동의하고자 하는 보호의무자는 서면동의서에 보호의무자임을 증명하는 서면을 첨부하여 회사에 제출하여야 합니다.
4. 보호의무자는 8세 이하의 아동 등의 개인위치정보 이용 또는 제공에 동의하는 경우 개인위치정보주체 권리의 전부를 행사할 수 있습니다.

제13조 (회사의 상호, 주소 및 연락처 등)
1. 회사의 상호, 대표자, 주소 및 연락처는 아래와 같습니다.
   상호: [운영주체 상호 또는 팀명]
   대표: [대표자 성명]
   주소: [주소]
   대표전화: [대표전화]
2. 회사는 개인위치정보를 적절히 관리·보호하고, 개인위치정보주체의 불만을 원활히 처리할 수 있도록 실질적인 책임을 질 수 있는 지위에 있는 자를 위치정보관리책임자로 지정하여 운영하고 있으며, 위치정보관리책임자의 성명과 연락처는 아래와 같습니다.
   성명: [위치정보관리책임자 성명]
   대표전화: [대표전화]
   이메일주소: [위치정보관리책임자 이메일]

제14조 (회사의 의무)
1. 회사는 위치정보법, 개인정보보호법 등 관련 법령을 준수하여 이용자의 개인위치정보를 안전하게 관리합니다.
2. 회사는 이용약관에 개인위치정보의 이용 목적·보유 및 이용기간·제3자 제공 현황 등 위치정보법이 정하는 사항을 명시하여 게시합니다.
3. 회사는 위치정보의 수집·이용·제공과 관련하여 이용자의 불만 처리 및 상담을 위한 창구를 운영합니다.

제15조 (양도금지)
이용자의 서비스를 받을 권리는 이를 양도 내지 증여하거나 담보제공 등의 목적으로 처분할 수 없습니다.

제16조 (손해배상)
1. 회사가 위치정보법 제15조 내지 제26조의 규정을 위반한 행위로 이용자에게 손해가 발생한 경우 이용자는 회사에 대하여 손해배상을 청구할 수 있습니다. 이 경우 회사는 고의 또는 과실이 없음을 입증하지 못하는 경우 책임을 면할 수 없습니다.
2. 이용자가 본 약관의 규정을 위반하여 회사에 손해가 발생한 경우 회사는 이용자에 대하여 손해배상을 청구할 수 있습니다. 이 경우 이용자는 고의 또는 과실이 없음을 입증하지 못하는 경우 책임을 면할 수 없습니다.

제17조 (면책)
1. 회사는 다음 각 호의 경우로 서비스를 제공할 수 없는 경우 이로 인하여 이용자에게 발생한 손해에 대하여 책임을 부담하지 않습니다.
   1) 천재지변 또는 이에 준하는 불가항력의 상태가 있는 경우
   2) 서비스 제공을 위하여 회사와 서비스 제휴계약을 체결한 제3자의 고의적인 서비스 방해가 있는 경우
   3) 이용자의 귀책사유로 서비스 이용에 장애가 있는 경우
   4) 제1호 내지 제3호를 제외한 기타 회사의 고의·과실이 없는 사유로 인한 경우
2. 회사는 서비스 및 서비스에 게재된 정보, 자료, 사실의 신뢰도, 정확성 등에 대해서는 보증하지 않으며, 이로 인해 발생한 이용자의 손해에 대하여는 책임을 부담하지 아니합니다.

제18조 (분쟁의 조정 및 기타)
1. 서비스 이용과 관련하여 회사와 이용자 간에 분쟁이 발생하면, 회사는 분쟁의 해결을 위해 이용자와 성실히 협의합니다.
2. 전항의 협의에서 분쟁이 해결되지 않은 경우 회사와 이용자는 위치정보법 제28조에 따라 방송통신위원회에 재정을 신청하거나, 개인정보보호법 제43조에 따라 방송통신위원회 또는 개인정보분쟁조정위원회에 재정 또는 분쟁조정을 신청할 수 있습니다.
3. 전항으로도 분쟁이 해결되지 않으면 회사와 이용자 양 당사자는 민사소송법상의 관할법원에 소를 제기할 수 있습니다.`

const PRIVACY_KO = `[필수] 개인정보 수집·이용 동의 (FAN:GO)

1. 수집하는 개인정보의 항목

① 회원가입 시 수집하는 항목 (필수)
- 이메일(ID), 비밀번호, 닉네임, 국적, 언어, 팬덤, 최애(관심 멤버)
- [검토] 소셜 로그인 도입 시: 해당 제공자로부터 전달받는 회원 식별자(예: 계정 고유 ID 등) 추가 여부 확인 필요

② 서비스 이용 과정에서 생성·수집되는 항목
- 이용자가 생성·저장한 추천 동선 및 이용 이력
- 이용자가 등록한 피드백·장소 오류신고 내용

③ 자동으로 수집되는 항목 (앱·웹 공통) [검토]
- 서비스 이용기록, 접속 로그, 쿠키, 접속 IP, 기기정보
- (앱 푸시 이용 시) 푸시 알림 토큰
- ※ 위 항목의 실제 수집 여부와 범위는 구현 확정 후 반영해야 합니다.


2. 개인정보 수집·이용 목적

- 회원 식별 및 가입 의사 확인
- 관심 아티스트·팬덤 정보를 바탕으로 한 장소·동선 추천(매칭) 서비스 제공
- 이용자 피드백·오류신고 처리 및 서비스 품질 개선
- 공지사항 전달, 문의 응대 등 서비스 운영에 관한 소통


3. 개인정보 보유 및 이용 기간

- 수집·이용 목적이 달성되거나 회원이 탈퇴할 때까지 보유·이용합니다.
- 회원 탈퇴(삭제) 요청 시: 요청 접수일로부터 30일 이내에 처리하며, 데이터 복구·변심 등에 대비한 90일 보관 유예 기간 경과 후 프로필 및 저장된 동선 정보를 완전히 삭제합니다. 다만 피드백은 개인을 식별할 수 없는 익명 통계 형태로만 보존할 수 있습니다.
- 위 기준에도 불구하고 관계 법령에서 별도의 보존 의무를 정한 경우에는 해당 기간 동안 보존합니다.


※ 귀하는 위 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 다만 필수 항목에 대한 동의를 거부하는 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.`

const TERMS_EN = `Chapter 1. General Provisions

Article 1 (Purpose)
These Terms set out the rights, obligations, and responsibilities between [Company Name] ("Company") and users in connection with the use of the "FAN:GO" service (app and web, "Service"), as well as the conditions and procedures for using the Service.

Article 2 (Effect and Amendment of Terms)
1. These Terms take effect when the Company posts them on the Service screen or its website and a user who agrees to them signs up for the Service.
2. The Company may amend these Terms within the scope permitted by applicable law. When amended, the Company will announce the effective date and reason for the change in accordance with Article 19, at least 7 days before the effective date. However, if the amendment is unfavorable or material to users, the Company will announce it at least 30 days in advance.
3. If the Company announces an amendment together with a notice that "failure to express refusal by the effective date will be deemed consent," and the user does not explicitly refuse, the user is deemed to have agreed to the amendment.
4. A user who does not agree to the amended Terms may stop using the Service and terminate the service agreement.

Article 3 (Rules Other Than These Terms)
Matters not specified in these Terms are governed by the Personal Information Protection Act, the Act on Promotion of Information and Communications Network Utilization and Information Protection, the Act on the Protection and Use of Location Information, the Content Industry Promotion Act, the Copyright Act, and other relevant laws, as well as detailed usage guidelines set by the Company.

Article 4 (Definitions)
The terms used in these Terms are defined as follows.
1. "Service" means the FAN:GO app and web service provided by the Company, which recommends related places (POIs) and travel itineraries and provides related information based on a user's interested artists and fandom information.
2. "User" means a person who uses the Service under these Terms.
3. "Member" means a person who has agreed to these Terms, registered the information requested by the Company, been approved for membership, and uses the Service.
4. "Itinerary (recommendation result)" means the travel schedule, route, and place recommendation results generated and provided by the Company's recommendation engine based on the user's input information and place data.
5. "Place (POI)" means location information such as pilgrimage sites, cafes, concert venues, goods shops, and pop-up stores recommended or guided by the Service.
6. "Post" means all information registered by a user within the Service, including feedback and place error reports (closure, relocation, etc.).
7. "Partner" means a business operator that has entered into a partnership agreement with the Company to provide related information to the Service or conduct business through the Service.


Chapter 2. Service Agreement

Article 5 (Formation of the Service Agreement)
1. The service agreement is formed when a user selects "I agree" to these Terms in the app or web and applies for membership, and the Company accepts the application.
2. The Service is provided entirely free of charge.

Article 6 (Application for Use and Membership Registration)
1. An application for use is made by the user entering the required information according to the registration procedure set by the Company and agreeing to these Terms and the collection and use of personal information.
2. The items the Company collects upon membership registration are limited to the minimum necessary to provide the Service (recommendations), including email, nickname, nationality, language, fandom, and favorite (member of interest). Specific collection, use, and retention are governed by the Company's Privacy Policy.
3. Membership registration is available only to persons aged 14 or older, and the Company restricts membership registration by children under the age of 14.

Article 7 (Acceptance of Application for Use)
1. The Company accepts valid applications for use under Article 6.
2. The Company provides the Service from the time membership registration is completed.

Article 8 (Restrictions on Acceptance of Application for Use)
The Company may refuse to accept, or may subsequently terminate the service agreement for, an application that falls under any of the following:
1. Where another person's information is misappropriated or the registered information contains false statements
2. Where the Company is unable to provide the Service due to business or technical reasons
3. Where the registration procedure or consent set by the Company has not been completed
4. Where the user has previously lost eligibility to use the Service due to a violation of user obligations under Article 18
5. Other unlawful or improper applications, or cases where the Company cannot accept the application due to a cause attributable to the user


Chapter 3. Use of the Service

Article 9 (Contents of the Service)
The Company provides users with the following services:
1. Automatic recommendation of travel itineraries (schedules and routes) based on interested artists and fandom
2. Recommendation of related places (POIs) and provision of detailed place information
3. Provision of event information such as concerts, birthday cafes, pop-ups, and goods
4. Multilingual guidance service
5. Collection of user feedback and place error reports
6. Other supplementary services that the Company determines to be consistent with the purpose of the Service

Article 10 (Commencement of Service Use)
1. The Company commences provision of the Service from the time a user completes membership registration.
2. If the Company is unable to commence provision due to business or technical obstacles, it will announce the reason on the Service screen or notify the user.

Article 11 (Hours of Service Use)
1. In principle, the Service is available 24 hours a day, year-round.
2. However, the Service may be temporarily suspended due to system maintenance, network failure, external data or API failure, and other causes. The Company will, in principle, give advance notice, but in urgent or unavoidable cases, will give notice immediately afterward.

Article 12 (Change and Suspension of the Service)
1. The Company may change the contents of the Service and provide it as changed. When changed, the Company will announce the contents and the date of provision pursuant to Article 19.
2. The Company may restrict or suspend all or part of the Service in any of the following cases:
   (1) Unavoidable circumstances such as equipment maintenance or inspection
   (2) Where normal provision is difficult due to power outage, equipment failure, excessive usage, etc.
   (3) Circumstances of the Company such as termination of a contract with a partner or external data provider
   (4) Force majeure such as a natural disaster or national emergency
3. The Company shall not be liable for any problem arising from a change or suspension under this Article unless caused by the Company's intent or negligence.

Article 13 (Nature and Limitations of Recommendation Results)
1. The itinerary and place recommendation results provided by the Service are reference information for the user's convenience, and the Company does not guarantee the accuracy, suitability, or fitness for a particular purpose of the recommendation results.
2. Because recommendation results are automatically generated based on AI algorithms and external data, they may differ from actual on-site conditions. Users must directly check whether a place is open, its operating hours, and admission conditions before visiting.
3. The Company shall not be liable for losses in travel, cost, or time arising from a user's reliance on recommendation results, unless caused by the Company's intent or gross negligence.

Article 14 (Accuracy of Place Information and Third-Party Data)
1. The Service provides place and event information using public data and third-party APIs (e.g., maps, tourism, public real-time data), and the original copyright and rights to such information belong to each provider.
2. The Company does not guarantee the accuracy, currency, or continuity of data provided by third parties, and shall not be liable for damage caused by errors, delays, or interruptions in third-party data unless caused by the Company's intent or negligence.
3. If information is inaccurate due to a place's closure, relocation, etc., users may notify the Company through the error-report function within the Service, and the Company will reflect the correction after a verification process.

Article 15 (Posts, Feedback, and Error Reports)
1. Responsibility for posts registered by a user, such as feedback and error reports, lies with the relevant user.
2. The Company may suspend or delete a post without prior notice if it determines that the post falls under any of the following:
   (1) Where it defames another person or infringes their rights
   (2) Where it violates public order or good morals, or is connected to a crime
   (3) Where it is false, advertising in nature, or otherwise violates applicable law or these Terms
3. The Company may use user feedback and error reports to improve and operate the Service, and may retain them as statistics in a form that does not identify individuals.

Article 16 (Provision of Information and Posting of Advertisements)
1. The Company may post notices related to Service operation on the Service screen or website, or notify users by email, push notification, etc.
2. The Company may send promotional information by email, text message, push notification, etc. only where it has obtained the user's prior consent, and the user may opt out of receiving such information at any time.


Chapter 4. Obligations of the Parties

Article 17 (Obligations of the Company)
1. The Company protects users' personal information in accordance with applicable law and does not provide or disclose it to third parties without the user's consent, except where a competent authority requests it through lawful procedures under applicable law.
2. The Company promptly handles user complaints and inquiries related to the Service, and if immediate handling is not possible, notifies the user of the reason and schedule.
3. Where the Company's intent or negligence causes damage to a user, the Company shall be liable, limited to ordinary damages.

Article 18 (Obligations of the User)
1. Users must not engage in any of the following acts:
   (1) Entering false information or wrongfully using another person's information when applying for or changing use
   (2) Infringing the copyright or other intellectual property rights of the Company or a third party
   (3) Reproducing, distributing, or commercially using information obtained through the Service without the Company's prior consent
   (4) Intentionally interfering with Service operations or causing a burden on the system (including abnormal crawling or automated access)
   (5) Defaming others, unlawfully collecting personal information, posting obscene or illegal information, etc.
   (6) Other acts that violate applicable law or these Terms
2. All rights, including copyright and other intellectual property rights, related to the Service belong to the Company. Users are merely granted a right of use by the Company and may not transfer, sell, or provide it as collateral.
3. If a user violates this Article, the Company may take measures such as restricting use, terminating the service agreement, or claiming damages.

Article 19 (Notices to Users)
1. When notifying users, the Company may use methods such as posting on the Service screen or website, or the email or push notification registered by the user.
2. Notice to an unspecified number of users may be substituted for individual notice by posting on the Service screen or website for 7 days or more.

Article 20 (Protection of Personal Information)
1. The Company protects users' personal information in accordance with applicable law, and specific matters are governed by the Company's separately posted Privacy Policy. The Privacy Policy forms part of these Terms.
2. The Company processes a member's request for deletion (withdrawal) within 30 days from the date of receipt. The Company retains data for a 90-day grace period after the deletion request, in preparation for data recovery or a change of the user's mind, and permanently deletes the user's profile and saved itinerary information after the grace period expires. However, feedback registered by the user may be retained only in an anonymized statistical form that does not identify the individual.


Chapter 5. Termination of Agreement and Restriction of Use

Article 21 (Termination of Agreement and Restriction of Use)
1. A user may terminate the service agreement at any time through the withdrawal procedure within the Service.
2. If a user violates the obligations under Article 18, the Company may restrict use or terminate the service agreement after prior notice (or subsequent notice in urgent cases).
3. A user may raise an objection to the Company's measures under this Article through the procedure set by the Company, and if the Company recognizes the objection as justified, it will immediately resume the user's access.

Article 22 (Prohibition of Transfer)
Users may not transfer or donate their status under the service agreement, such as the right to use the Service, to another person, or provide it as collateral.


Chapter 6. Damages, etc.

Article 23 (Damages)
1. A user who causes damage to the Company by violating these Terms shall compensate for such damage.
2. If a user causes the Company to receive a claim for damages or other objection from a third party in connection with use of the Service, and the Company thereby suffers damage, the user shall indemnify the Company at the user's own responsibility and expense.

Article 24 (Disclaimer)
1. The Company is not liable for any Service disruption caused by a natural disaster, force majeure, or other cause not attributable to the Company.
2. The Company does not guarantee the accuracy or completeness of recommendation results or third-party data under Articles 13 and 14, and is not liable for damage arising from reliance on them unless caused by the Company's intent or gross negligence.
3. The Company is not obligated to intervene in disputes between users, or between a user and a third party (such as a partner or place operator), and is not liable to compensate for damage arising therefrom.

Article 25 (Governing Law and Jurisdiction)
1. Disputes related to these Terms and use of the Service are governed by the laws of the Republic of Korea.
2. Litigation regarding disputes between the Company and a user shall be filed with a court having jurisdiction under the Civil Procedure Act.
3. Where these Terms are provided in multiple languages, the Korean version shall govern in the event of any discrepancy in interpretation.


Addendum
These Terms take effect on [YYYY.MM.DD].`

const LOCATION_EN = `※ Below are Articles 10 through 18 of the Terms of Use for Location-Based Services.

Article 10 (Rights of the Personal Location Information Subject)
1. Users may at any time withdraw all or part of their consent to the provision of location-based services using personal location information and to the provision of personal location information to third parties. In this case, the Company will, without delay, destroy the collected personal location information and the records confirming the use and provision of location information.
2. Users may at any time request the Company to temporarily suspend the collection, use, or provision of personal location information, and the Company may not refuse such a request and has technical means in place to comply with it.
3. Users may request the Company to allow access to, or notify them of, the materials listed below, and may request correction if there is an error in such materials. In this case, the Company may not refuse the user's request without justifiable grounds.
   1) Records confirming the collection, use, and provision of one's own location information
   2) The reason and content of the provision of one's own personal location information to a third party under the Act on the Protection and Use of Location Information or other applicable laws
4. Users may exercise the rights under paragraphs 1 through 3 through procedures guided by the Company, such as the settings menu within the Service, customer center (main phone number), or email, and the Company will take the relevant action without delay.

Article 11 (Rights of the Legal Representative)
1. For users under the age of 14, the Company must obtain consent for the provision of location-based services using personal location information and for the provision of personal location information to third parties from both the user and the user's legal representative. In this case, the Company confirms the legal representative's consent by the method prescribed by applicable law, and the legal representative has all the rights of the user under Article 10.
2. Where the Company intends to use or provide to a third party the personal location information of a child under 14, or the records confirming the use and provision of location information, beyond the scope specified or announced in the terms of use, the Company must obtain the consent of the child under 14 and their legal representative, except in the following cases:
   1) Where records confirming the use and provision of location information are necessary as a result of providing location information and location-based services
   2) Where the information is processed and provided in a form that cannot identify a specific individual, for statistical compilation, academic research, or market research

Article 12 (Rights of the Guardian of Children Aged 8 or Under, etc.)
1. Where the guardian of a person falling under any of the following (hereinafter "child aged 8 or under, etc.") consents to the use or provision of personal location information for the purpose of protecting the life or body of such person, the person themselves is deemed to have consented.
   1) A child aged 8 or under
   2) A person under adult guardianship
   3) A person with a mental disability under Article 2(2)(2) of the Act on Welfare of Persons with Disabilities who falls under a person with a severe disability under Article 2(2) of the Act on Employment Promotion and Vocational Rehabilitation for Disabled Persons (limited to a person registered as disabled under Article 32 of the Act on Welfare of Persons with Disabilities)
2. The guardian of a child aged 8 or under, etc. under the preceding paragraph means a person who actually protects the relevant child and falls under any of the following:
   1) The legal representative of a child aged 8 or under, or a guardian under Article 3 of the Act on the Guardianship of Minors in Protective Facilities
   2) The legal representative of a person under adult guardianship
   3) The legal representative of a person under paragraph 1(3) of this Article, or the head of a residential facility for persons with disabilities under Article 58(1)(1) of the Act on Welfare of Persons with Disabilities (limited to facilities established and operated by the State or a local government), the head of a social rehabilitation facility for persons with mental illness under Article 3(4) of the Mental Health Act (limited to facilities established and operated by the State or a local government), or the head of a mental health sanatorium under Article 3(5) of the same Act
3. A guardian who wishes to consent to the use or provision of personal location information for the protection of the life or body of a child aged 8 or under, etc. must submit a written consent form to the Company together with a document proving that they are the guardian.
4. A guardian who consents to the use or provision of personal location information of a child aged 8 or under, etc. may exercise all of the rights of the personal location information subject.

Article 13 (Company's Trade Name, Address, and Contact Information, etc.)
1. The Company's trade name, representative, address, and contact information are as follows.
   Trade name: [Operating entity's trade name or team name]
   Representative: [Name of representative]
   Address: [Address]
   Main phone number: [Main phone number]
2. The Company designates and operates a Location Information Manager who is in a position to bear substantial responsibility for properly managing and protecting personal location information and smoothly handling complaints from personal location information subjects. The name and contact information of the Location Information Manager are as follows.
   Name: [Name of Location Information Manager]
   Main phone number: [Main phone number]
   Email address: [Email of Location Information Manager]

Article 14 (Obligations of the Company)
1. The Company safely manages users' personal location information in compliance with the Act on the Protection and Use of Location Information, the Personal Information Protection Act, and other relevant laws.
2. The Company specifies and posts, in the terms of use, matters required by the Act on the Protection and Use of Location Information, such as the purpose of use, retention and use period, and status of provision to third parties of personal location information.
3. The Company operates a channel for handling user complaints and consultations related to the collection, use, and provision of location information.

Article 15 (Prohibition of Transfer)
A user's right to receive the Service may not be transferred or donated, or disposed of for purposes such as providing it as collateral.

Article 16 (Damages)
1. Where a user suffers damage due to the Company's act in violation of Articles 15 through 26 of the Act on the Protection and Use of Location Information, the user may claim damages from the Company. In this case, the Company cannot be exempted from liability unless it proves the absence of intent or negligence.
2. Where the Company suffers damage due to a user's violation of these Terms, the Company may claim damages from the user. In this case, the user cannot be exempted from liability unless they prove the absence of intent or negligence.

Article 17 (Disclaimer)
1. The Company is not liable for damage suffered by a user due to the Company's inability to provide the Service in any of the following cases:
   1) Where there is a natural disaster or a state of force majeure equivalent thereto
   2) Where there is intentional interference with the Service by a third party that has entered into a service partnership agreement with the Company for the provision of the Service
   3) Where there is an obstacle to Service use due to a cause attributable to the user
   4) Other causes not attributable to the Company's intent or negligence, excluding items 1 through 3
2. The Company does not guarantee the reliability or accuracy of the Service and the information, materials, and facts posted on the Service, and is not liable for damage suffered by a user as a result thereof.

Article 18 (Dispute Mediation and Other Matters)
1. If a dispute arises between the Company and a user in connection with use of the Service, the Company will negotiate in good faith with the user to resolve the dispute.
2. If the dispute is not resolved through the negotiation under the preceding paragraph, the Company and the user may apply for adjudication to the Korea Communications Commission under Article 28 of the Act on the Protection and Use of Location Information, or apply for adjudication or dispute mediation to the Korea Communications Commission or the Personal Information Dispute Mediation Committee under Article 43 of the Personal Information Protection Act.
3. If the dispute is still not resolved under the preceding paragraph, either the Company or the user may file a lawsuit with a court having jurisdiction under the Civil Procedure Act.`

const PRIVACY_EN = `[Required] Consent to the Collection and Use of Personal Information (FAN:GO)

1. Items of Personal Information Collected

① Items collected at membership registration (required)
- Email (ID), password, nickname, nationality, language, fandom, favorite (member of interest)
- [To be reviewed] If social login is introduced: need to confirm whether a member identifier received from the relevant provider (e.g., a unique account ID) will be added

② Items generated and collected during use of the Service
- Recommended itineraries created and saved by the user, and usage history
- Feedback and place error reports registered by the user

③ Items automatically collected (common to app and web) [To be reviewed]
- Service usage records, access logs, cookies, access IP, device information
- Push notification token (when app push is used)
- ※ The actual scope and whether these items are collected must be finalized once implementation is confirmed.


2. Purpose of Collecting and Using Personal Information

- Identifying members and confirming intent to register
- Providing place and itinerary recommendation (matching) services based on interested artist and fandom information
- Handling user feedback and error reports, and improving Service quality
- Communicating with users regarding Service operation, such as delivering notices and responding to inquiries


3. Period of Retention and Use of Personal Information

- Retained and used until the purpose of collection and use is achieved or the member withdraws.
- Upon a member's request for withdrawal (deletion): processed within 30 days from the date the request is received. After a 90-day retention grace period (to allow for data recovery or a change of mind), the profile and saved itinerary information are permanently deleted. However, feedback may be retained only in an anonymized statistical form that does not identify the individual.
- Notwithstanding the above, where applicable law requires a separate retention obligation, the information will be retained for the relevant period.


※ You have the right to refuse consent to the collection and use of personal information described above. However, if you refuse consent to required items, membership registration and use of the Service may be restricted.`

const TERMS_JA = `第1章 総則

第1条(目的)
本規約は、利用者が[会社名](以下「会社」)が提供する「FAN:GO」サービス(アプリおよびウェブ、以下「サービス」)の利用に関して、利用者と会社間の権利、義務および責任事項、利用条件および手続き等必要な事項を定めることを目的とします。

第2条(規約の効力および変更)
1. 本規約は、会社がサービス画面または関連ウェブサイトに掲示し、これに同意した利用者がサービスに加入することによって効力が発生します。
2. 会社は関係法令に違反しない範囲で本規約を変更することができ、変更時は適用日および変更理由を明示し、適用日の7日前から第19条の方法で公示します。ただし、利用者に不利または重大な変更の場合は適用日の30日前から公示します。
3. 会社が前項に従い変更規約を公示しながら「適用日まで拒否意思を表示しなければ同意したものとみなす」旨を併せて告知したにもかかわらず、利用者が明示的に拒否意思を表示しない場合は、変更に同意したものとみなします。
4. 変更された規約に同意しない利用者は、サービスの利用を中止し、利用契約を解約することができます。

第3条(規約外準則)
本規約に明示されていない事項は、「個人情報保護法」、「情報通信網利用促進および情報保護等に関する法律」、「位置情報の保護および利用等に関する法律」、「コンテンツ産業振興法」、「著作権法」等の関係法令および会社が定める詳細利用指針に従います。

第4条(用語の定義)
本規約で使用する用語の定義は次の通りです。
1. 「サービス」とは、会社が提供する、利用者の関心アーティスト・ファンダム情報に基づき関連場所(POI)と旅行動線を推薦し、関連情報を提供するFAN:GOアプリおよびウェブサービスをいいます。
2. 「利用者」とは、本規約に従いサービスを利用する者をいいます。
3. 「会員」とは、本規約に同意し会社が要求する情報を登録して加入承認を受け、サービスを利用する者をいいます。
4. 「動線(推薦結果)」とは、会社の推薦エンジンが利用者の入力情報と場所データに基づき生成して提供する旅行日程・経路および場所推薦結果をいいます。
5. 「場所(POI)」とは、サービスが推薦・案内する聖地、カフェ、公演会場、グッズショップ、ポップアップストア等の地点情報をいいます。
6. 「投稿」とは、利用者がサービス内に登録するフィードバック、場所誤り報告(閉店・移転等)等一切の情報をいいます。
7. 「提携先」とは、会社と提携契約を締結してサービスに関連情報を提供し、またはサービスを通じて事業を営む事業者をいいます。


第2章 利用契約

第5条(利用契約の成立)
1. 利用者がアプリまたはウェブで本規約に「同意する」を選択し会員登録を申請すると、会社がこれを承諾することにより利用契約が成立します。
2. サービスはすべて無料で提供されます。

第6条(利用申請および会員登録)
1. 利用申請は、利用者が会社の定める加入手続きに従い必須情報を入力し、本規約および個人情報収集・利用に同意する方法で行われます。
2. 会社が会員登録時に収集する項目は、サービス提供(推薦)に必要な最小限の範囲とし、メールアドレス・ニックネーム・国籍・言語・ファンダム・推し(関心メンバー)等が含まれます。具体的な収集・利用・保管は会社の個人情報処理方針に従います。
3. 会員登録は満14歳以上の者のみ行うことができ、会社は満14歳未満の児童の会員登録を制限します。

第7条(利用申請の承諾)
1. 会社は第6条に基づく有効な利用申請を承諾します。
2. 会社は会員登録完了時点からサービスを提供します。

第8条(利用申請承諾の制限)
会社は次の各号に該当する申請については承諾しない、または事後に利用契約を解約することができます。
1. 他人の情報を盗用し、または登録内容に虚偽の記載がある場合
2. 会社の業務上・技術上の事情によりサービス提供が不可能な場合
3. 会社の定める加入手続き・同意を完了していない場合
4. 第18条の利用者義務に違反して利用資格を喪失した事実がある場合
5. その他違法・不当な申請、または利用者の責に帰すべき事由により会社が承諾できない場合


第3章 サービスの利用

第9条(サービスの内容)
会社は利用者に次の各号のサービスを提供します。
1. 関心アーティスト・ファンダムに基づく旅行動線(日程・経路)自動推薦サービス
2. 関連場所(POI)推薦および場所詳細情報提供サービス
3. 公演・誕生日カフェ・ポップアップ・グッズ等イベント情報提供サービス
4. 多言語案内サービス
5. 利用者フィードバックおよび場所誤り報告受付サービス
6. その他会社がサービスの目的に合致すると判断して提供する付加サービス

第10条(サービスの利用開始)
1. 会社は利用者の会員登録完了時からサービス提供を開始します。
2. 業務上・技術上の障害により提供を開始できない場合、会社はその事由をサービス画面等に告知し、または利用者に通知します。

第11条(サービスの利用時間)
1. サービスの利用は年中無休、1日24時間を原則とします。
2. ただし、システム点検、通信網障害、外部データ・API障害等の事由によりサービスが一時中止される場合があり、会社は原則として事前に告知しますが、急迫または不可避な場合は事後に直ちに告知します。

第12条(サービスの変更および中止)
1. 会社はサービスの内容を変更して提供することができ、変更時はその内容および提供日を第19条の方法で告知します。
2. 会社は次の各号の場合、サービスの全部または一部を制限・中止することができます。
   (1) 設備の補修・点検等やむを得ない場合
   (2) 停電、設備障害、利用の殺到等により正常な提供が困難な場合
   (3) 提携先・外部データ提供先との契約終了等会社の諸事情
   (4) 天災地変、国家非常事態等不可抗力
3. 会社は故意または過失がない限り、本条による変更・中止により発生した問題について責任を負いません。

第13条(推薦結果の性質と限界)
1. サービスが提供する動線および場所推薦結果は利用者の便宜のための参考情報であり、会社は推薦結果の正確性・適合性・特定目的への適合を保証しません。
2. 推薦結果はAIアルゴリズムおよび外部データに基づき自動生成されるため、実際の現場状況と異なる場合があります。利用者は訪問前に営業の有無・営業時間・入場条件等を直接確認する必要があります。
3. 利用者が推薦結果を信頼して発生した移動・費用・時間の損失等について、会社の故意または重大な過失がない限り会社は責任を負いません。

第14条(場所情報の正確性および第三者データ)
1. サービスは公共データおよび第三者API(例:地図・観光・公共リアルタイムデータ等)を活用して場所・イベント情報を提供し、当該情報の原著作権および権利は各提供先にあります。
2. 第三者が提供するデータの正確性・最新性・継続性は会社が保証せず、第三者データの誤り・遅延・中断による損害について会社は故意または過失がない限り責任を負いません。
3. 場所の閉店・移転等により情報が不正確な場合、利用者はサービス内の誤り報告機能を通じてこれを会社に知らせることができ、会社は確認手続きを経て反映します。

第15条(投稿・フィードバック・誤り報告)
1. 利用者が登録したフィードバック・誤り報告等の投稿の責任は当該利用者にあります。
2. 会社は投稿が次の各号に該当すると判断した場合、事前通知なく掲載を中止・削除することができます。
   (1) 他人の名誉を毀損し、または権利を侵害する場合
   (2) 公共秩序・善良な風俗に反し、または犯罪と結びつく場合
   (3) 虚偽・広告性、その他関係法令や本規約に違反する場合
3. 会社はサービス改善および運営のため利用者のフィードバック・誤り報告を活用でき、個人を識別できない形式の統計として保存できます。

第16条(情報の提供および広告の掲載)
1. 会社はサービス運営に関する告知事項をサービス画面・ウェブサイトに掲載し、またはメール・プッシュ等で通知できます。
2. 会社は利用者の事前同意を得た場合に限り、メール・SMS・プッシュ等で広告性情報を送信でき、利用者はいつでも受信を拒否できます。


第4章 契約当事者の義務

第17条(会社の義務)
1. 会社は関係法令に従い利用者の個人情報を保護し、利用者の同意なく第三者に提供・漏洩しません。ただし、法令に基づき権限のある機関が適法な手続きで要求する場合は例外とします。
2. 会社はサービスに関する利用者の不満・問い合わせを迅速に処理し、直ちに処理が困難な場合はその事由と日程を通知します。
3. 会社の故意または過失により利用者に損害が発生した場合、会社が責任を負い、その範囲は通常損害に限ります。

第18条(利用者の義務)
1. 利用者は次の各号の行為をしてはなりません。
   (1) 利用申請・変更時の虚偽情報記載または他人情報の不正使用
   (2) 会社・第三者の著作権等知的財産権の侵害
   (3) サービスを通じて得た情報を会社の事前同意なく複製・流通・商業的に利用する行為
   (4) サービス運営を故意に妨害し、またはシステムに負荷を生じさせる行為(異常なクローリング・自動化アクセスを含む)
   (5) 他人の名誉毀損、個人情報の無断収集、わいせつ・違法情報の掲示等
   (6) その他関係法令および本規約に違反する行為
2. サービスに関する著作権および知的財産権等すべての権利は会社に帰属し、利用者は会社から利用権を付与されたものであり、これを譲渡・販売・担保提供することはできません。
3. 利用者が本条に違反した場合、会社は利用制限、利用契約解約、損害賠償請求等の措置を取ることができます。

第19条(利用者への通知)
1. 会社は利用者に通知する場合、サービス画面・ウェブサイト告知または利用者が登録したメール・プッシュ等の方法によることができます。
2. 不特定多数への通知は、サービス画面またはウェブサイトに7日以上掲示することで個別通知に代えることができます。

第20条(個人情報の保護)
1. 会社は関係法令に従い利用者の個人情報を保護し、具体的事項は会社が別途掲示する個人情報処理方針に従います。個人情報処理方針は本規約の一部を構成します。
2. 会社は会員の削除(退会)要請を受付日から30日以内に処理します。会社はデータ復旧および利用者の心変わり等に備え、削除要請後90日間の保管猶予期間を設け、猶予期間経過後は利用者のプロフィールおよび保存された動線情報を完全に削除します。ただし、利用者が登録したフィードバックは個人を識別できない匿名統計の形式でのみ保存できます。


第5章 契約解約および利用制限

第21条(契約解約および利用制限)
1. 利用者はいつでもサービス内の退会手続きを通じて利用契約を解約できます。
2. 会社は利用者が第18条の義務に違反した場合、事前通知後(緊急の場合は事後通知)利用を制限し、または利用契約を解約できます。
3. 利用者は本条の会社措置について会社の定める手続きに従い異議を申し立てることができ、会社が異議を正当と認めた場合は直ちに利用を再開します。

第22条(譲渡禁止)
利用者はサービス利用権限等利用契約上の地位を他人に譲渡・贈与し、または担保に提供することはできません。


第6章 損害賠償等

第23条(損害賠償)
1. 本規約に違反して会社に損害を発生させた利用者は、その損害を賠償しなければなりません。
2. 利用者がサービス利用に関連して第三者から損害賠償請求等の異議を受けることにより会社に損害が発生した場合、当該利用者は自己の責任と費用で会社を免責させなければなりません。

第24条(免責事項)
1. 会社は天災地変、不可抗力、または会社の責に帰さない事由により発生したサービス利用障害について責任を負いません。
2. 会社は第13条・第14条に基づき推薦結果および第三者データの正確性・完全性を保証せず、これを信頼して発生した損害について故意または重大な過失がない限り責任を負いません。
3. 会社は利用者相互間または利用者と第三者(提携先・場所運営者等)間に発生した紛争に介入する義務を負わず、これによる損害を賠償する責任を負いません。

第25条(準拠法および管轄)
1. 本規約およびサービス利用に関連する紛争には大韓民国法を準拠法とします。
2. 会社と利用者間の紛争に関する訴訟は「民事訴訟法」に基づく管轄裁判所に提起します。
3. 本規約が複数言語で提供される場合、解釈上差異があるときは韓国語版を基準とします。


附則
本規約は[YYYY.MM.DD]から施行します。`

const LOCATION_JA = `※以下は位置基盤サービス利用規約のうち第10条〜第18条です。

第10条(個人位置情報主体の権利)
1. 利用者は会社に対していつでも、個人位置情報を利用した位置基盤サービスの提供および個人位置情報の第三者提供に対する同意の全部または一部を撤回できます。この場合、会社は収集した個人位置情報および位置情報の利用・提供事実確認資料を遅滞なく破棄します。
2. 利用者は会社に対していつでも、個人位置情報の収集・利用または提供の一時的な中止を要求でき、会社はこれを拒否できず、そのための技術的手段を備えています。
3. 利用者は会社に対して下記各号の資料について閲覧または告知を要求でき、当該資料に誤りがある場合はその訂正を要求できます。この場合、会社は正当な事由なく利用者の要求を拒否できません。
   1) 本人に対する位置情報の収集・利用・提供事実確認資料
   2) 本人の個人位置情報が「位置情報の保護および利用等に関する法律」または他の法律の規定により第三者に提供された理由および内容
4. 利用者は第1項ないし第3項の権利を行使するため、サービス内の設定メニュー、カスタマーセンター(代表電話)、電子メール等会社が案内する手続きを通じて要求でき、会社は遅滞なく関連措置を取ります。

第11条(法定代理人の権利)
1. 会社は14歳未満の利用者については、個人位置情報を利用した位置基盤サービスの提供および個人位置情報の第三者提供に対する同意を、当該利用者と当該利用者の法定代理人の双方から得なければなりません。この場合、会社は関係法令が定める方法により法定代理人の同意有無を確認し、法定代理人は第10条による利用者の権利をすべて有します。
2. 会社は14歳未満の児童の個人位置情報または位置情報の利用・提供事実確認資料を、利用規約に明示または告知した範囲を超えて利用し、または第三者に提供しようとする場合には、14歳未満の児童とその法定代理人の同意を得なければなりません。ただし、以下の場合は除きます。
   1) 位置情報および位置基盤サービスの提供に伴う位置情報の利用・提供事実確認資料が必要な場合
   2) 統計作成、学術研究または市場調査のために特定個人を識別できない形式に加工して提供する場合

第12条(8歳以下の児童等の保護義務者の権利)
1. 会社は下記各号に該当する者(以下「8歳以下の児童等」)の保護義務者が、8歳以下の児童等の生命または身体保護のために個人位置情報の利用または提供に同意する場合、本人の同意があるものとみなします。
   1) 8歳以下の児童
   2) 成年被後見人
   3) 障害者福祉法第2条第2項第2号の規定による精神的障害を有する者であって、障害者雇用促進および職業リハビリテーション法第2条第2号の規定により重症障害者に該当する者(障害者福祉法第32条の規定による障害者登録をした者に限る)
2. 前項の規定による8歳以下の児童等の保護義務者は、当該児童を事実上保護する者として次の各号に該当する者をいいます。
   1) 8歳以下の児童の法定代理人または「保護施設にある未成年者の後見職務に関する法律」第3条の規定による後見人
   2) 成年被後見人の法定代理人
   3) 本条第1項第3号の者の法定代理人、または障害者福祉法第58条第1項第1号の規定による障害者生活施設(国または地方自治体が設置・運営する施設に限る)の長、精神保健法第3条第4号の規定による精神疾患者社会復帰施設(国または地方自治体が設置・運営する施設に限る)の長、同法同条第5号の規定による精神療養施設の長
3. 8歳以下の児童等の生命または身体の保護のために個人位置情報の利用または提供に同意しようとする保護義務者は、書面同意書に保護義務者であることを証明する書面を添付して会社に提出しなければなりません。
4. 保護義務者は8歳以下の児童等の個人位置情報の利用または提供に同意する場合、個人位置情報主体の権利のすべてを行使できます。

第13条(会社の商号、住所および連絡先等)
1. 会社の商号、代表者、住所および連絡先は下記の通りです。
   商号:[運営主体の商号またはチーム名]
   代表:[代表者氏名]
   住所:[住所]
   代表電話:[代表電話]
2. 会社は個人位置情報を適切に管理・保護し、個人位置情報主体の不満を円滑に処理できるよう実質的な責任を負う地位にある者を位置情報管理責任者として指定・運営しており、位置情報管理責任者の氏名と連絡先は下記の通りです。
   氏名:[位置情報管理責任者氏名]
   代表電話:[代表電話]
   メールアドレス:[位置情報管理責任者メールアドレス]

第14条(会社の義務)
1. 会社は位置情報法、個人情報保護法等関連法令を遵守し、利用者の個人位置情報を安全に管理します。
2. 会社は利用約款に個人位置情報の利用目的・保有および利用期間・第三者提供現況等位置情報法が定める事項を明示して掲示します。
3. 会社は位置情報の収集・利用・提供に関連して利用者の不満処理および相談のための窓口を運営します。

第15条(譲渡禁止)
利用者のサービスを受ける権利は、これを譲渡もしくは贈与し、または担保提供等の目的で処分することはできません。

第16条(損害賠償)
1. 会社が位置情報法第15条ないし第26条の規定に違反する行為により利用者に損害が発生した場合、利用者は会社に対して損害賠償を請求できます。この場合、会社は故意または過失がないことを立証できなければ責任を免れません。
2. 利用者が本規約の規定に違反して会社に損害が発生した場合、会社は利用者に対して損害賠償を請求できます。この場合、利用者は故意または過失がないことを立証できなければ責任を免れません。

第17条(免責)
1. 会社は次の各号の事由によりサービスを提供できない場合、これにより利用者に発生した損害について責任を負いません。
   1) 天災地変またはこれに準ずる不可抗力の状態がある場合
   2) サービス提供のために会社とサービス提携契約を締結した第三者の故意的なサービス妨害がある場合
   3) 利用者の責に帰すべき事由によりサービス利用に支障がある場合
   4) 第1号ないし第3号を除く、その他会社の故意・過失によらない事由による場合
2. 会社はサービスおよびサービスに掲載された情報、資料、事実の信頼度、正確性等について保証せず、これにより発生した利用者の損害について責任を負いません。

第18条(紛争の調整およびその他)
1. サービス利用に関連して会社と利用者間に紛争が発生した場合、会社は紛争解決のため利用者と誠実に協議します。
2. 前項の協議で紛争が解決されない場合、会社と利用者は位置情報法第28条により放送通信委員会に裁定を申請し、または個人情報保護法第43条により放送通信委員会または個人情報紛争調停委員会に裁定または紛争調停を申請できます。
3. 前項によっても紛争が解決されない場合、会社と利用者の双方は民事訴訟法上の管轄裁判所に訴えを提起できます。`

const PRIVACY_JA = `[必須] 個人情報収集・利用同意(FAN:GO)

1. 収集する個人情報の項目

①会員登録時に収集する項目(必須)
- メールアドレス(ID)、パスワード、ニックネーム、国籍、言語、ファンダム、推し(関心メンバー)
- [検討]ソーシャルログイン導入時:当該プロバイダーから受け取る会員識別子(例:アカウント固有ID等)の追加要否確認が必要

②サービス利用過程で生成・収集される項目
- 利用者が生成・保存した推薦動線および利用履歴
- 利用者が登録したフィードバック・場所誤り報告内容

③自動で収集される項目(アプリ・ウェブ共通)[検討]
- サービス利用記録、接続ログ、クッキー、接続IP、機器情報
- (アプリプッシュ利用時)プッシュ通知トークン
- ※上記項目の実際の収集可否および範囲は実装確定後に反映する必要があります。


2. 個人情報収集・利用目的

- 会員識別および加入意思確認
- 関心アーティスト・ファンダム情報に基づく場所・動線推薦(マッチング)サービス提供
- 利用者フィードバック・誤り報告の処理およびサービス品質改善
- 告知事項の伝達、問い合わせ対応等サービス運営に関するコミュニケーション


3. 個人情報の保有および利用期間

- 収集・利用目的が達成されるか、会員が退会するまで保有・利用します。
- 会員退会(削除)要請時:要請受付日から30日以内に処理し、データ復旧・心変わり等に備えた90日間の保管猶予期間経過後、プロフィールおよび保存された動線情報を完全に削除します。ただし、フィードバックは個人を識別できない匿名統計の形式でのみ保存できます。
- 上記基準にかかわらず、関係法令で別途の保存義務を定めた場合は当該期間保存します。


※お客様は上記の個人情報収集・利用に対する同意を拒否する権利があります。ただし必須項目への同意を拒否する場合、会員登録およびサービス利用が制限される場合があります。`

const TERMS_ZH_CN = `第1章 总则

第1条（目的）
本条款旨在规定用户在使用[公司名称]（以下简称"公司"）提供的"FAN:GO"服务（应用及网页，以下简称"服务"）时，用户与公司之间的权利、义务及责任事项、使用条件及程序等必要事项。

第2条（条款的效力及变更）
1. 本条款自公司在服务页面或相关网站上公示，且同意该条款的用户加入服务之时起生效。
2. 公司可在不违反相关法令的范围内变更本条款，变更时须注明适用日期及变更理由，并按照第19条规定的方式，自适用日7日前进行公告。但对用户不利或重大的变更，应自适用日30日前公告。
3. 若公司依前款公告变更条款，并一并告知"若在适用日前未表示拒绝，则视为同意"，而用户未明确表示拒绝的，视为同意该变更。
4. 不同意变更后条款的用户，可停止使用服务并解除使用合同。

第3条（条款外准则）
本条款未明示的事项，依照《个人信息保护法》《促进信息通信网利用及信息保护等相关法律》《位置信息保护及利用等相关法律》《内容产业振兴法》《著作权法》等相关法令及公司制定的详细使用指南办理。

第4条（术语定义）
本条款所使用术语的定义如下。
1. "服务"是指公司基于用户关注的艺人及粉丝圈信息，推荐相关场所（POI）及旅行动线并提供相关信息的FAN:GO应用及网页服务。
2. "用户"是指依本条款使用服务者。
3. "会员"是指同意本条款并登记公司要求的信息、经批准加入后使用服务者。
4. "动线（推荐结果）"是指公司的推荐引擎基于用户输入信息及场所数据生成并提供的旅行日程、路线及场所推荐结果。
5. "场所（POI）"是指服务所推荐、引导的圣地、咖啡厅、演出场馆、周边商店、快闪店等地点信息。
6. "帖子"是指用户在服务内登记的反馈、场所错误举报（歇业、搬迁等）等一切信息。
7. "合作方"是指与公司签订合作协议、向服务提供相关信息或通过服务开展业务的经营者。


第2章 使用合同

第5条（使用合同的成立）
1. 用户在应用或网页上对本条款选择"同意"并申请会员注册，经公司承诺后，使用合同即成立。
2. 服务全部免费提供。

第6条（使用申请及会员注册）
1. 使用申请是指用户按照公司规定的注册程序输入必要信息，并同意本条款及个人信息收集、使用的方式进行。
2. 公司在会员注册时收集的项目以提供服务（推荐）所需的最小范围为限，包括电子邮箱、昵称、国籍、语言、粉丝圈、担（关注成员）等。具体收集、使用、保管依公司的个人信息处理方针办理。
3. 仅满14周岁以上者方可注册会员，公司限制未满14周岁儿童注册会员。

第7条（使用申请的承诺）
1. 公司对依第6条提出的有效使用申请予以承诺。
2. 公司自会员注册完成之时起提供服务。

第8条（使用申请承诺的限制）
公司对下列各项申请可不予承诺，或于事后解除使用合同。
1. 盗用他人信息或登记内容存在虚假记载的情形
2. 因公司业务或技术原因无法提供服务的情形
3. 未完成公司规定的注册程序、同意的情形
4. 曾因违反第18条用户义务而丧失使用资格的情形
5. 其他违法、不当申请，或因可归责于用户的事由致使公司无法承诺的情形


第3章 服务的使用

第9条（服务的内容）
公司向用户提供下列各项服务。
1. 基于关注艺人及粉丝圈的旅行动线（日程、路线）自动推荐服务
2. 相关场所（POI）推荐及场所详情信息提供服务
3. 演出、生日咖啡厅、快闪店、周边等活动信息提供服务
4. 多语言引导服务
5. 用户反馈及场所错误举报受理服务
6. 其他公司判断符合服务目的而提供的附加服务

第10条（服务的使用开始）
1. 公司自用户会员注册完成时起开始提供服务。
2. 因业务或技术障碍无法开始提供服务时，公司应在服务页面等公告该事由或通知用户。

第11条（服务的使用时间）
1. 服务原则上全年无休、每日24小时提供。
2. 但因系统检查、通信网络故障、外部数据、API故障等事由，服务可能暂时中止，公司原则上应事先公告，情况紧急或不可避免时应于事后立即公告。

第12条（服务的变更及中止）
1. 公司可变更服务内容并提供，变更时应依第19条的方式公告其内容及提供日期。
2. 公司在下列情形下可限制或中止服务的全部或部分。
   （1）设备维修、检查等不得已的情形
   （2）因停电、设备故障、使用量激增等致使无法正常提供的情形
   （3）与合作方、外部数据提供方终止合同等公司的各种情形
   （4）天灾、国家紧急状态等不可抗力
3. 公司对依本条进行变更、中止所引发的问题，在无故意或过失的情况下不承担责任。

第13条（推荐结果的性质与局限）
1. 服务提供的动线及场所推荐结果，系为方便用户而提供的参考信息，公司不保证推荐结果的准确性、适合性及是否符合特定目的。
2. 推荐结果系基于AI算法及外部数据自动生成，可能与实际现场情况不符。用户在到访前应自行确认是否营业、营业时间、入场条件等。
3. 用户因信赖推荐结果而产生的移动、费用、时间损失等，在公司无故意或重大过失的情况下，公司不承担责任。

第14条（场所信息的准确性及第三方数据）
1. 服务利用公共数据及第三方API（如地图、旅游、公共实时数据等）提供场所、活动信息，相关信息的原始著作权及权利归属于各提供方。
2. 第三方提供数据的准确性、时效性、连续性，公司不予保证；因第三方数据的错误、延迟、中断所致损害，在公司无故意或过失的情况下不承担责任。
3. 因场所歇业、搬迁等致使信息不准确时，用户可通过服务内的错误举报功能告知公司，公司经核实程序后予以反映。

第15条（帖子、反馈、错误举报）
1. 用户登记的反馈、错误举报等帖子的责任由该用户承担。
2. 公司判断帖子属于下列各项情形之一时，可不经事先通知而中止发布或删除。
   （1）损害他人名誉或侵害其权利的情形
   （2）违反公共秩序、善良风俗或与犯罪相关联的情形
   （3）虚假、广告性质，或其他违反相关法令或本条款的情形
3. 公司为改善及运营服务，可利用用户的反馈、错误举报，并可以无法识别个人的统计形式予以保存。

第16条（信息的提供及广告的刊登）
1. 公司可将服务运营相关公告事项刊登于服务页面、网站，或通过电子邮件、推送等方式通知。
2. 公司仅在取得用户事先同意的情况下，方可通过电子邮件、短信、推送等方式发送广告性信息，用户可随时拒绝接收。


第4章 合同当事人的义务

第17条（公司的义务）
1. 公司依相关法令保护用户的个人信息，未经用户同意不向第三方提供或泄露。但依法令有权机关通过合法程序要求的情形除外。
2. 公司应迅速处理与服务相关的用户不满、咨询，若无法立即处理，应通知其事由及处理日程。
3. 因公司故意或过失致用户遭受损害的，公司应承担责任，其范围以通常损害为限。

第18条（用户的义务）
1. 用户不得从事下列各项行为。
   （1）在申请或变更使用时记载虚假信息或不正当使用他人信息
   （2）侵害公司、第三方的著作权等知识产权
   （3）未经公司事先同意，复制、传播或商业性利用通过服务获得的信息
   （4）故意妨碍服务运营或对系统造成负荷的行为（含异常爬取、自动化访问）
   （5）诋毁他人名誉、擅自收集个人信息、发布淫秽或违法信息等
   （6）其他违反相关法令及本条款的行为
2. 关于服务的著作权及知识产权等一切权利归属于公司，用户仅被公司授予使用权，不得转让、出售或提供担保。
3. 用户违反本条时，公司可采取限制使用、解除使用合同、请求损害赔偿等措施。

第19条（对用户的通知）
1. 公司通知用户时，可通过服务页面、网站公告，或用户登记的电子邮件、推送等方式进行。
2. 对不特定多数人的通知，可在服务页面或网站上公示7日以上以代替个别通知。

第20条（个人信息的保护）
1. 公司依相关法令保护用户的个人信息，具体事项依公司另行公示的个人信息处理方针办理。个人信息处理方针构成本条款的一部分。
2. 公司自受理会员删除（退出）请求之日起30日内予以处理。为应对数据恢复及用户反悔等情形，公司在删除请求后设置90日的保管宽限期，宽限期届满后，完全删除用户的个人资料及已保存的动线信息。但用户登记的反馈，可仅以无法识别个人的匿名统计形式予以保存。


第5章 合同解除及使用限制

第21条（合同解除及使用限制）
1. 用户可随时通过服务内的退出程序解除使用合同。
2. 用户违反第18条义务时，公司可在事先通知后（紧急情形下事后通知）限制使用或解除使用合同。
3. 用户可依公司规定的程序对本条所述公司措施提出异议，公司认定异议正当时，应立即恢复使用。

第22条（禁止转让）
用户不得将服务使用权限等使用合同项下的地位转让、赠与他人或提供担保。


第6章 损害赔偿等

第23条（损害赔偿）
1. 因违反本条款致公司遭受损害的用户，应赔偿该损害。
2. 用户因使用服务而致第三方向公司提出损害赔偿请求等异议，使公司遭受损害的，该用户应以自身责任及费用使公司免责。

第24条（免责事项）
1. 公司对因天灾、不可抗力或非可归责于公司的事由所致服务使用障碍，不承担责任。
2. 公司不保证依第13条、第14条提供的推荐结果及第三方数据的准确性、完整性，因信赖上述内容而产生的损害，在公司无故意或重大过失的情况下不承担责任。
3. 公司对用户相互之间或用户与第三方（合作方、场所经营者等）之间发生的纠纷不负介入义务，亦不就由此产生的损害承担赔偿责任。

第25条（准据法及管辖）
1. 与本条款及服务使用相关的纠纷，以大韩民国法律为准据法。
2. 公司与用户之间纠纷相关的诉讼，向依据《民事诉讼法》确定管辖的法院提起。
3. 本条款以多语言提供时，如解释上存在差异，以韩语版为准。


附则
本条款自[YYYY.MM.DD]起施行。`

const LOCATION_ZH_CN = `※以下为位置信息服务使用条款中的第10条至第18条。

第10条（个人位置信息主体的权利）
1. 用户可随时向公司撤回利用个人位置信息提供基于位置的服务及向第三方提供个人位置信息之同意的全部或部分。此种情形下，公司应立即销毁已收集的个人位置信息及位置信息利用、提供事实确认资料。
2. 用户可随时要求公司暂时中止收集、利用或提供个人位置信息，公司不得拒绝该请求，并已具备为此所需的技术手段。
3. 用户可要求公司查阅或告知下列各项资料，若该资料存在错误，可要求更正。此种情形下，公司无正当理由不得拒绝用户的请求。
   1）本人的位置信息收集、利用、提供事实确认资料
   2）依据《位置信息保护及利用等相关法律》或其他法律的规定，本人的个人位置信息向第三方提供的理由及内容
4. 用户为行使第1款至第3款的权利，可通过服务内设置菜单、客服中心（代表电话）、电子邮件等公司指引的程序提出请求，公司应立即采取相关措施。

第11条（法定代理人的权利）
1. 公司对未满14周岁的用户，须同时取得该用户及其法定代理人对利用个人位置信息提供基于位置的服务、以及向第三方提供个人位置信息的同意。此种情形下，公司应依相关法令规定的方法确认法定代理人的同意情况，法定代理人享有第10条规定的用户的全部权利。
2. 公司欲在使用条款所明示或告知的范围之外，利用或向第三方提供未满14周岁儿童的个人位置信息或位置信息利用、提供事实确认资料时，须取得未满14周岁儿童及其法定代理人的同意。但下列情形除外。
   1）因提供位置信息及基于位置的服务而需要位置信息利用、提供事实确认资料的情形
   2）为编制统计、学术研究或市场调查，以无法识别特定个人的形式加工后提供的情形

第12条（8周岁以下儿童等的监护义务人的权利）
1. 属于下列各项之一者（以下称"8周岁以下儿童等"）的监护义务人，为保护8周岁以下儿童等的生命或身体安全而同意利用或提供个人位置信息时，视为本人已同意。
   1）8周岁以下儿童
   2）被成年监护人
   3）依据《残疾人福利法》第2条第2款第2项规定具有精神障碍、且依据《残疾人就业促进及职业康复法》第2条第2项规定属于重度残疾人者（限于依《残疾人福利法》第32条规定已办理残疾人登记者）
2. 依前款规定的8周岁以下儿童等的监护义务人，是指事实上保护该儿童者，具体为下列各项之一者。
   1）8周岁以下儿童的法定代理人，或依《保护设施内未成年人监护职务相关法律》第3条规定的监护人
   2）被成年监护人的法定代理人
   3）本条第1款第3项所列人员的法定代理人，或依《残疾人福利法》第58条第1款第1项规定的残疾人生活设施（限于国家或地方自治团体设置、运营的设施）负责人，依《精神保健法》第3条第4项规定的精神疾病患者社会康复设施（限于国家或地方自治团体设置、运营的设施）负责人，依同法同条第5项规定的精神疗养设施负责人
3. 拟为保护8周岁以下儿童等的生命或身体安全而同意利用或提供个人位置信息的监护义务人，须向公司提交书面同意书，并附具证明其为监护义务人的书面材料。
4. 监护义务人同意利用或提供8周岁以下儿童等的个人位置信息时，可行使个人位置信息主体的全部权利。

第13条（公司的商号、地址及联系方式等）
1. 公司的商号、代表人、地址及联系方式如下。
   商号：[运营主体商号或团队名称]
   代表：[代表人姓名]
   地址：[地址]
   代表电话：[代表电话]
2. 公司为妥善管理、保护个人位置信息，并能顺畅处理个人位置信息主体的不满，指定处于可承担实质责任地位者为位置信息管理责任人并予以运营，位置信息管理责任人的姓名及联系方式如下。
   姓名：[位置信息管理责任人姓名]
   代表电话：[代表电话]
   电子邮箱：[位置信息管理责任人电子邮箱]

第14条（公司的义务）
1. 公司遵守《位置信息法》《个人信息保护法》等相关法令，安全管理用户的个人位置信息。
2. 公司在使用条款中明示并公示《位置信息法》所规定的个人位置信息利用目的、保有及利用期限、向第三方提供现况等事项。
3. 公司就位置信息的收集、利用、提供相关事宜，设置用户不满处理及咨询窗口并予以运营。

第15条（禁止转让）
用户接受服务的权利不得转让或赠与，亦不得为提供担保等目的而处分。

第16条（损害赔偿）
1. 公司因违反《位置信息法》第15条至第26条规定的行为致用户遭受损害的，用户可向公司请求损害赔偿。此种情形下，公司未能证明无故意或过失的，不得免责。
2. 用户因违反本条款规定致公司遭受损害的，公司可向用户请求损害赔偿。此种情形下，用户未能证明无故意或过失的，不得免责。

第17条（免责）
1. 公司因下列各项事由无法提供服务时，对因此给用户造成的损害不承担责任。
   1）存在天灾或与之相当的不可抗力状态的情形
   2）为提供服务而与公司签订服务合作协议的第三方故意妨碍服务的情形
   3）因可归责于用户的事由致服务使用发生障碍的情形
   4）除第1项至第3项外，其他非因公司故意、过失所致的事由
2. 公司对服务及服务中刊载的信息、资料、事实的可靠性、准确性等不予保证，对由此给用户造成的损害不承担责任。

第18条（纠纷的调解及其他）
1. 因服务使用与公司和用户之间发生纠纷时，公司应为解决纠纷与用户诚实协商。
2. 前款协商未能解决纠纷时，公司与用户可依《位置信息法》第28条向广播通信委员会申请裁决，或依《个人信息保护法》第43条向广播通信委员会或个人信息纠纷调解委员会申请裁决或纠纷调解。
3. 依前款仍未解决纠纷时，公司与用户双方均可向依《民事诉讼法》确定管辖的法院提起诉讼。`

const PRIVACY_ZH_CN = `【必须】个人信息收集、使用同意（FAN:GO）

1. 收集的个人信息项目

①会员注册时收集的项目（必须）
- 电子邮箱（ID）、密码、昵称、国籍、语言、粉丝圈、担（关注成员）
- [待审核] 引入社交登录时：需确认是否新增从相关服务商接收的会员识别码（如账户唯一ID等）

②服务使用过程中生成、收集的项目
- 用户生成、保存的推荐动线及使用记录
- 用户登记的反馈、场所错误举报内容

③自动收集的项目（应用、网页通用）[待审核]
- 服务使用记录、接入日志、Cookie、接入IP、设备信息
- （使用应用推送时）推送通知令牌
- ※上述项目的实际收集与否及范围，须在实现方案确定后予以反映。


2. 个人信息收集、使用目的

- 会员识别及注册意愿确认
- 基于关注艺人及粉丝圈信息提供场所、动线推荐（匹配）服务
- 处理用户反馈、错误举报及提升服务质量
- 传达公告事项、应答咨询等与服务运营相关的沟通


3. 个人信息的保有及使用期限

- 保有并使用至收集、使用目的达成或会员退出为止。
- 会员申请退出（删除）时：自受理申请之日起30日内处理，为应对数据恢复及反悔等情形，设置删除申请后90日的保管宽限期，宽限期届满后完全删除个人资料及已保存的动线信息。但反馈信息可仅以无法识别个人的匿名统计形式予以保存。
- 尽管有上述规定，若相关法令另有保存义务规定的，依该期限予以保存。


※您有权拒绝同意上述个人信息的收集、使用。但若拒绝同意必须项目，会员注册及服务使用可能受到限制。`

const TERMS_ZH_TW = `第1章 總則

第1條（目的）
本條款旨在規定用戶在使用[公司名稱]（以下簡稱「公司」）提供的「FAN:GO」服務（應用程式及網頁，以下簡稱「服務」）時，用戶與公司之間的權利、義務及責任事項、使用條件及程序等必要事項。

第2條（條款的效力及變更）
1. 本條款自公司在服務頁面或相關網站上公示，且同意該條款的用戶加入服務之時起生效。
2. 公司可在不違反相關法令的範圍內變更本條款，變更時須注明適用日期及變更理由，並按照第19條規定的方式，自適用日7日前進行公告。但對用戶不利或重大的變更，應自適用日30日前公告。
3. 若公司依前款公告變更條款，並一併告知「若在適用日前未表示拒絕，則視為同意」，而用戶未明確表示拒絕的，視為同意該變更。
4. 不同意變更後條款的用戶，可停止使用服務並解除使用合約。

第3條（條款外準則）
本條款未明示的事項，依照《個人資料保護法》《促進資訊通信網利用及資訊保護等相關法律》《位置資訊保護及利用等相關法律》《內容產業振興法》《著作權法》等相關法令及公司制定的詳細使用指南辦理。

第4條（用語定義）
本條款所使用用語的定義如下。
1. 「服務」是指公司基於用戶關注的藝人及粉絲圈資訊，推薦相關場所（POI）及旅行動線並提供相關資訊的FAN:GO應用程式及網頁服務。
2. 「用戶」是指依本條款使用服務者。
3. 「會員」是指同意本條款並登記公司要求的資訊、經核准加入後使用服務者。
4. 「動線（推薦結果）」是指公司的推薦引擎基於用戶輸入資訊及場所資料生成並提供的旅行日程、路線及場所推薦結果。
5. 「場所（POI）」是指服務所推薦、引導的聖地、咖啡廳、演出場館、周邊商店、快閃店等地點資訊。
6. 「貼文」是指用戶在服務內登記的意見回饋、場所錯誤通報（歇業、搬遷等）等一切資訊。
7. 「合作夥伴」是指與公司簽訂合作協議、向服務提供相關資訊或透過服務經營業務的業者。


第2章 使用合約

第5條（使用合約的成立）
1. 用戶在應用程式或網頁上對本條款選擇「同意」並申請會員註冊，經公司承諾後，使用合約即成立。
2. 服務全部免費提供。

第6條（使用申請及會員註冊）
1. 使用申請是指用戶按照公司規定的註冊程序輸入必要資訊，並同意本條款及個人資料收集、使用的方式進行。
2. 公司在會員註冊時收集的項目以提供服務（推薦）所需的最小範圍為限，包括電子郵箱、暱稱、國籍、語言、粉絲圈、本命（關注成員）等。具體收集、使用、保管依公司的個人資料處理方針辦理。
3. 僅滿14週歲以上者方可註冊會員，公司限制未滿14週歲兒童註冊會員。

第7條（使用申請的承諾）
1. 公司對依第6條提出的有效使用申請予以承諾。
2. 公司自會員註冊完成之時起提供服務。

第8條（使用申請承諾的限制）
公司對下列各項申請可不予承諾，或於事後解除使用合約。
1. 盜用他人資訊或登記內容存在虛假記載的情形
2. 因公司業務或技術原因無法提供服務的情形
3. 未完成公司規定的註冊程序、同意的情形
4. 曾因違反第18條用戶義務而喪失使用資格的情形
5. 其他違法、不當申請，或因可歸責於用戶的事由致使公司無法承諾的情形


第3章 服務的使用

第9條（服務的內容）
公司向用戶提供下列各項服務。
1. 基於關注藝人及粉絲圈的旅行動線（日程、路線）自動推薦服務
2. 相關場所（POI）推薦及場所詳情資訊提供服務
3. 演出、生日咖啡廳、快閃店、周邊等活動資訊提供服務
4. 多語言導覽服務
5. 用戶意見回饋及場所錯誤通報受理服務
6. 其他公司判斷符合服務目的而提供的附加服務

第10條（服務的使用開始）
1. 公司自用戶會員註冊完成時起開始提供服務。
2. 因業務或技術障礙無法開始提供服務時，公司應在服務頁面等公告該事由或通知用戶。

第11條（服務的使用時間）
1. 服務原則上全年無休、每日24小時提供。
2. 但因系統檢查、通訊網路故障、外部資料、API故障等事由，服務可能暫時中止，公司原則上應事先公告，情況緊急或不可避免時應於事後立即公告。

第12條（服務的變更及中止）
1. 公司可變更服務內容並提供，變更時應依第19條的方式公告其內容及提供日期。
2. 公司在下列情形下可限制或中止服務的全部或部分。
   （1）設備維修、檢查等不得已的情形
   （2）因停電、設備故障、使用量暴增等致使無法正常提供的情形
   （3）與合作夥伴、外部資料提供方終止合約等公司的各種情形
   （4）天災、國家緊急狀態等不可抗力
3. 公司對依本條進行變更、中止所引發的問題，在無故意或過失的情況下不承擔責任。

第13條（推薦結果的性質與局限）
1. 服務提供的動線及場所推薦結果，係為方便用戶而提供的參考資訊，公司不保證推薦結果的準確性、適合性及是否符合特定目的。
2. 推薦結果係基於AI演算法及外部資料自動生成，可能與實際現場情況不符。用戶在到訪前應自行確認是否營業、營業時間、入場條件等。
3. 用戶因信賴推薦結果而產生的移動、費用、時間損失等，在公司無故意或重大過失的情況下，公司不承擔責任。

第14條（場所資訊的準確性及第三方資料）
1. 服務利用公共資料及第三方API（如地圖、觀光、公共即時資料等）提供場所、活動資訊，相關資訊的原始著作權及權利歸屬於各提供方。
2. 第三方提供資料的準確性、時效性、連續性，公司不予保證；因第三方資料的錯誤、延遲、中斷所致損害，在公司無故意或過失的情況下不承擔責任。
3. 因場所歇業、搬遷等致使資訊不準確時，用戶可透過服務內的錯誤通報功能告知公司，公司經核實程序後予以反映。

第15條（貼文、意見回饋、錯誤通報）
1. 用戶登記的意見回饋、錯誤通報等貼文的責任由該用戶承擔。
2. 公司判斷貼文屬於下列各項情形之一時，可不經事先通知而中止發布或刪除。
   （1）損害他人名譽或侵害其權利的情形
   （2）違反公共秩序、善良風俗或與犯罪相關聯的情形
   （3）虛假、廣告性質，或其他違反相關法令或本條款的情形
3. 公司為改善及營運服務，可利用用戶的意見回饋、錯誤通報，並可以無法識別個人的統計形式予以保存。

第16條（資訊的提供及廣告的刊登）
1. 公司可將服務營運相關公告事項刊登於服務頁面、網站，或透過電子郵件、推播等方式通知。
2. 公司僅在取得用戶事先同意的情況下，方可透過電子郵件、簡訊、推播等方式發送廣告性資訊，用戶可隨時拒絕接收。


第4章 合約當事人的義務

第17條（公司的義務）
1. 公司依相關法令保護用戶的個人資料，未經用戶同意不向第三方提供或洩漏。但依法令有權機關透過合法程序要求的情形除外。
2. 公司應迅速處理與服務相關的用戶不滿、諮詢，若無法立即處理，應通知其事由及處理日程。
3. 因公司故意或過失致用戶遭受損害的，公司應承擔責任，其範圍以通常損害為限。

第18條（用戶的義務）
1. 用戶不得從事下列各項行為。
   （1）在申請或變更使用時記載虛假資訊或不正當使用他人資訊
   （2）侵害公司、第三方的著作權等智慧財產權
   （3）未經公司事先同意，複製、傳播或商業性利用透過服務取得的資訊
   （4）故意妨礙服務營運或對系統造成負荷的行為（含異常爬取、自動化存取）
   （5）詆毀他人名譽、擅自蒐集個人資料、張貼猥褻或違法資訊等
   （6）其他違反相關法令及本條款的行為
2. 關於服務的著作權及智慧財產權等一切權利歸屬於公司，用戶僅被公司授予使用權，不得轉讓、出售或提供擔保。
3. 用戶違反本條時，公司可採取限制使用、解除使用合約、請求損害賠償等措施。

第19條（對用戶的通知）
1. 公司通知用戶時，可透過服務頁面、網站公告，或用戶登記的電子郵件、推播等方式進行。
2. 對不特定多數人的通知，可在服務頁面或網站上公示7日以上以代替個別通知。

第20條（個人資料的保護）
1. 公司依相關法令保護用戶的個人資料，具體事項依公司另行公示的個人資料處理方針辦理。個人資料處理方針構成本條款的一部分。
2. 公司自受理會員刪除（退出）請求之日起30日內予以處理。為應對資料復原及用戶反悔等情形，公司在刪除請求後設置90日的保管寬限期，寬限期屆滿後，完全刪除用戶的個人檔案及已保存的動線資訊。但用戶登記的意見回饋，可僅以無法識別個人的匿名統計形式予以保存。


第5章 合約解除及使用限制

第21條（合約解除及使用限制）
1. 用戶可隨時透過服務內的退出程序解除使用合約。
2. 用戶違反第18條義務時，公司可在事先通知後（緊急情形下事後通知）限制使用或解除使用合約。
3. 用戶可依公司規定的程序對本條所述公司措施提出異議，公司認定異議正當時，應立即恢復使用。

第22條（禁止轉讓）
用戶不得將服務使用權限等使用合約項下的地位轉讓、贈與他人或提供擔保。


第6章 損害賠償等

第23條（損害賠償）
1. 因違反本條款致公司遭受損害的用戶，應賠償該損害。
2. 用戶因使用服務而致第三方向公司提出損害賠償請求等異議，使公司遭受損害的，該用戶應以自身責任及費用使公司免責。

第24條（免責事項）
1. 公司對因天災、不可抗力或非可歸責於公司的事由所致服務使用障礙，不承擔責任。
2. 公司不保證依第13條、第14條提供的推薦結果及第三方資料的準確性、完整性，因信賴上述內容而產生的損害，在公司無故意或重大過失的情況下不承擔責任。
3. 公司對用戶相互之間或用戶與第三方（合作夥伴、場所經營者等）之間發生的糾紛不負介入義務，亦不就由此產生的損害承擔賠償責任。

第25條（準據法及管轄）
1. 與本條款及服務使用相關的糾紛，以大韓民國法律為準據法。
2. 公司與用戶之間糾紛相關的訴訟，向依據《民事訴訟法》確定管轄的法院提起。
3. 本條款以多語言提供時，如解釋上存在差異，以韓語版為準。


附則
本條款自[YYYY.MM.DD]起施行。`

const LOCATION_ZH_TW = `※以下為位置資訊服務使用條款中的第10條至第18條。

第10條（個人位置資訊主體的權利）
1. 用戶可隨時向公司撤回利用個人位置資訊提供基於位置的服務及向第三方提供個人位置資訊之同意的全部或部分。此種情形下，公司應立即銷毀已蒐集的個人位置資訊及位置資訊利用、提供事實確認資料。
2. 用戶可隨時要求公司暫時中止蒐集、利用或提供個人位置資訊，公司不得拒絕該請求，並已具備為此所需的技術手段。
3. 用戶可要求公司查閱或告知下列各項資料，若該資料存在錯誤，可要求更正。此種情形下，公司無正當理由不得拒絕用戶的請求。
   1）本人的位置資訊蒐集、利用、提供事實確認資料
   2）依據《位置資訊保護及利用等相關法律》或其他法律的規定，本人的個人位置資訊向第三方提供的理由及內容
4. 用戶為行使第1項至第3項的權利，可透過服務內設定選單、客服中心（代表電話）、電子郵件等公司指引的程序提出請求，公司應立即採取相關措施。

第11條（法定代理人的權利）
1. 公司對未滿14週歲的用戶，須同時取得該用戶及其法定代理人對利用個人位置資訊提供基於位置的服務、以及向第三方提供個人位置資訊的同意。此種情形下，公司應依相關法令規定的方法確認法定代理人的同意情況，法定代理人享有第10條規定的用戶的全部權利。
2. 公司欲在使用條款所明示或告知的範圍之外，利用或向第三方提供未滿14週歲兒童的個人位置資訊或位置資訊利用、提供事實確認資料時，須取得未滿14週歲兒童及其法定代理人的同意。但下列情形除外。
   1）因提供位置資訊及基於位置的服務而需要位置資訊利用、提供事實確認資料的情形
   2）為編制統計、學術研究或市場調查，以無法識別特定個人的形式加工後提供的情形

第12條（8週歲以下兒童等的監護義務人的權利）
1. 屬於下列各項之一者（以下稱「8週歲以下兒童等」）的監護義務人，為保護8週歲以下兒童等的生命或身體安全而同意利用或提供個人位置資訊時，視為本人已同意。
   1）8週歲以下兒童
   2）受監護宣告之人
   3）依據《身心障礙者福利法》第2條第2項第2款規定具有精神障礙、且依據《身心障礙者就業促進及職業重建法》第2條第2款規定屬於重度身心障礙者（限於依《身心障礙者福利法》第32條規定已辦理身心障礙證明登記者）
2. 依前項規定的8週歲以下兒童等的監護義務人，是指事實上保護該兒童者，具體為下列各項之一者。
   1）8週歲以下兒童的法定代理人，或依《保護設施內未成年人監護職務相關法律》第3條規定的監護人
   2）受監護宣告之人的法定代理人
   3）本條第1項第3款所列人員的法定代理人，或依《身心障礙者福利法》第58條第1項第1款規定的身心障礙者生活設施（限於國家或地方自治團體設置、營運的設施）負責人，依《精神保健法》第3條第4款規定的精神疾病患者社會復健設施（限於國家或地方自治團體設置、營運的設施）負責人，依同法同條第5款規定的精神療養設施負責人
3. 擬為保護8週歲以下兒童等的生命或身體安全而同意利用或提供個人位置資訊的監護義務人，須向公司提交書面同意書，並附具證明其為監護義務人的書面資料。
4. 監護義務人同意利用或提供8週歲以下兒童等的個人位置資訊時，可行使個人位置資訊主體的全部權利。

第13條（公司的商號、地址及聯絡方式等）
1. 公司的商號、代表人、地址及聯絡方式如下。
   商號：[經營主體商號或團隊名稱]
   代表：[代表人姓名]
   地址：[地址]
   代表電話：[代表電話]
2. 公司為妥善管理、保護個人位置資訊，並能順暢處理個人位置資訊主體的不滿，指定處於可承擔實質責任地位者為位置資訊管理責任人並予以營運，位置資訊管理責任人的姓名及聯絡方式如下。
   姓名：[位置資訊管理責任人姓名]
   代表電話：[代表電話]
   電子郵箱：[位置資訊管理責任人電子郵箱]

第14條（公司的義務）
1. 公司遵守《位置資訊法》《個人資料保護法》等相關法令，安全管理用戶的個人位置資訊。
2. 公司在使用條款中明示並公示《位置資訊法》所規定的個人位置資訊利用目的、保有及利用期限、向第三方提供現況等事項。
3. 公司就位置資訊的蒐集、利用、提供相關事宜，設置用戶不滿處理及諮詢窗口並予以營運。

第15條（禁止轉讓）
用戶接受服務的權利不得轉讓或贈與，亦不得為提供擔保等目的而處分。

第16條（損害賠償）
1. 公司因違反《位置資訊法》第15條至第26條規定的行為致用戶遭受損害的，用戶可向公司請求損害賠償。此種情形下，公司未能證明無故意或過失的，不得免責。
2. 用戶因違反本條款規定致公司遭受損害的，公司可向用戶請求損害賠償。此種情形下，用戶未能證明無故意或過失的，不得免責。

第17條（免責）
1. 公司因下列各項事由無法提供服務時，對因此給用戶造成的損害不承擔責任。
   1）存在天災或與之相當的不可抗力狀態的情形
   2）為提供服務而與公司簽訂服務合作協議的第三方故意妨礙服務的情形
   3）因可歸責於用戶的事由致服務使用發生障礙的情形
   4）除第1款至第3款外，其他非因公司故意、過失所致的事由
2. 公司對服務及服務中刊載的資訊、資料、事實的可靠性、準確性等不予保證，對由此給用戶造成的損害不承擔責任。

第18條（糾紛的調解及其他）
1. 因服務使用與公司和用戶之間發生糾紛時，公司應為解決糾紛與用戶誠實協商。
2. 前項協商未能解決糾紛時，公司與用戶可依《位置資訊法》第28條向通訊傳播委員會申請裁決，或依《個人資料保護法》第43條向通訊傳播委員會或個人資料糾紛調解委員會申請裁決或糾紛調解。
3. 依前項仍未解決糾紛時，公司與用戶雙方均可向依《民事訴訟法》確定管轄的法院提起訴訟。`

const PRIVACY_ZH_TW = `【必須】個人資料蒐集、使用同意（FAN:GO）

1. 蒐集的個人資料項目

①會員註冊時蒐集的項目（必須）
- 電子郵箱（ID）、密碼、暱稱、國籍、語言、粉絲圈、本命（關注成員）
- [待審核] 引入社群登入時：需確認是否新增從相關服務商接收的會員識別碼（如帳戶唯一ID等）

②服務使用過程中產生、蒐集的項目
- 用戶產生、保存的推薦動線及使用記錄
- 用戶登記的意見回饋、場所錯誤通報內容

③自動蒐集的項目（應用程式、網頁通用）[待審核]
- 服務使用記錄、連線日誌、Cookie、連線IP、裝置資訊
- （使用應用程式推播時）推播通知權杖
- ※上述項目的實際蒐集與否及範圍，須在實作方案確定後予以反映。


2. 個人資料蒐集、使用目的

- 會員識別及註冊意願確認
- 基於關注藝人及粉絲圈資訊提供場所、動線推薦（媒合）服務
- 處理用戶意見回饋、錯誤通報及提升服務品質
- 傳達公告事項、回應諮詢等與服務營運相關的溝通


3. 個人資料的保有及使用期限

- 保有並使用至蒐集、使用目的達成或會員退出為止。
- 會員申請退出（刪除）時：自受理申請之日起30日內處理，為應對資料復原及反悔等情形，設置刪除申請後90日的保管寬限期，寬限期屆滿後完全刪除個人檔案及已保存的動線資訊。但意見回饋可僅以無法識別個人的匿名統計形式予以保存。
- 儘管有上述規定，若相關法令另有保存義務規定者，依該期限予以保存。


※您有權拒絕同意上述個人資料的蒐集、使用。但若拒絕同意必要項目，會員註冊及服務使用可能受到限制。`

const TERMS_TH = `บทที่ 1 บททั่วไป

มาตรา 1 (วัตถุประสงค์)
ข้อกำหนดนี้มีวัตถุประสงค์เพื่อกำหนดสิทธิ หน้าที่ ความรับผิดชอบ เงื่อนไขและขั้นตอนการใช้บริการที่จำเป็นระหว่างผู้ใช้กับ [ชื่อบริษัท] ("บริษัท") ผู้ให้บริการ "FAN:GO" (แอปและเว็บ "บริการ")

มาตรา 2 (ผลบังคับและการแก้ไขข้อกำหนด)
1. ข้อกำหนดนี้มีผลบังคับเมื่อบริษัทประกาศบนหน้าจอบริการหรือเว็บไซต์ที่เกี่ยวข้อง และผู้ใช้ที่ยินยอมได้สมัครใช้บริการ
2. บริษัทอาจแก้ไขข้อกำหนดนี้ภายในขอบเขตที่ไม่ขัดต่อกฎหมายที่เกี่ยวข้อง โดยเมื่อมีการแก้ไข จะแจ้งวันที่มีผลบังคับใช้และเหตุผลการแก้ไขล่วงหน้าอย่างน้อย 7 วันตามวิธีการในมาตรา 19 แต่หากเป็นการแก้ไขที่ไม่เป็นคุณหรือมีสาระสำคัญต่อผู้ใช้ จะแจ้งล่วงหน้าอย่างน้อย 30 วัน
3. หากบริษัทประกาศแก้ไขข้อกำหนดตามวรรคก่อน พร้อมแจ้งว่า "หากไม่แสดงเจตนาปฏิเสธก่อนวันที่มีผลบังคับใช้ จะถือว่ายินยอม" และผู้ใช้ไม่ได้แสดงเจตนาปฏิเสธอย่างชัดแจ้ง ให้ถือว่าผู้ใช้ยินยอมต่อการแก้ไขนั้น
4. ผู้ใช้ที่ไม่ยินยอมต่อข้อกำหนดที่แก้ไขแล้วสามารถหยุดใช้บริการและยกเลิกสัญญาการใช้บริการได้

มาตรา 3 (หลักเกณฑ์นอกเหนือจากข้อกำหนดนี้)
เรื่องที่ไม่ได้ระบุไว้ในข้อกำหนดนี้ให้เป็นไปตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล กฎหมายว่าด้วยการส่งเสริมการใช้เครือข่ายสารสนเทศและการคุ้มครองข้อมูล กฎหมายว่าด้วยการคุ้มครองและการใช้ข้อมูลตำแหน่งที่ตั้ง กฎหมายส่งเสริมอุตสาหกรรมเนื้อหา กฎหมายลิขสิทธิ์ และกฎหมายอื่นที่เกี่ยวข้อง รวมถึงแนวทางการใช้งานโดยละเอียดที่บริษัทกำหนด

มาตรา 4 (คำนิยาม)
คำนิยามที่ใช้ในข้อกำหนดนี้มีดังนี้
1. "บริการ" หมายถึง แอปและเว็บ FAN:GO ที่บริษัทให้บริการ ซึ่งแนะนำสถานที่ที่เกี่ยวข้อง (POI) และเส้นทางการเดินทางโดยอ้างอิงจากข้อมูลศิลปินและแฟนด้อมที่ผู้ใช้สนใจ พร้อมให้ข้อมูลที่เกี่ยวข้อง
2. "ผู้ใช้" หมายถึง ผู้ที่ใช้บริการตามข้อกำหนดนี้
3. "สมาชิก" หมายถึง ผู้ที่ยินยอมตามข้อกำหนดนี้ ลงทะเบียนข้อมูลที่บริษัทร้องขอ ได้รับการอนุมัติให้สมัครสมาชิก และใช้บริการ
4. "เส้นทาง (ผลการแนะนำ)" หมายถึง ผลลัพธ์ของกำหนดการเดินทาง เส้นทาง และการแนะนำสถานที่ที่ระบบแนะนำของบริษัทสร้างขึ้นและนำเสนอ โดยอ้างอิงจากข้อมูลที่ผู้ใช้ป้อนและข้อมูลสถานที่
5. "สถานที่ (POI)" หมายถึง ข้อมูลจุดต่าง ๆ เช่น สถานที่ศักดิ์สิทธิ์ คาเฟ่ สถานที่จัดการแสดง ร้านขายสินค้า ป๊อปอัปสโตร์ ที่บริการแนะนำหรือให้ข้อมูล
6. "โพสต์" หมายถึง ข้อมูลทั้งหมดที่ผู้ใช้ลงทะเบียนในบริการ รวมถึงความคิดเห็นและการแจ้งข้อผิดพลาดของสถานที่ (ปิดกิจการ ย้ายที่ตั้ง ฯลฯ)
7. "พันธมิตร" หมายถึง ผู้ประกอบการที่ทำสัญญาความร่วมมือกับบริษัทเพื่อให้ข้อมูลที่เกี่ยวข้องแก่บริการ หรือดำเนินธุรกิจผ่านบริการ


บทที่ 2 สัญญาการใช้บริการ

มาตรา 5 (การเกิดสัญญาการใช้บริการ)
1. สัญญาการใช้บริการเกิดขึ้นเมื่อผู้ใช้เลือก "ยินยอม" ต่อข้อกำหนดนี้ในแอปหรือเว็บ และสมัครสมาชิก และบริษัทยอมรับคำขอนั้น
2. บริการทั้งหมดให้บริการโดยไม่มีค่าใช้จ่าย

มาตรา 6 (การสมัครใช้บริการและการสมัครสมาชิก)
1. การสมัครใช้บริการทำโดยผู้ใช้กรอกข้อมูลที่จำเป็นตามขั้นตอนการสมัครที่บริษัทกำหนด และยินยอมต่อข้อกำหนดนี้และการเก็บรวบรวม/ใช้ข้อมูลส่วนบุคคล
2. รายการที่บริษัทเก็บรวบรวมเมื่อสมัครสมาชิกจำกัดอยู่ในขอบเขตขั้นต่ำที่จำเป็นสำหรับการให้บริการ (การแนะนำ) ได้แก่ อีเมล ชื่อเล่น สัญชาติ ภาษา แฟนด้อม ศิลปินที่ชื่นชอบ (สมาชิกที่สนใจ) เป็นต้น การเก็บรวบรวม การใช้ และการเก็บรักษาโดยละเอียดเป็นไปตามนโยบายความเป็นส่วนตัวของบริษัท
3. การสมัครสมาชิกจำกัดเฉพาะผู้ที่มีอายุ 14 ปีขึ้นไป บริษัทจำกัดการสมัครสมาชิกของเด็กอายุต่ำกว่า 14 ปี

มาตรา 7 (การยอมรับคำขอใช้บริการ)
1. บริษัทยอมรับคำขอใช้บริการที่ถูกต้องตามมาตรา 6
2. บริษัทให้บริการตั้งแต่เวลาที่การสมัครสมาชิกเสร็จสมบูรณ์

มาตรา 8 (ข้อจำกัดในการยอมรับคำขอใช้บริการ)
บริษัทอาจไม่ยอมรับ หรืออาจยกเลิกสัญญาการใช้บริการในภายหลัง สำหรับคำขอที่เข้าข่ายกรณีต่อไปนี้
1. กรณีแอบอ้างข้อมูลของผู้อื่นหรือมีการระบุข้อมูลเท็จในการลงทะเบียน
2. กรณีที่บริษัทไม่สามารถให้บริการได้ด้วยเหตุผลทางธุรกิจหรือทางเทคนิค
3. กรณีที่ไม่ดำเนินการตามขั้นตอนหรือการยินยอมที่บริษัทกำหนดให้ครบถ้วน
4. กรณีที่เคยสูญเสียสิทธิ์การใช้บริการจากการละเมิดหน้าที่ของผู้ใช้ตามมาตรา 18
5. กรณีอื่นที่เป็นการสมัครที่ผิดกฎหมายหรือไม่เหมาะสม หรือกรณีที่บริษัทไม่สามารถยอมรับได้เนื่องจากความผิดของผู้ใช้


บทที่ 3 การใช้บริการ

มาตรา 9 (เนื้อหาของบริการ)
บริษัทให้บริการดังต่อไปนี้แก่ผู้ใช้
1. บริการแนะนำเส้นทางการเดินทาง (กำหนดการ เส้นทาง) โดยอัตโนมัติตามศิลปินและแฟนด้อมที่สนใจ
2. บริการแนะนำสถานที่ที่เกี่ยวข้อง (POI) และให้ข้อมูลรายละเอียดสถานที่
3. บริการให้ข้อมูลกิจกรรม เช่น การแสดง คาเฟ่วันเกิด ป๊อปอัป สินค้าที่ระลึก
4. บริการแนะนำหลายภาษา
5. บริการรับความคิดเห็นและการแจ้งข้อผิดพลาดของสถานที่จากผู้ใช้
6. บริการเสริมอื่น ๆ ที่บริษัทเห็นว่าสอดคล้องกับวัตถุประสงค์ของบริการ

มาตรา 10 (การเริ่มต้นใช้บริการ)
1. บริษัทเริ่มให้บริการตั้งแต่เวลาที่ผู้ใช้สมัครสมาชิกเสร็จสมบูรณ์
2. หากไม่สามารถเริ่มให้บริการได้เนื่องจากอุปสรรคทางธุรกิจหรือทางเทคนิค บริษัทจะประกาศเหตุผลบนหน้าจอบริการหรือแจ้งให้ผู้ใช้ทราบ

มาตรา 11 (เวลาการใช้บริการ)
1. บริการเปิดให้ใช้งานตลอด 24 ชั่วโมงทุกวันเป็นหลักการ
2. อย่างไรก็ตาม บริการอาจหยุดชั่วคราวเนื่องจากการตรวจสอบระบบ ความขัดข้องของเครือข่าย ความขัดข้องของข้อมูลหรือ API ภายนอก ฯลฯ โดยบริษัทจะแจ้งล่วงหน้าตามหลักการ แต่ในกรณีเร่งด่วนหรือหลีกเลี่ยงไม่ได้ จะแจ้งทันทีภายหลัง

มาตรา 12 (การเปลี่ยนแปลงและการหยุดให้บริการ)
1. บริษัทอาจเปลี่ยนแปลงเนื้อหาของบริการ โดยเมื่อมีการเปลี่ยนแปลงจะประกาศเนื้อหาและวันที่ให้บริการตามวิธีการในมาตรา 19
2. บริษัทอาจจำกัดหรือหยุดบริการทั้งหมดหรือบางส่วนในกรณีต่อไปนี้
   (1) กรณีจำเป็นต้องซ่อมบำรุงหรือตรวจสอบอุปกรณ์
   (2) กรณีที่ไม่สามารถให้บริการตามปกติได้เนื่องจากไฟฟ้าดับ อุปกรณ์ขัดข้อง หรือมีผู้ใช้งานจำนวนมากเกินไป
   (3) สถานการณ์ต่าง ๆ ของบริษัท เช่น การสิ้นสุดสัญญากับพันธมิตรหรือผู้ให้ข้อมูลภายนอก
   (4) เหตุสุดวิสัย เช่น ภัยพิบัติทางธรรมชาติ หรือภาวะฉุกเฉินของประเทศ
3. บริษัทไม่รับผิดชอบต่อปัญหาที่เกิดจากการเปลี่ยนแปลงหรือหยุดให้บริการตามมาตรานี้ เว้นแต่เกิดจากเจตนาหรือความประมาทเลินเล่อของบริษัท

มาตรา 13 (ลักษณะและข้อจำกัดของผลการแนะนำ)
1. ผลการแนะนำเส้นทางและสถานที่ที่บริการให้ไว้เป็นข้อมูลอ้างอิงเพื่อความสะดวกของผู้ใช้ บริษัทไม่รับประกันความถูกต้อง ความเหมาะสม หรือความสอดคล้องกับวัตถุประสงค์เฉพาะของผลการแนะนำ
2. ผลการแนะนำถูกสร้างขึ้นโดยอัตโนมัติจากอัลกอริทึม AI และข้อมูลภายนอก จึงอาจแตกต่างจากสถานการณ์จริงในสถานที่ ผู้ใช้ต้องตรวจสอบด้วยตนเองก่อนไปเยือน เช่น สถานะเปิด-ปิด เวลาทำการ เงื่อนไขการเข้าชม เป็นต้น
3. บริษัทไม่รับผิดชอบต่อความสูญเสียด้านการเดินทาง ค่าใช้จ่าย หรือเวลาที่เกิดจากการที่ผู้ใช้เชื่อถือผลการแนะนำ เว้นแต่เกิดจากเจตนาหรือความประมาทเลินเล่ออย่างร้ายแรงของบริษัท

มาตรา 14 (ความถูกต้องของข้อมูลสถานที่และข้อมูลจากบุคคลที่สาม)
1. บริการใช้ข้อมูลสาธารณะและ API ของบุคคลที่สาม (เช่น แผนที่ ข้อมูลท่องเที่ยว ข้อมูลสาธารณะแบบเรียลไทม์ ฯลฯ) เพื่อให้ข้อมูลสถานที่และกิจกรรม โดยลิขสิทธิ์และสิทธิ์ดั้งเดิมของข้อมูลดังกล่าวเป็นของผู้ให้ข้อมูลแต่ละราย
2. บริษัทไม่รับประกันความถูกต้อง ความทันสมัย หรือความต่อเนื่องของข้อมูลที่บุคคลที่สามให้มา และไม่รับผิดชอบต่อความเสียหายที่เกิดจากข้อผิดพลาด ความล่าช้า หรือการหยุดชะงักของข้อมูลจากบุคคลที่สาม เว้นแต่เกิดจากเจตนาหรือความประมาทเลินเล่อของบริษัท
3. หากข้อมูลไม่ถูกต้องเนื่องจากสถานที่ปิดกิจการหรือย้ายที่ตั้ง ผู้ใช้สามารถแจ้งบริษัทผ่านฟังก์ชันแจ้งข้อผิดพลาดในบริการ และบริษัทจะปรับปรุงข้อมูลหลังจากผ่านกระบวนการตรวจสอบ

มาตรา 15 (โพสต์ ความคิดเห็น และการแจ้งข้อผิดพลาด)
1. ความรับผิดชอบต่อโพสต์ เช่น ความคิดเห็นและการแจ้งข้อผิดพลาดที่ผู้ใช้ลงทะเบียน เป็นของผู้ใช้รายนั้น
2. บริษัทอาจระงับการเผยแพร่หรือลบโพสต์โดยไม่ต้องแจ้งล่วงหน้า หากพิจารณาว่าโพสต์เข้าข่ายกรณีต่อไปนี้
   (1) กรณีที่ทำให้เสื่อมเสียชื่อเสียงหรือละเมิดสิทธิ์ของผู้อื่น
   (2) กรณีที่ขัดต่อความสงบเรียบร้อยหรือศีลธรรมอันดี หรือเกี่ยวข้องกับอาชญากรรม
   (3) กรณีที่เป็นเท็จ มีลักษณะโฆษณา หรือขัดต่อกฎหมายที่เกี่ยวข้องหรือข้อกำหนดนี้
3. บริษัทอาจใช้ความคิดเห็นและการแจ้งข้อผิดพลาดของผู้ใช้เพื่อปรับปรุงและดำเนินการบริการ และอาจเก็บรักษาในรูปแบบสถิติที่ไม่สามารถระบุตัวบุคคลได้

มาตรา 16 (การให้ข้อมูลและการลงโฆษณา)
1. บริษัทอาจเผยแพร่ประกาศที่เกี่ยวข้องกับการดำเนินงานบริการบนหน้าจอบริการ เว็บไซต์ หรือแจ้งผ่านอีเมล การแจ้งเตือนแบบพุช เป็นต้น
2. บริษัทจะส่งข้อมูลโฆษณาผ่านอีเมล ข้อความ การแจ้งเตือนแบบพุช เป็นต้น เฉพาะเมื่อได้รับความยินยอมล่วงหน้าจากผู้ใช้เท่านั้น และผู้ใช้สามารถปฏิเสธการรับข้อมูลได้ตลอดเวลา


บทที่ 4 หน้าที่ของคู่สัญญา

มาตรา 17 (หน้าที่ของบริษัท)
1. บริษัทคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้ตามกฎหมายที่เกี่ยวข้อง และจะไม่ให้หรือเปิดเผยแก่บุคคลที่สามโดยไม่ได้รับความยินยอมจากผู้ใช้ เว้นแต่หน่วยงานที่มีอำนาจตามกฎหมายร้องขอผ่านกระบวนการที่ชอบด้วยกฎหมาย
2. บริษัทจะดำเนินการเรื่องร้องเรียนและคำถามของผู้ใช้ที่เกี่ยวข้องกับบริการอย่างรวดเร็ว และหากไม่สามารถดำเนินการได้ทันที จะแจ้งเหตุผลและกำหนดเวลาให้ทราบ
3. หากผู้ใช้ได้รับความเสียหายจากเจตนาหรือความประมาทเลินเล่อของบริษัท บริษัทจะรับผิดชอบภายในขอบเขตความเสียหายตามปกติ

มาตรา 18 (หน้าที่ของผู้ใช้)
1. ผู้ใช้ต้องไม่กระทำการดังต่อไปนี้
   (1) การระบุข้อมูลเท็จหรือใช้ข้อมูลของผู้อื่นโดยมิชอบเมื่อสมัครหรือเปลี่ยนแปลงการใช้บริการ
   (2) การละเมิดลิขสิทธิ์หรือทรัพย์สินทางปัญญาของบริษัทหรือบุคคลที่สาม
   (3) การทำซ้ำ เผยแพร่ หรือใช้ข้อมูลที่ได้รับจากบริการในเชิงพาณิชย์โดยไม่ได้รับความยินยอมล่วงหน้าจากบริษัท
   (4) การขัดขวางการดำเนินงานบริการโดยเจตนาหรือก่อให้เกิดภาระต่อระบบ (รวมถึงการครอลข้อมูลผิดปกติหรือการเข้าถึงแบบอัตโนมัติ)
   (5) การทำให้ผู้อื่นเสื่อมเสียชื่อเสียง การเก็บรวบรวมข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต การโพสต์ข้อมูลลามกอนาจารหรือผิดกฎหมาย เป็นต้น
   (6) การกระทำอื่นที่ขัดต่อกฎหมายที่เกี่ยวข้องและข้อกำหนดนี้
2. สิทธิ์ทั้งหมดที่เกี่ยวข้องกับบริการ รวมถึงลิขสิทธิ์และทรัพย์สินทางปัญญาอื่น ๆ เป็นของบริษัท ผู้ใช้ได้รับเพียงสิทธิ์การใช้งานจากบริษัทเท่านั้น และไม่สามารถโอน ขาย หรือใช้เป็นหลักประกันได้
3. หากผู้ใช้ละเมิดมาตรานี้ บริษัทอาจดำเนินมาตรการต่าง ๆ เช่น การจำกัดการใช้บริการ การยกเลิกสัญญาการใช้บริการ หรือการเรียกร้องค่าเสียหาย

มาตรา 19 (การแจ้งให้ผู้ใช้ทราบ)
1. เมื่อบริษัทแจ้งให้ผู้ใช้ทราบ อาจดำเนินการผ่านการประกาศบนหน้าจอบริการ เว็บไซต์ หรืออีเมล การแจ้งเตือนแบบพุชที่ผู้ใช้ลงทะเบียนไว้
2. การแจ้งให้บุคคลทั่วไปจำนวนมากทราบ อาจใช้การประกาศบนหน้าจอบริการหรือเว็บไซต์เป็นเวลาอย่างน้อย 7 วัน แทนการแจ้งเป็นรายบุคคล

มาตรา 20 (การคุ้มครองข้อมูลส่วนบุคคล)
1. บริษัทคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้ตามกฎหมายที่เกี่ยวข้อง โดยรายละเอียดเป็นไปตามนโยบายความเป็นส่วนตัวที่บริษัทเผยแพร่แยกต่างหาก ซึ่งนโยบายความเป็นส่วนตัวถือเป็นส่วนหนึ่งของข้อกำหนดนี้
2. บริษัทจะดำเนินการตามคำขอลบ (ยกเลิกสมาชิก) ของสมาชิกภายใน 30 วันนับจากวันที่ได้รับคำขอ บริษัทจะเก็บข้อมูลไว้เป็นระยะเวลาผ่อนผัน 90 วันหลังจากคำขอลบ เพื่อเตรียมพร้อมสำหรับการกู้คืนข้อมูลหรือการเปลี่ยนใจของผู้ใช้ และเมื่อพ้นระยะเวลาผ่อนผันแล้วจะลบโปรไฟล์และข้อมูลเส้นทางที่บันทึกไว้ของผู้ใช้อย่างสมบูรณ์ อย่างไรก็ตาม ความคิดเห็นที่ผู้ใช้ลงทะเบียนไว้อาจเก็บรักษาได้เฉพาะในรูปแบบสถิติแบบไม่ระบุตัวตนเท่านั้น


บทที่ 5 การยกเลิกสัญญาและการจำกัดการใช้บริการ

มาตรา 21 (การยกเลิกสัญญาและการจำกัดการใช้บริการ)
1. ผู้ใช้สามารถยกเลิกสัญญาการใช้บริการได้ตลอดเวลาผ่านขั้นตอนการยกเลิกสมาชิกในบริการ
2. หากผู้ใช้ละเมิดหน้าที่ตามมาตรา 18 บริษัทอาจจำกัดการใช้บริการหรือยกเลิกสัญญาการใช้บริการได้ หลังจากแจ้งล่วงหน้า (หรือแจ้งภายหลังในกรณีเร่งด่วน)
3. ผู้ใช้สามารถคัดค้านมาตรการของบริษัทตามมาตรานี้ได้ตามขั้นตอนที่บริษัทกำหนด และหากบริษัทเห็นว่าคำคัดค้านมีเหตุผลอันสมควร จะกลับมาให้บริการทันที

มาตรา 22 (ห้ามโอนสิทธิ์)
ผู้ใช้ไม่สามารถโอน ให้ หรือใช้สถานะภายใต้สัญญาการใช้บริการ เช่น สิทธิ์การใช้บริการ เป็นหลักประกันแก่บุคคลอื่นได้


บทที่ 6 ค่าสินไหมทดแทนความเสียหาย เป็นต้น

มาตรา 23 (ค่าสินไหมทดแทนความเสียหาย)
1. ผู้ใช้ที่ก่อให้เกิดความเสียหายแก่บริษัทจากการละเมิดข้อกำหนดนี้ ต้องชดใช้ค่าเสียหายดังกล่าว
2. หากผู้ใช้ทำให้บริษัทได้รับความเสียหายจากการที่บุคคลที่สามเรียกร้องค่าเสียหายหรือคัดค้านที่เกี่ยวข้องกับการใช้บริการ ผู้ใช้รายนั้นต้องรับผิดชอบและเสียค่าใช้จ่ายเพื่อปลดเปลื้องความรับผิดของบริษัท

มาตรา 24 (ข้อยกเว้นความรับผิด)
1. บริษัทไม่รับผิดชอบต่ออุปสรรคในการใช้บริการที่เกิดจากภัยพิบัติทางธรรมชาติ เหตุสุดวิสัย หรือเหตุที่ไม่ได้เกิดจากความผิดของบริษัท
2. บริษัทไม่รับประกันความถูกต้องหรือความสมบูรณ์ของผลการแนะนำและข้อมูลจากบุคคลที่สามตามมาตรา 13 และมาตรา 14 และไม่รับผิดชอบต่อความเสียหายที่เกิดจากการเชื่อถือข้อมูลดังกล่าว เว้นแต่เกิดจากเจตนาหรือความประมาทเลินเล่ออย่างร้ายแรงของบริษัท
3. บริษัทไม่มีหน้าที่เข้าแทรกแซงข้อพิพาทที่เกิดขึ้นระหว่างผู้ใช้ด้วยกัน หรือระหว่างผู้ใช้กับบุคคลที่สาม (พันธมิตร ผู้ดำเนินการสถานที่ ฯลฯ) และไม่รับผิดชอบต่อความเสียหายที่เกิดขึ้นจากกรณีดังกล่าว

มาตรา 25 (กฎหมายที่ใช้บังคับและเขตอำนาจศาล)
1. ข้อพิพาทที่เกี่ยวข้องกับข้อกำหนดนี้และการใช้บริการให้ใช้กฎหมายแห่งสาธารณรัฐเกาหลีเป็นกฎหมายที่ใช้บังคับ
2. การฟ้องร้องเกี่ยวกับข้อพิพาทระหว่างบริษัทและผู้ใช้ให้ยื่นต่อศาลที่มีเขตอำนาจตามประมวลกฎหมายวิธีพิจารณาความแพ่ง
3. หากข้อกำหนดนี้จัดทำเป็นหลายภาษา และมีความแตกต่างในการตีความ ให้ยึดฉบับภาษาเกาหลีเป็นหลัก


บทเฉพาะกาล
ข้อกำหนดนี้มีผลบังคับใช้ตั้งแต่วันที่ [YYYY.MM.DD]`

const LOCATION_TH = `※ ด้านล่างนี้คือมาตรา 10 ถึงมาตรา 18 ของข้อกำหนดการใช้บริการที่อ้างอิงตำแหน่งที่ตั้ง

มาตรา 10 (สิทธิ์ของเจ้าของข้อมูลตำแหน่งที่ตั้งส่วนบุคคล)
1. ผู้ใช้สามารถถอนความยินยอมทั้งหมดหรือบางส่วนที่ให้ไว้แก่บริษัทเกี่ยวกับการให้บริการที่อ้างอิงตำแหน่งที่ตั้งโดยใช้ข้อมูลตำแหน่งที่ตั้งส่วนบุคคล และการให้ข้อมูลตำแหน่งที่ตั้งส่วนบุคคลแก่บุคคลที่สามได้ตลอดเวลา ในกรณีนี้ บริษัทจะทำลายข้อมูลตำแหน่งที่ตั้งส่วนบุคคลที่เก็บรวบรวมไว้และข้อมูลยืนยันการใช้/การให้ข้อมูลตำแหน่งที่ตั้งโดยไม่ชักช้า
2. ผู้ใช้สามารถขอให้บริษัทระงับการเก็บรวบรวม การใช้ หรือการให้ข้อมูลตำแหน่งที่ตั้งส่วนบุคคลเป็นการชั่วคราวได้ตลอดเวลา และบริษัทไม่สามารถปฏิเสธคำขอนี้ได้ โดยมีมาตรการทางเทคนิคพร้อมรองรับ
3. ผู้ใช้สามารถขอให้บริษัทเปิดเผยหรือแจ้งข้อมูลตามรายการด้านล่าง และหากข้อมูลนั้นมีข้อผิดพลาด สามารถขอให้แก้ไขได้ ในกรณีนี้ บริษัทไม่สามารถปฏิเสธคำขอของผู้ใช้โดยไม่มีเหตุผลอันสมควร
   1) ข้อมูลยืนยันการเก็บรวบรวม การใช้ และการให้ข้อมูลตำแหน่งที่ตั้งของตนเอง
   2) เหตุผลและเนื้อหาการให้ข้อมูลตำแหน่งที่ตั้งส่วนบุคคลของตนเองแก่บุคคลที่สามตามกฎหมายว่าด้วยการคุ้มครองและการใช้ข้อมูลตำแหน่งที่ตั้ง หรือกฎหมายอื่น
4. ผู้ใช้สามารถใช้สิทธิ์ตามวรรค 1 ถึงวรรค 3 ผ่านขั้นตอนที่บริษัทแนะนำ เช่น เมนูการตั้งค่าในบริการ ศูนย์บริการลูกค้า (หมายเลขโทรศัพท์หลัก) หรืออีเมล และบริษัทจะดำเนินมาตรการที่เกี่ยวข้องโดยไม่ชักช้า

มาตรา 11 (สิทธิ์ของผู้แทนโดยชอบธรรม)
1. สำหรับผู้ใช้ที่มีอายุต่ำกว่า 14 ปี บริษัทต้องได้รับความยินยอมเกี่ยวกับการให้บริการที่อ้างอิงตำแหน่งที่ตั้งโดยใช้ข้อมูลตำแหน่งที่ตั้งส่วนบุคคล และการให้ข้อมูลตำแหน่งที่ตั้งส่วนบุคคลแก่บุคคลที่สาม จากทั้งผู้ใช้และผู้แทนโดยชอบธรรมของผู้ใช้ ในกรณีนี้ บริษัทจะตรวจสอบความยินยอมของผู้แทนโดยชอบธรรมตามวิธีการที่กฎหมายกำหนด และผู้แทนโดยชอบธรรมมีสิทธิ์ทั้งหมดของผู้ใช้ตามมาตรา 10
2. หากบริษัทประสงค์จะใช้หรือให้แก่บุคคลที่สามซึ่งข้อมูลตำแหน่งที่ตั้งส่วนบุคคลของเด็กอายุต่ำกว่า 14 ปี หรือข้อมูลยืนยันการใช้/การให้ข้อมูลตำแหน่งที่ตั้ง เกินขอบเขตที่ระบุหรือแจ้งไว้ในข้อกำหนดการใช้บริการ ต้องได้รับความยินยอมจากเด็กอายุต่ำกว่า 14 ปีและผู้แทนโดยชอบธรรม ยกเว้นกรณีดังต่อไปนี้
   1) กรณีจำเป็นต้องใช้ข้อมูลยืนยันการใช้/การให้ข้อมูลตำแหน่งที่ตั้งอันเนื่องมาจากการให้บริการข้อมูลตำแหน่งที่ตั้งและบริการที่อ้างอิงตำแหน่งที่ตั้ง
   2) กรณีที่นำไปประมวลผลในรูปแบบที่ไม่สามารถระบุตัวบุคคลใดบุคคลหนึ่งได้ เพื่อจัดทำสถิติ การวิจัยทางวิชาการ หรือการสำรวจตลาด

มาตรา 12 (สิทธิ์ของผู้พิทักษ์ของเด็กอายุ 8 ปีหรือต่ำกว่า เป็นต้น)
1. หากผู้พิทักษ์ของบุคคลที่เข้าข่ายกรณีต่อไปนี้ (ต่อไปนี้เรียกว่า "เด็กอายุ 8 ปีหรือต่ำกว่า เป็นต้น") ให้ความยินยอมในการใช้หรือให้ข้อมูลตำแหน่งที่ตั้งส่วนบุคคล เพื่อคุ้มครองชีวิตหรือร่างกายของเด็กอายุ 8 ปีหรือต่ำกว่า เป็นต้น จะถือว่าบุคคลนั้นได้ให้ความยินยอมแล้ว
   1) เด็กอายุ 8 ปีหรือต่ำกว่า
   2) บุคคลไร้ความสามารถซึ่งอยู่ภายใต้การพิทักษ์
   3) บุคคลที่มีความพิการทางจิตตามมาตรา 2 วรรค 2 ข้อ 2 ของกฎหมายสวัสดิการคนพิการ และเข้าข่ายผู้พิการรุนแรงตามมาตรา 2 ข้อ 2 ของกฎหมายส่งเสริมการจ้างงานคนพิการและการฟื้นฟูอาชีพ (จำกัดเฉพาะผู้ที่ได้ขึ้นทะเบียนคนพิการตามมาตรา 32 ของกฎหมายสวัสดิการคนพิการ)
2. ผู้พิทักษ์ของเด็กอายุ 8 ปีหรือต่ำกว่า เป็นต้น ตามวรรคก่อน หมายถึงผู้ที่ดูแลเด็กนั้นตามความเป็นจริง ซึ่งเข้าข่ายกรณีต่อไปนี้
   1) ผู้แทนโดยชอบธรรมของเด็กอายุ 8 ปีหรือต่ำกว่า หรือผู้พิทักษ์ตามมาตรา 3 ของกฎหมายว่าด้วยหน้าที่การพิทักษ์ผู้เยาว์ในสถานสงเคราะห์
   2) ผู้แทนโดยชอบธรรมของบุคคลไร้ความสามารถซึ่งอยู่ภายใต้การพิทักษ์
   3) ผู้แทนโดยชอบธรรมของบุคคลตามข้อ 3 วรรค 1 ของมาตรานี้ หรือหัวหน้าสถานสงเคราะห์คนพิการตามมาตรา 58 วรรค 1 ข้อ 1 ของกฎหมายสวัสดิการคนพิการ (จำกัดเฉพาะสถานสงเคราะห์ที่รัฐหรือองค์กรปกครองส่วนท้องถิ่นจัดตั้งและดำเนินการ) หัวหน้าสถานฟื้นฟูสังคมสำหรับผู้ป่วยจิตเวชตามมาตรา 3 ข้อ 4 ของกฎหมายสุขภาพจิต (จำกัดเฉพาะสถานฟื้นฟูที่รัฐหรือองค์กรปกครองส่วนท้องถิ่นจัดตั้งและดำเนินการ) หรือหัวหน้าสถานบำบัดฟื้นฟูจิตตามข้อ 5 ของมาตราเดียวกัน
3. ผู้พิทักษ์ที่ประสงค์จะให้ความยินยอมในการใช้หรือให้ข้อมูลตำแหน่งที่ตั้งส่วนบุคคล เพื่อคุ้มครองชีวิตหรือร่างกายของเด็กอายุ 8 ปีหรือต่ำกว่า เป็นต้น ต้องยื่นหนังสือให้ความยินยอมพร้อมแนบเอกสารที่พิสูจน์ว่าตนเป็นผู้พิทักษ์แก่บริษัท
4. ผู้พิทักษ์สามารถใช้สิทธิ์ทั้งหมดของเจ้าของข้อมูลตำแหน่งที่ตั้งส่วนบุคคลได้ เมื่อให้ความยินยอมในการใช้หรือให้ข้อมูลตำแหน่งที่ตั้งส่วนบุคคลของเด็กอายุ 8 ปีหรือต่ำกว่า เป็นต้น

มาตรา 13 (ชื่อบริษัท ที่อยู่ และข้อมูลติดต่อ เป็นต้น)
1. ชื่อบริษัท ผู้แทน ที่อยู่ และข้อมูลติดต่อของบริษัทมีดังนี้
   ชื่อบริษัท: [ชื่อหน่วยงานผู้ดำเนินการหรือชื่อทีม]
   ผู้แทน: [ชื่อผู้แทน]
   ที่อยู่: [ที่อยู่]
   หมายเลขโทรศัพท์หลัก: [หมายเลขโทรศัพท์หลัก]
2. บริษัทแต่งตั้งและดำเนินการโดยมีผู้รับผิดชอบด้านการจัดการข้อมูลตำแหน่งที่ตั้ง ซึ่งอยู่ในตำแหน่งที่สามารถรับผิดชอบอย่างแท้จริงในการจัดการและคุ้มครองข้อมูลตำแหน่งที่ตั้งส่วนบุคคลอย่างเหมาะสม และจัดการข้อร้องเรียนของเจ้าของข้อมูลตำแหน่งที่ตั้งส่วนบุคคลได้อย่างราบรื่น โดยชื่อและข้อมูลติดต่อของผู้รับผิดชอบมีดังนี้
   ชื่อ: [ชื่อผู้รับผิดชอบด้านการจัดการข้อมูลตำแหน่งที่ตั้ง]
   หมายเลขโทรศัพท์หลัก: [หมายเลขโทรศัพท์หลัก]
   อีเมล: [อีเมลของผู้รับผิดชอบด้านการจัดการข้อมูลตำแหน่งที่ตั้ง]

มาตรา 14 (หน้าที่ของบริษัท)
1. บริษัทปฏิบัติตามกฎหมายว่าด้วยข้อมูลตำแหน่งที่ตั้ง กฎหมายคุ้มครองข้อมูลส่วนบุคคล และกฎหมายอื่นที่เกี่ยวข้อง เพื่อจัดการข้อมูลตำแหน่งที่ตั้งส่วนบุคคลของผู้ใช้อย่างปลอดภัย
2. บริษัทระบุและเผยแพร่ในข้อกำหนดการใช้บริการ เรื่องที่กฎหมายว่าด้วยข้อมูลตำแหน่งที่ตั้งกำหนด เช่น วัตถุประสงค์การใช้ ระยะเวลาการเก็บรักษาและการใช้ สถานะการให้ข้อมูลแก่บุคคลที่สาม ของข้อมูลตำแหน่งที่ตั้งส่วนบุคคล
3. บริษัทดำเนินการช่องทางสำหรับจัดการข้อร้องเรียนและให้คำปรึกษาแก่ผู้ใช้ ที่เกี่ยวข้องกับการเก็บรวบรวม การใช้ และการให้ข้อมูลตำแหน่งที่ตั้ง

มาตรา 15 (ห้ามโอนสิทธิ์)
สิทธิ์ในการรับบริการของผู้ใช้ไม่สามารถโอน ให้ หรือจำหน่ายเพื่อวัตถุประสงค์ในการใช้เป็นหลักประกันได้

มาตรา 16 (ค่าสินไหมทดแทนความเสียหาย)
1. หากผู้ใช้ได้รับความเสียหายจากการกระทำของบริษัทที่ละเมิดบทบัญญัติมาตรา 15 ถึงมาตรา 26 ของกฎหมายว่าด้วยข้อมูลตำแหน่งที่ตั้ง ผู้ใช้สามารถเรียกร้องค่าสินไหมทดแทนจากบริษัทได้ ในกรณีนี้ บริษัทไม่สามารถปฏิเสธความรับผิดได้ เว้นแต่จะพิสูจน์ได้ว่าไม่มีเจตนาหรือความประมาทเลินเล่อ
2. หากบริษัทได้รับความเสียหายจากการที่ผู้ใช้ละเมิดบทบัญญัติของข้อกำหนดนี้ บริษัทสามารถเรียกร้องค่าสินไหมทดแทนจากผู้ใช้ได้ ในกรณีนี้ ผู้ใช้ไม่สามารถปฏิเสธความรับผิดได้ เว้นแต่จะพิสูจน์ได้ว่าไม่มีเจตนาหรือความประมาทเลินเล่อ

มาตรา 17 (ข้อยกเว้นความรับผิด)
1. บริษัทไม่รับผิดชอบต่อความเสียหายที่เกิดขึ้นกับผู้ใช้ อันเนื่องมาจากการที่บริษัทไม่สามารถให้บริการได้ในกรณีต่อไปนี้
   1) กรณีเกิดภัยพิบัติทางธรรมชาติหรือสถานการณ์เหตุสุดวิสัยในลักษณะเดียวกัน
   2) กรณีบุคคลที่สามที่ทำสัญญาความร่วมมือด้านบริการกับบริษัทเพื่อให้บริการ ขัดขวางบริการโดยเจตนา
   3) กรณีเกิดอุปสรรคในการใช้บริการอันเนื่องมาจากความผิดของผู้ใช้
   4) กรณีอื่นนอกเหนือจากข้อ 1 ถึงข้อ 3 ที่ไม่ได้เกิดจากเจตนาหรือความประมาทเลินเล่อของบริษัท
2. บริษัทไม่รับประกันความน่าเชื่อถือ ความถูกต้องของบริการและข้อมูล เอกสาร หรือข้อเท็จจริงที่เผยแพร่ในบริการ และไม่รับผิดชอบต่อความเสียหายของผู้ใช้ที่เกิดขึ้นจากกรณีดังกล่าว

มาตรา 18 (การไกล่เกลี่ยข้อพิพาทและเรื่องอื่น ๆ)
1. หากเกิดข้อพิพาทระหว่างบริษัทและผู้ใช้ที่เกี่ยวข้องกับการใช้บริการ บริษัทจะเจรจากับผู้ใช้ด้วยความสุจริตใจเพื่อแก้ไขข้อพิพาท
2. หากไม่สามารถแก้ไขข้อพิพาทได้จากการเจรจาตามวรรคก่อน บริษัทและผู้ใช้สามารถยื่นคำร้องขอคำวินิจฉัยต่อคณะกรรมการกิจการกระจายเสียงและโทรคมนาคมตามมาตรา 28 ของกฎหมายว่าด้วยข้อมูลตำแหน่งที่ตั้ง หรือยื่นคำร้องขอคำวินิจฉัยหรือการไกล่เกลี่ยข้อพิพาทต่อคณะกรรมการกิจการกระจายเสียงและโทรคมนาคมหรือคณะกรรมการไกล่เกลี่ยข้อพิพาทด้านข้อมูลส่วนบุคคลตามมาตรา 43 ของกฎหมายคุ้มครองข้อมูลส่วนบุคคล
3. หากยังไม่สามารถแก้ไขข้อพิพาทได้ตามวรรคก่อน ทั้งบริษัทและผู้ใช้สามารถยื่นฟ้องต่อศาลที่มีเขตอำนาจตามประมวลกฎหมายวิธีพิจารณาความแพ่งได้`

const PRIVACY_TH = `[จำเป็น] ความยินยอมในการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคล (FAN:GO)

1. รายการข้อมูลส่วนบุคคลที่เก็บรวบรวม

① รายการที่เก็บรวบรวมเมื่อสมัครสมาชิก (จำเป็น)
- อีเมล (ไอดี) รหัสผ่าน ชื่อเล่น สัญชาติ ภาษา แฟนด้อม ศิลปินที่ชื่นชอบ (สมาชิกที่สนใจ)
- [ต้องพิจารณา] เมื่อเปิดใช้งานการเข้าสู่ระบบผ่านโซเชียล: ต้องตรวจสอบว่าจะเพิ่มตัวระบุสมาชิก (เช่น ไอดีบัญชีเฉพาะ) ที่ได้รับจากผู้ให้บริการนั้น ๆ หรือไม่

② รายการที่สร้างและเก็บรวบรวมระหว่างการใช้บริการ
- เส้นทางที่แนะนำซึ่งผู้ใช้สร้างและบันทึกไว้ และประวัติการใช้งาน
- ความคิดเห็นและเนื้อหาการแจ้งข้อผิดพลาดของสถานที่ที่ผู้ใช้ลงทะเบียน

③ รายการที่เก็บรวบรวมโดยอัตโนมัติ (ใช้ร่วมกันทั้งแอปและเว็บ) [ต้องพิจารณา]
- ประวัติการใช้บริการ บันทึกการเข้าถึง คุกกี้ ที่อยู่ IP ที่เข้าถึง ข้อมูลอุปกรณ์
- (เมื่อใช้การแจ้งเตือนแบบพุชของแอป) โทเค็นการแจ้งเตือนแบบพุช
- ※ ต้องยืนยันขอบเขตและการเก็บรวบรวมรายการข้างต้นจริงหลังจากยืนยันการดำเนินการแล้ว


2. วัตถุประสงค์ในการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคล

- การระบุตัวสมาชิกและยืนยันความประสงค์ในการสมัคร
- การให้บริการแนะนำสถานที่และเส้นทาง (การจับคู่) โดยอ้างอิงจากข้อมูลศิลปินและแฟนด้อมที่สนใจ
- การจัดการความคิดเห็นและการแจ้งข้อผิดพลาดของผู้ใช้ และการปรับปรุงคุณภาพบริการ
- การสื่อสารเกี่ยวกับการดำเนินงานบริการ เช่น การแจ้งประกาศ การตอบข้อสงสัย เป็นต้น


3. ระยะเวลาการเก็บรักษาและการใช้ข้อมูลส่วนบุคคล

- เก็บรักษาและใช้จนกว่าจะบรรลุวัตถุประสงค์ในการเก็บรวบรวมและใช้ หรือจนกว่าสมาชิกจะยกเลิกสมาชิกภาพ
- เมื่อสมาชิกร้องขอการยกเลิกสมาชิก (การลบข้อมูล): จะดำเนินการภายใน 30 วันนับจากวันที่ได้รับคำขอ โดยจะมีระยะเวลาผ่อนผันในการเก็บรักษา 90 วันหลังจากคำขอลบ เพื่อเตรียมพร้อมสำหรับการกู้คืนข้อมูลหรือการเปลี่ยนใจ และจะลบโปรไฟล์และข้อมูลเส้นทางที่บันทึกไว้อย่างสมบูรณ์หลังจากพ้นระยะเวลาผ่อนผัน อย่างไรก็ตาม ความคิดเห็นอาจเก็บรักษาได้เฉพาะในรูปแบบสถิติแบบไม่ระบุตัวตนเท่านั้น
- แม้จะมีเกณฑ์ข้างต้น หากกฎหมายที่เกี่ยวข้องกำหนดหน้าที่การเก็บรักษาแยกต่างหาก จะเก็บรักษาตามระยะเวลาดังกล่าว


※ ท่านมีสิทธิ์ปฏิเสธความยินยอมในการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลข้างต้น อย่างไรก็ตาม หากปฏิเสธความยินยอมในรายการที่จำเป็น การสมัครสมาชิกและการใช้บริการอาจถูกจำกัด`

const TERMS_ID = `Bab 1 Ketentuan Umum

Pasal 1 (Tujuan)
Syarat dan Ketentuan ini bertujuan untuk mengatur hak, kewajiban, tanggung jawab, syarat, dan prosedur penggunaan yang diperlukan antara pengguna dan [Nama Perusahaan] ("Perusahaan") sehubungan dengan penggunaan layanan "FAN:GO" (aplikasi dan web, "Layanan") yang disediakan oleh Perusahaan.

Pasal 2 (Keberlakuan dan Perubahan Syarat dan Ketentuan)
1. Syarat dan Ketentuan ini berlaku sejak Perusahaan mengumumkannya di layar Layanan atau situs web terkait, dan pengguna yang menyetujuinya mendaftar untuk Layanan.
2. Perusahaan dapat mengubah Syarat dan Ketentuan ini selama tidak melanggar hukum yang berlaku. Jika ada perubahan, Perusahaan akan mengumumkan tanggal berlaku dan alasan perubahan setidaknya 7 hari sebelum tanggal berlaku sesuai metode pada Pasal 19. Namun, untuk perubahan yang merugikan atau bersifat material bagi pengguna, pengumuman akan dilakukan setidaknya 30 hari sebelumnya.
3. Jika Perusahaan mengumumkan perubahan Syarat dan Ketentuan sesuai ayat sebelumnya dan sekaligus memberi tahu bahwa "jika tidak menyatakan penolakan sampai tanggal berlaku, dianggap telah menyetujui," dan pengguna tidak secara tegas menyatakan penolakan, maka pengguna dianggap telah menyetujui perubahan tersebut.
4. Pengguna yang tidak menyetujui Syarat dan Ketentuan yang telah diubah dapat menghentikan penggunaan Layanan dan mengakhiri perjanjian penggunaan.

Pasal 3 (Aturan di Luar Syarat dan Ketentuan Ini)
Hal-hal yang tidak diatur secara tegas dalam Syarat dan Ketentuan ini tunduk pada Undang-Undang Perlindungan Informasi Pribadi, Undang-Undang Promosi Pemanfaatan Jaringan Informasi dan Komunikasi serta Perlindungan Informasi, Undang-Undang Perlindungan dan Pemanfaatan Informasi Lokasi, Undang-Undang Promosi Industri Konten, Undang-Undang Hak Cipta, dan hukum terkait lainnya, serta pedoman penggunaan rinci yang ditetapkan oleh Perusahaan.

Pasal 4 (Definisi Istilah)
Definisi istilah yang digunakan dalam Syarat dan Ketentuan ini adalah sebagai berikut.
1. "Layanan" berarti aplikasi dan web FAN:GO yang disediakan oleh Perusahaan, yang merekomendasikan tempat terkait (POI) dan rute perjalanan serta menyediakan informasi terkait berdasarkan informasi artis dan fandom yang diminati pengguna.
2. "Pengguna" berarti orang yang menggunakan Layanan berdasarkan Syarat dan Ketentuan ini.
3. "Anggota" berarti orang yang telah menyetujui Syarat dan Ketentuan ini, mendaftarkan informasi yang diminta Perusahaan, disetujui untuk bergabung, dan menggunakan Layanan.
4. "Rute (hasil rekomendasi)" berarti hasil rekomendasi jadwal perjalanan, rute, dan tempat yang dihasilkan dan disediakan oleh mesin rekomendasi Perusahaan berdasarkan informasi yang dimasukkan pengguna dan data tempat.
5. "Tempat (POI)" berarti informasi lokasi seperti tempat ziarah, kafe, tempat pertunjukan, toko merchandise, dan toko pop-up yang direkomendasikan atau dipandu oleh Layanan.
6. "Postingan" berarti semua informasi yang didaftarkan pengguna dalam Layanan, termasuk umpan balik dan laporan kesalahan tempat (tutup, pindah, dll).
7. "Mitra" berarti pelaku usaha yang telah menandatangani perjanjian kemitraan dengan Perusahaan untuk menyediakan informasi terkait ke Layanan atau menjalankan bisnis melalui Layanan.


Bab 2 Perjanjian Penggunaan

Pasal 5 (Pembentukan Perjanjian Penggunaan)
1. Perjanjian penggunaan terbentuk ketika pengguna memilih "Setuju" pada Syarat dan Ketentuan ini di aplikasi atau web dan mengajukan pendaftaran keanggotaan, dan Perusahaan menerima permohonan tersebut.
2. Layanan disediakan sepenuhnya secara gratis.

Pasal 6 (Permohonan Penggunaan dan Pendaftaran Keanggotaan)
1. Permohonan penggunaan dilakukan dengan pengguna memasukkan informasi yang diperlukan sesuai prosedur pendaftaran yang ditetapkan Perusahaan, serta menyetujui Syarat dan Ketentuan ini dan pengumpulan/penggunaan informasi pribadi.
2. Item yang dikumpulkan Perusahaan saat pendaftaran keanggotaan dibatasi pada cakupan minimum yang diperlukan untuk penyediaan Layanan (rekomendasi), termasuk email, nama panggilan, kebangsaan, bahasa, fandom, dan idola (anggota yang diminati). Pengumpulan, penggunaan, dan penyimpanan secara rinci tunduk pada Kebijakan Privasi Perusahaan.
3. Pendaftaran keanggotaan hanya dapat dilakukan oleh orang berusia 14 tahun ke atas, dan Perusahaan membatasi pendaftaran keanggotaan anak di bawah usia 14 tahun.

Pasal 7 (Penerimaan Permohonan Penggunaan)
1. Perusahaan menerima permohonan penggunaan yang sah berdasarkan Pasal 6.
2. Perusahaan menyediakan Layanan sejak saat pendaftaran keanggotaan selesai.

Pasal 8 (Pembatasan Penerimaan Permohonan Penggunaan)
Perusahaan dapat tidak menerima, atau kemudian mengakhiri perjanjian penggunaan untuk, permohonan yang termasuk dalam salah satu kondisi berikut.
1. Penyalahgunaan informasi orang lain atau terdapat pernyataan palsu dalam informasi pendaftaran
2. Perusahaan tidak dapat menyediakan Layanan karena alasan bisnis atau teknis
3. Prosedur pendaftaran atau persetujuan yang ditetapkan Perusahaan belum diselesaikan
4. Pengguna sebelumnya kehilangan kelayakan untuk menggunakan Layanan karena pelanggaran kewajiban pengguna berdasarkan Pasal 18
5. Permohonan lain yang melanggar hukum atau tidak pantas, atau kasus di mana Perusahaan tidak dapat menerima permohonan karena kesalahan yang dapat diatribusikan kepada pengguna


Bab 3 Penggunaan Layanan

Pasal 9 (Isi Layanan)
Perusahaan menyediakan layanan berikut kepada pengguna.
1. Layanan rekomendasi otomatis rute perjalanan (jadwal dan rute) berdasarkan artis dan fandom yang diminati
2. Layanan rekomendasi tempat terkait (POI) dan penyediaan informasi detail tempat
3. Layanan penyediaan informasi acara seperti pertunjukan, kafe ulang tahun, pop-up, dan merchandise
4. Layanan panduan multibahasa
5. Layanan penerimaan umpan balik pengguna dan laporan kesalahan tempat
6. Layanan tambahan lain yang dinilai Perusahaan sesuai dengan tujuan Layanan

Pasal 10 (Dimulainya Penggunaan Layanan)
1. Perusahaan mulai menyediakan Layanan sejak pengguna menyelesaikan pendaftaran keanggotaan.
2. Jika Perusahaan tidak dapat memulai penyediaan Layanan karena hambatan bisnis atau teknis, Perusahaan akan mengumumkan alasannya di layar Layanan atau memberi tahu pengguna.

Pasal 11 (Jam Penggunaan Layanan)
1. Layanan pada dasarnya tersedia 24 jam sehari sepanjang tahun.
2. Namun, Layanan dapat dihentikan sementara karena pemeliharaan sistem, gangguan jaringan, gangguan data atau API eksternal, dan sebab lainnya. Perusahaan pada prinsipnya akan memberi tahu sebelumnya, tetapi dalam keadaan mendesak atau tidak dapat dihindari, pemberitahuan akan dilakukan segera setelahnya.

Pasal 12 (Perubahan dan Penghentian Layanan)
1. Perusahaan dapat mengubah isi Layanan dan menyediakannya sebagaimana diubah. Jika diubah, Perusahaan akan mengumumkan isi dan tanggal penyediaan sesuai metode pada Pasal 19.
2. Perusahaan dapat membatasi atau menghentikan seluruh atau sebagian Layanan dalam kondisi berikut.
   (1) Keadaan yang tidak dapat dihindari seperti perbaikan atau pemeriksaan peralatan
   (2) Penyediaan normal sulit dilakukan karena pemadaman listrik, gangguan peralatan, lonjakan penggunaan, dll
   (3) Berbagai keadaan Perusahaan seperti berakhirnya perjanjian dengan mitra atau penyedia data eksternal
   (4) Keadaan kahar seperti bencana alam atau keadaan darurat nasional
3. Perusahaan tidak bertanggung jawab atas masalah yang timbul dari perubahan atau penghentian berdasarkan Pasal ini, kecuali disebabkan oleh kesengajaan atau kelalaian Perusahaan.

Pasal 13 (Sifat dan Keterbatasan Hasil Rekomendasi)
1. Hasil rekomendasi rute dan tempat yang disediakan Layanan adalah informasi referensi untuk kenyamanan pengguna, dan Perusahaan tidak menjamin keakuratan, kesesuaian, atau kecocokan hasil rekomendasi dengan tujuan tertentu.
2. Karena hasil rekomendasi dihasilkan secara otomatis berdasarkan algoritma AI dan data eksternal, hasil tersebut dapat berbeda dari kondisi aktual di lapangan. Pengguna harus memeriksa sendiri sebelum berkunjung, seperti status buka/tutup, jam operasional, dan syarat masuk.
3. Perusahaan tidak bertanggung jawab atas kerugian perjalanan, biaya, atau waktu yang timbul dari kepercayaan pengguna terhadap hasil rekomendasi, kecuali disebabkan oleh kesengajaan atau kelalaian berat Perusahaan.

Pasal 14 (Keakuratan Informasi Tempat dan Data Pihak Ketiga)
1. Layanan menyediakan informasi tempat dan acara menggunakan data publik dan API pihak ketiga (misalnya peta, pariwisata, data publik real-time, dll), dan hak cipta asli serta hak atas informasi tersebut dimiliki oleh masing-masing penyedia.
2. Perusahaan tidak menjamin keakuratan, kekinian, atau kesinambungan data yang disediakan pihak ketiga, dan tidak bertanggung jawab atas kerugian yang timbul dari kesalahan, keterlambatan, atau gangguan data pihak ketiga, kecuali disebabkan oleh kesengajaan atau kelalaian Perusahaan.
3. Jika informasi tidak akurat karena tempat tutup, pindah, dll, pengguna dapat memberi tahu Perusahaan melalui fitur laporan kesalahan dalam Layanan, dan Perusahaan akan memperbarui informasi tersebut setelah melalui proses verifikasi.

Pasal 15 (Postingan, Umpan Balik, dan Laporan Kesalahan)
1. Tanggung jawab atas postingan yang didaftarkan pengguna, seperti umpan balik dan laporan kesalahan, berada pada pengguna yang bersangkutan.
2. Perusahaan dapat menghentikan penayangan atau menghapus postingan tanpa pemberitahuan sebelumnya jika dinilai termasuk dalam kondisi berikut.
   (1) Mencemarkan nama baik orang lain atau melanggar haknya
   (2) Bertentangan dengan ketertiban umum atau kesusilaan, atau terkait dengan tindak pidana
   (3) Palsu, bersifat iklan, atau melanggar hukum terkait lainnya atau Syarat dan Ketentuan ini
3. Perusahaan dapat memanfaatkan umpan balik dan laporan kesalahan pengguna untuk peningkatan dan pengoperasian Layanan, dan dapat menyimpannya dalam bentuk statistik yang tidak dapat mengidentifikasi individu.

Pasal 16 (Penyediaan Informasi dan Pemasangan Iklan)
1. Perusahaan dapat memasang pemberitahuan terkait pengoperasian Layanan di layar Layanan/situs web, atau memberi tahu melalui email, notifikasi push, dll.
2. Perusahaan hanya dapat mengirimkan informasi promosi melalui email, SMS, notifikasi push, dll jika telah memperoleh persetujuan sebelumnya dari pengguna, dan pengguna dapat menolak penerimaan kapan saja.


Bab 4 Kewajiban Para Pihak

Pasal 17 (Kewajiban Perusahaan)
1. Perusahaan melindungi informasi pribadi pengguna sesuai hukum yang berlaku, dan tidak memberikan atau membocorkannya kepada pihak ketiga tanpa persetujuan pengguna. Namun, dikecualikan jika lembaga berwenang memintanya melalui prosedur yang sah sesuai hukum.
2. Perusahaan segera menangani keluhan dan pertanyaan pengguna terkait Layanan, dan jika penanganan segera sulit dilakukan, akan memberi tahu alasan dan jadwalnya.
3. Jika pengguna mengalami kerugian akibat kesengajaan atau kelalaian Perusahaan, Perusahaan bertanggung jawab dalam batas kerugian yang wajar.

Pasal 18 (Kewajiban Pengguna)
1. Pengguna tidak boleh melakukan tindakan berikut.
   (1) Memberikan informasi palsu atau menggunakan informasi orang lain secara tidak sah saat mendaftar atau mengubah penggunaan
   (2) Melanggar hak cipta atau kekayaan intelektual lainnya milik Perusahaan atau pihak ketiga
   (3) Menyalin, mendistribusikan, atau menggunakan secara komersial informasi yang diperoleh melalui Layanan tanpa persetujuan sebelumnya dari Perusahaan
   (4) Dengan sengaja mengganggu pengoperasian Layanan atau membebani sistem (termasuk crawling abnormal atau akses otomatis)
   (5) Mencemarkan nama baik orang lain, mengumpulkan informasi pribadi tanpa izin, memposting informasi cabul atau ilegal, dll
   (6) Tindakan lain yang melanggar hukum terkait dan Syarat dan Ketentuan ini
2. Semua hak terkait Layanan, termasuk hak cipta dan kekayaan intelektual lainnya, dimiliki oleh Perusahaan. Pengguna hanya diberikan hak penggunaan oleh Perusahaan dan tidak dapat mengalihkan, menjual, atau menjadikannya jaminan.
3. Jika pengguna melanggar Pasal ini, Perusahaan dapat mengambil tindakan seperti pembatasan penggunaan, pengakhiran perjanjian penggunaan, atau tuntutan ganti rugi.

Pasal 19 (Pemberitahuan kepada Pengguna)
1. Saat memberi tahu pengguna, Perusahaan dapat menggunakan metode seperti pengumuman di layar Layanan/situs web, atau email/notifikasi push yang didaftarkan pengguna.
2. Pemberitahuan kepada khalayak umum yang tidak spesifik dapat digantikan dengan pemberitahuan individual melalui pengumuman di layar Layanan atau situs web selama 7 hari atau lebih.

Pasal 20 (Perlindungan Informasi Pribadi)
1. Perusahaan melindungi informasi pribadi pengguna sesuai hukum yang berlaku, dan hal-hal rinci tunduk pada Kebijakan Privasi yang diumumkan secara terpisah oleh Perusahaan. Kebijakan Privasi merupakan bagian dari Syarat dan Ketentuan ini.
2. Perusahaan memproses permintaan penghapusan (penarikan diri) anggota dalam waktu 30 hari sejak tanggal permintaan diterima. Perusahaan menetapkan masa tenggang penyimpanan 90 hari setelah permintaan penghapusan, untuk mengantisipasi pemulihan data dan perubahan pikiran pengguna, dan setelah masa tenggang berakhir, profil pengguna serta informasi rute yang disimpan akan dihapus sepenuhnya. Namun, umpan balik yang didaftarkan pengguna hanya dapat disimpan dalam bentuk statistik anonim yang tidak dapat mengidentifikasi individu.


Bab 5 Pengakhiran Perjanjian dan Pembatasan Penggunaan

Pasal 21 (Pengakhiran Perjanjian dan Pembatasan Penggunaan)
1. Pengguna dapat mengakhiri perjanjian penggunaan kapan saja melalui prosedur penarikan diri dalam Layanan.
2. Jika pengguna melanggar kewajiban berdasarkan Pasal 18, Perusahaan dapat membatasi penggunaan atau mengakhiri perjanjian penggunaan setelah pemberitahuan sebelumnya (atau pemberitahuan setelahnya dalam keadaan mendesak).
3. Pengguna dapat mengajukan keberatan atas tindakan Perusahaan berdasarkan Pasal ini sesuai prosedur yang ditetapkan Perusahaan, dan jika Perusahaan mengakui keberatan tersebut sah, penggunaan akan segera dipulihkan.

Pasal 22 (Larangan Pengalihan)
Pengguna tidak dapat mengalihkan atau menghibahkan status di bawah perjanjian penggunaan, seperti hak untuk menggunakan Layanan, kepada orang lain, atau menjadikannya jaminan.


Bab 6 Ganti Rugi, dll

Pasal 23 (Ganti Rugi)
1. Pengguna yang menyebabkan kerugian bagi Perusahaan akibat pelanggaran Syarat dan Ketentuan ini harus mengganti kerugian tersebut.
2. Jika pengguna menyebabkan Perusahaan menerima tuntutan ganti rugi atau keberatan lain dari pihak ketiga sehubungan dengan penggunaan Layanan, dan Perusahaan mengalami kerugian akibatnya, pengguna yang bersangkutan harus membebaskan Perusahaan dari tanggung jawab dengan biaya dan tanggung jawabnya sendiri.

Pasal 24 (Penafian)
1. Perusahaan tidak bertanggung jawab atas gangguan penggunaan Layanan yang timbul akibat bencana alam, keadaan kahar, atau sebab lain yang tidak dapat diatribusikan kepada Perusahaan.
2. Perusahaan tidak menjamin keakuratan atau kelengkapan hasil rekomendasi dan data pihak ketiga berdasarkan Pasal 13 dan Pasal 14, dan tidak bertanggung jawab atas kerugian yang timbul dari kepercayaan terhadapnya, kecuali disebabkan oleh kesengajaan atau kelalaian berat Perusahaan.
3. Perusahaan tidak berkewajiban untuk turut campur dalam sengketa yang timbul antar pengguna, atau antara pengguna dan pihak ketiga (mitra, operator tempat, dll), dan tidak bertanggung jawab untuk mengganti kerugian yang timbul darinya.

Pasal 25 (Hukum yang Mengatur dan Yurisdiksi)
1. Sengketa terkait Syarat dan Ketentuan ini dan penggunaan Layanan tunduk pada hukum Republik Korea sebagai hukum yang mengatur.
2. Gugatan mengenai sengketa antara Perusahaan dan pengguna diajukan ke pengadilan yang berwenang berdasarkan Undang-Undang Acara Perdata.
3. Jika Syarat dan Ketentuan ini disediakan dalam beberapa bahasa, versi bahasa Korea berlaku jika terdapat perbedaan dalam penafsiran.


Ketentuan Tambahan
Syarat dan Ketentuan ini berlaku efektif sejak [YYYY.MM.DD].`

const LOCATION_ID = `※ Berikut ini adalah Pasal 10 sampai Pasal 18 dari Syarat Penggunaan Layanan Berbasis Lokasi.

Pasal 10 (Hak Subjek Informasi Lokasi Pribadi)
1. Pengguna dapat sewaktu-waktu menarik seluruh atau sebagian persetujuannya kepada Perusahaan atas penyediaan layanan berbasis lokasi menggunakan informasi lokasi pribadi dan pemberian informasi lokasi pribadi kepada pihak ketiga. Dalam hal ini, Perusahaan akan segera memusnahkan informasi lokasi pribadi yang telah dikumpulkan serta data konfirmasi penggunaan/pemberian informasi lokasi.
2. Pengguna dapat sewaktu-waktu meminta Perusahaan untuk menghentikan sementara pengumpulan, penggunaan, atau pemberian informasi lokasi pribadi, dan Perusahaan tidak dapat menolak permintaan tersebut serta telah memiliki sarana teknis untuk itu.
3. Pengguna dapat meminta akses atau pemberitahuan atas data berikut kepada Perusahaan, dan jika terdapat kesalahan pada data tersebut, dapat meminta koreksi. Dalam hal ini, Perusahaan tidak dapat menolak permintaan pengguna tanpa alasan yang sah.
   1) Data konfirmasi pengumpulan, penggunaan, dan pemberian informasi lokasi milik sendiri
   2) Alasan dan isi pemberian informasi lokasi pribadi milik sendiri kepada pihak ketiga berdasarkan Undang-Undang Perlindungan dan Pemanfaatan Informasi Lokasi atau undang-undang lain
4. Pengguna dapat melaksanakan hak berdasarkan ayat 1 hingga 3 melalui prosedur yang dipandu Perusahaan, seperti menu pengaturan dalam Layanan, pusat layanan pelanggan (nomor telepon utama), atau email, dan Perusahaan akan segera mengambil tindakan terkait.

Pasal 11 (Hak Perwakilan Hukum)
1. Untuk pengguna di bawah usia 14 tahun, Perusahaan harus memperoleh persetujuan atas penyediaan layanan berbasis lokasi menggunakan informasi lokasi pribadi dan pemberian informasi lokasi pribadi kepada pihak ketiga, dari pengguna tersebut dan perwakilan hukumnya. Dalam hal ini, Perusahaan memverifikasi persetujuan perwakilan hukum sesuai metode yang ditentukan hukum yang berlaku, dan perwakilan hukum memiliki semua hak pengguna berdasarkan Pasal 10.
2. Jika Perusahaan bermaksud menggunakan atau memberikan kepada pihak ketiga informasi lokasi pribadi anak di bawah usia 14 tahun, atau data konfirmasi penggunaan/pemberian informasi lokasi, melebihi cakupan yang dinyatakan atau diberitahukan dalam syarat penggunaan, Perusahaan harus memperoleh persetujuan dari anak di bawah usia 14 tahun tersebut dan perwakilan hukumnya. Namun, dikecualikan dalam kasus berikut.
   1) Kasus di mana data konfirmasi penggunaan/pemberian informasi lokasi diperlukan sehubungan dengan penyediaan informasi lokasi dan layanan berbasis lokasi
   2) Kasus di mana informasi diproses dan disediakan dalam bentuk yang tidak dapat mengidentifikasi individu tertentu, untuk keperluan penyusunan statistik, penelitian akademis, atau riset pasar

Pasal 12 (Hak Wali dari Anak Usia 8 Tahun ke Bawah, dll)
1. Jika wali dari orang yang termasuk dalam salah satu kategori berikut (selanjutnya "anak usia 8 tahun ke bawah, dll") menyetujui penggunaan atau pemberian informasi lokasi pribadi untuk melindungi nyawa atau tubuh anak usia 8 tahun ke bawah, dll, maka orang tersebut dianggap telah memberikan persetujuannya sendiri.
   1) Anak usia 8 tahun ke bawah
   2) Orang di bawah perwalian karena tidak cakap hukum
   3) Orang dengan disabilitas mental berdasarkan Pasal 2 ayat 2 butir 2 Undang-Undang Kesejahteraan Penyandang Disabilitas, yang termasuk penyandang disabilitas berat berdasarkan Pasal 2 butir 2 Undang-Undang Promosi Pekerjaan dan Rehabilitasi Vokasional Penyandang Disabilitas (terbatas pada orang yang telah terdaftar sebagai penyandang disabilitas berdasarkan Pasal 32 Undang-Undang Kesejahteraan Penyandang Disabilitas)
2. Wali dari anak usia 8 tahun ke bawah, dll berdasarkan ayat sebelumnya berarti orang yang secara nyata melindungi anak tersebut, yaitu yang termasuk dalam salah satu kategori berikut.
   1) Perwakilan hukum anak usia 8 tahun ke bawah, atau wali berdasarkan Pasal 3 Undang-Undang tentang Tugas Perwalian Anak di Bawah Umur di Fasilitas Perlindungan
   2) Perwakilan hukum orang di bawah perwalian karena tidak cakap hukum
   3) Perwakilan hukum orang berdasarkan Pasal ini ayat 1 butir 3, atau kepala fasilitas tempat tinggal penyandang disabilitas berdasarkan Pasal 58 ayat 1 butir 1 Undang-Undang Kesejahteraan Penyandang Disabilitas (terbatas pada fasilitas yang didirikan dan dioperasikan oleh negara atau pemerintah daerah), kepala fasilitas rehabilitasi sosial bagi penderita gangguan jiwa berdasarkan Pasal 3 butir 4 Undang-Undang Kesehatan Jiwa (terbatas pada fasilitas yang didirikan dan dioperasikan oleh negara atau pemerintah daerah), atau kepala fasilitas perawatan jiwa berdasarkan butir 5 pasal yang sama
3. Wali yang bermaksud menyetujui penggunaan atau pemberian informasi lokasi pribadi untuk melindungi nyawa atau tubuh anak usia 8 tahun ke bawah, dll, harus menyerahkan surat persetujuan tertulis kepada Perusahaan disertai dokumen yang membuktikan bahwa dirinya adalah wali.
4. Wali dapat melaksanakan seluruh hak subjek informasi lokasi pribadi ketika menyetujui penggunaan atau pemberian informasi lokasi pribadi anak usia 8 tahun ke bawah, dll.

Pasal 13 (Nama Perusahaan, Alamat, dan Kontak, dll)
1. Nama, perwakilan, alamat, dan kontak Perusahaan adalah sebagai berikut.
   Nama: [Nama badan usaha atau tim penyelenggara]
   Perwakilan: [Nama perwakilan]
   Alamat: [Alamat]
   Nomor telepon utama: [Nomor telepon utama]
2. Perusahaan menunjuk dan mengoperasikan Penanggung Jawab Pengelolaan Informasi Lokasi, yaitu orang yang berada pada posisi yang dapat bertanggung jawab secara substansial untuk mengelola dan melindungi informasi lokasi pribadi secara tepat serta menangani keluhan subjek informasi lokasi pribadi dengan lancar. Nama dan kontak Penanggung Jawab Pengelolaan Informasi Lokasi adalah sebagai berikut.
   Nama: [Nama Penanggung Jawab Pengelolaan Informasi Lokasi]
   Nomor telepon utama: [Nomor telepon utama]
   Alamat email: [Email Penanggung Jawab Pengelolaan Informasi Lokasi]

Pasal 14 (Kewajiban Perusahaan)
1. Perusahaan mengelola informasi lokasi pribadi pengguna dengan aman sesuai dengan Undang-Undang Informasi Lokasi, Undang-Undang Perlindungan Informasi Pribadi, dan hukum terkait lainnya.
2. Perusahaan menyatakan dan mengumumkan dalam syarat penggunaan hal-hal yang ditentukan Undang-Undang Informasi Lokasi, seperti tujuan penggunaan, periode penyimpanan dan penggunaan, serta status pemberian kepada pihak ketiga atas informasi lokasi pribadi.
3. Perusahaan mengoperasikan saluran untuk penanganan keluhan dan konsultasi pengguna terkait pengumpulan, penggunaan, dan pemberian informasi lokasi.

Pasal 15 (Larangan Pengalihan)
Hak pengguna untuk menerima Layanan tidak dapat dialihkan atau dihibahkan, atau dilepaskan untuk tujuan seperti menjadikannya jaminan.

Pasal 16 (Ganti Rugi)
1. Jika pengguna mengalami kerugian akibat tindakan Perusahaan yang melanggar ketentuan Pasal 15 hingga Pasal 26 Undang-Undang Informasi Lokasi, pengguna dapat menuntut ganti rugi kepada Perusahaan. Dalam hal ini, Perusahaan tidak dapat dibebaskan dari tanggung jawab kecuali dapat membuktikan tidak ada kesengajaan atau kelalaian.
2. Jika Perusahaan mengalami kerugian akibat pelanggaran ketentuan Syarat dan Ketentuan ini oleh pengguna, Perusahaan dapat menuntut ganti rugi kepada pengguna. Dalam hal ini, pengguna tidak dapat dibebaskan dari tanggung jawab kecuali dapat membuktikan tidak ada kesengajaan atau kelalaian.

Pasal 17 (Penafian)
1. Perusahaan tidak bertanggung jawab atas kerugian yang timbul pada pengguna akibat Perusahaan tidak dapat menyediakan Layanan dalam kondisi berikut.
   1) Terdapat bencana alam atau keadaan kahar yang setara
   2) Terdapat gangguan yang disengaja terhadap Layanan oleh pihak ketiga yang telah menandatangani perjanjian kemitraan layanan dengan Perusahaan untuk penyediaan Layanan
   3) Terdapat hambatan dalam penggunaan Layanan akibat kesalahan yang dapat diatribusikan kepada pengguna
   4) Sebab lain di luar butir 1 hingga 3 yang tidak disebabkan oleh kesengajaan atau kelalaian Perusahaan
2. Perusahaan tidak menjamin keandalan atau keakuratan Layanan serta informasi, materi, dan fakta yang dimuat dalam Layanan, dan tidak bertanggung jawab atas kerugian pengguna yang timbul akibatnya.

Pasal 18 (Mediasi Sengketa dan Hal Lainnya)
1. Jika terjadi sengketa antara Perusahaan dan pengguna sehubungan dengan penggunaan Layanan, Perusahaan akan berunding dengan itikad baik bersama pengguna untuk menyelesaikan sengketa.
2. Jika sengketa tidak terselesaikan melalui perundingan berdasarkan ayat sebelumnya, Perusahaan dan pengguna dapat mengajukan permohonan keputusan kepada Komisi Komunikasi Penyiaran berdasarkan Pasal 28 Undang-Undang Informasi Lokasi, atau mengajukan permohonan keputusan atau mediasi sengketa kepada Komisi Komunikasi Penyiaran atau Komite Mediasi Sengketa Informasi Pribadi berdasarkan Pasal 43 Undang-Undang Perlindungan Informasi Pribadi.
3. Jika sengketa masih belum terselesaikan berdasarkan ayat sebelumnya, baik Perusahaan maupun pengguna dapat mengajukan gugatan ke pengadilan yang berwenang berdasarkan Undang-Undang Acara Perdata.`

const PRIVACY_ID = `[Wajib] Persetujuan Pengumpulan dan Penggunaan Informasi Pribadi (FAN:GO)

1. Item Informasi Pribadi yang Dikumpulkan

① Item yang dikumpulkan saat pendaftaran keanggotaan (wajib)
- Email (ID), kata sandi, nama panggilan, kebangsaan, bahasa, fandom, idola (anggota yang diminati)
- [Perlu ditinjau] Saat login sosial diterapkan: perlu dikonfirmasi apakah akan ditambahkan pengenal anggota (misalnya ID akun unik) yang diterima dari penyedia terkait

② Item yang dihasilkan dan dikumpulkan selama penggunaan Layanan
- Rute rekomendasi yang dibuat dan disimpan pengguna, serta riwayat penggunaan
- Umpan balik dan isi laporan kesalahan tempat yang didaftarkan pengguna

③ Item yang dikumpulkan secara otomatis (sama untuk aplikasi dan web) [Perlu ditinjau]
- Catatan penggunaan Layanan, log akses, cookie, IP akses, informasi perangkat
- (Saat menggunakan push aplikasi) token notifikasi push
- ※ Cakupan dan status pengumpulan aktual item di atas harus dikonfirmasi setelah implementasi dipastikan.


2. Tujuan Pengumpulan dan Penggunaan Informasi Pribadi

- Identifikasi anggota dan konfirmasi niat pendaftaran
- Penyediaan layanan rekomendasi tempat dan rute (pencocokan) berdasarkan informasi artis dan fandom yang diminati
- Penanganan umpan balik dan laporan kesalahan pengguna serta peningkatan kualitas Layanan
- Komunikasi terkait pengoperasian Layanan, seperti penyampaian pemberitahuan dan menanggapi pertanyaan


3. Periode Penyimpanan dan Penggunaan Informasi Pribadi

- Disimpan dan digunakan hingga tujuan pengumpulan/penggunaan tercapai atau anggota menarik diri.
- Saat anggota mengajukan permintaan penarikan diri (penghapusan): diproses dalam waktu 30 hari sejak tanggal permintaan diterima. Setelah masa tenggang penyimpanan 90 hari (untuk mengantisipasi pemulihan data dan perubahan pikiran) berlalu, profil dan informasi rute yang disimpan akan dihapus sepenuhnya. Namun, umpan balik hanya dapat disimpan dalam bentuk statistik anonim yang tidak dapat mengidentifikasi individu.
- Terlepas dari kriteria di atas, jika hukum yang berlaku menetapkan kewajiban penyimpanan terpisah, informasi akan disimpan selama periode tersebut.


※ Anda berhak menolak persetujuan atas pengumpulan dan penggunaan informasi pribadi di atas. Namun, jika Anda menolak persetujuan untuk item wajib, pendaftaran keanggotaan dan penggunaan Layanan dapat dibatasi.`

export const AGREEMENT_TEXTS = {
  ko: { terms: TERMS_KO, location: LOCATION_KO, privacy: PRIVACY_KO },
  en: { terms: TERMS_EN, location: LOCATION_EN, privacy: PRIVACY_EN },
  ja: { terms: TERMS_JA, location: LOCATION_JA, privacy: PRIVACY_JA },
  'zh-CN': { terms: TERMS_ZH_CN, location: LOCATION_ZH_CN, privacy: PRIVACY_ZH_CN },
  'zh-TW': { terms: TERMS_ZH_TW, location: LOCATION_ZH_TW, privacy: PRIVACY_ZH_TW },
  th: { terms: TERMS_TH, location: LOCATION_TH, privacy: PRIVACY_TH },
  id: { terms: TERMS_ID, location: LOCATION_ID, privacy: PRIVACY_ID },
}

function pick(lang, key, koFallback) {
  return AGREEMENT_TEXTS[lang]?.[key] || koFallback
}

export function getTermsText(lang) {
  return pick(lang, 'terms', TERMS_KO)
}

export function getLocationText(lang) {
  return pick(lang, 'location', LOCATION_KO)
}

export function getPrivacyText(lang) {
  return pick(lang, 'privacy', PRIVACY_KO)
}

// 기존 코드 호환용 (한국어 고정 텍스트가 필요한 곳에서 사용)
export const TERMS_TEXT = TERMS_KO
export const LOCATION_TEXT = LOCATION_KO
export const PRIVACY_TEXT = PRIVACY_KO
