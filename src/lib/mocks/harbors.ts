import type { Harbor } from "@/types/harbor";

export const MOCK_HARBORS: Harbor[] = [
  {
    id: "h_gunsan",
    name: "군산항",
    region: "전북",
    areaLabel: "서해",
    description: "서해권 대표 출조 거점. 포인트 접근이 좋아 초보~중급에 인기.",
    address: "전북특별자치도 군산시",
    tags: ["서해", "출조", "초보추천"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_hongwonhang",
    name: "홍원항",
    region: "충남",
    areaLabel: "서해",
    description: "서천권 출조 중심지. 새벽 출항 수요가 많아 동선이 중요.",
    address: "충청남도 서천군 서면",
    tags: ["서천", "새벽출항", "서해"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_muchangpohang",
    name: "무창포항",
    region: "충남",
    areaLabel: "서해",
    description: "가족/초보 출조에 친화적인 분위기. 주변 편의시설 접근성 좋음.",
    address: "충청남도 보령시 웅천읍",
    tags: ["보령", "가족", "편의시설"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_ocheonhang",
    name: "오천항",
    region: "충남",
    areaLabel: "서해",
    description: "보령권 주요 항. 시즌마다 타깃 변화가 뚜렷해 정보 업데이트가 중요.",
    address: "충청남도 보령시 오천면",
    tags: ["보령", "시즌", "출조"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_yeongheungdo",
    name: "영흥도",
    region: "인천",
    areaLabel: "수도권",
    description: "수도권 접근성이 뛰어나 당일치기 출조 수요가 큼.",
    address: "인천광역시 옹진군 영흥면",
    tags: ["수도권", "당일치기", "접근성"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_jeju",
    name: "제주",
    region: "제주",
    areaLabel: "제주",
    description: "사계절 포인트가 다양. 바람/파고 변수 체크가 특히 중요.",
    address: "제주특별자치도",
    tags: ["제주", "사계절", "기상중요"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_tongyeong",
    name: "통영",
    region: "경남",
    areaLabel: "남해",
    description: "남해권 대표 출조·관광 거점. 다양한 선단/포인트가 공존.",
    address: "경상남도 통영시",
    tags: ["남해", "선단", "관광"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_gangwondo",
    name: "강원도",
    region: "강원",
    areaLabel: "동해",
    description: "동해권 라인업이 풍부. 수온/바람에 따른 패턴 변화가 빠름.",
    address: "강원특별자치도",
    tags: ["동해", "패턴", "수온"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_yeosu",
    name: "여수",
    region: "전남",
    areaLabel: "남해",
    description: "남해권 인기 지역. 포인트가 넓어 이동 동선/출항지가 중요.",
    address: "전라남도 여수시",
    tags: ["남해", "포인트다양", "출항지"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_wando",
    name: "완도",
    region: "전남",
    areaLabel: "남해",
    description: "섬권 포인트 접근이 좋고, 물때/조류 영향이 체감되는 편.",
    address: "전라남도 완도군",
    tags: ["섬권", "조류", "남해"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "h_nokdonghang",
    name: "녹동항",
    region: "전남",
    areaLabel: "남해",
    description: "고흥권 핵심 항. 다양한 섬 출조로 연결되는 출발점 역할.",
    address: "전라남도 고흥군 도양읍",
    tags: ["고흥", "섬출조", "거점"],
    updatedAt: "2026-04-10T09:00:00.000Z"
  }
];

export const HARBOR_BY_ID: Record<string, Harbor> = Object.fromEntries(
  MOCK_HARBORS.map((h) => [h.id, h])
) as Record<string, Harbor>;

