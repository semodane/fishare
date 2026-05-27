import type { Place } from "@/types/place";

export const MOCK_PLACES: Place[] = [
  {
    id: "p_gunsan_shop_01",
    harborId: "h_gunsan",
    name: "군산 바다낚시",
    category: "tackle_shop",
    address: "전북특별자치도 군산시 (가상 주소)",
    phone: "063-000-0001",
    openHours: "05:00-20:00",
    note: "새벽 출항 전 채비/미끼 구매하기 좋아요."
  },
  {
    id: "p_gunsan_food_01",
    harborId: "h_gunsan",
    name: "새벽해장국",
    category: "early_restaurant",
    address: "전북특별자치도 군산시 (가상 주소)",
    openHours: "04:30-11:00",
    note: "출항 전 따뜻한 국밥 한 그릇."
  },
  {
    id: "p_hongwon_clean_01",
    harborId: "h_hongwonhang",
    name: "홍원 손질센터",
    category: "fish_cleaning",
    address: "충청남도 서천군 서면 (가상 주소)",
    openHours: "10:00-18:00",
    note: "손질/포장 서비스(현장 문의)."
  },
  {
    id: "p_yeosu_cook_01",
    harborId: "h_yeosu",
    name: "여수 즉석요리집",
    category: "cooking_restaurant",
    address: "전라남도 여수시 (가상 주소)",
    openHours: "11:00-22:00",
    note: "손질한 생선을 바로 조리해주는 스타일."
  },
  {
    id: "p_jeju_shop_01",
    harborId: "h_jeju",
    name: "제주 지깅샵",
    category: "tackle_shop",
    address: "제주특별자치도 (가상 주소)",
    openHours: "06:00-19:00",
    note: "지깅 메탈/어시스트훅 재고가 많아요."
  }
];

