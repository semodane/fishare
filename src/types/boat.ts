export type Boat = {
  id: string;
  harborId: string;
  name: string;
  operatorName: string;
  capacity: number;
  priceLabel: string; // e.g., "1인 12만원~"
  departureHarborName: string;
  contact?: string;   // 연락처
  bookingUrl?: string; // 예약 페이지 URL
  tags: string[];
  imageUrl?: string;
  updatedAt: string; // ISO
};

