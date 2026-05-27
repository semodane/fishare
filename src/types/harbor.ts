export type Harbor = {
  id: string;
  name: string;
  region: string; // e.g., "전북", "충남", "제주"
  areaLabel: string; // 사용자에게 보이는 권역 라벨 (예: "강원도", "제주")
  description: string;
  address: string;
  lat?: number;
  lng?: number;
  tags: string[];
  updatedAt: string; // ISO
};

