export type PlaceCategory =
  | "tackle_shop"
  | "early_restaurant"
  | "fish_cleaning"
  | "cooking_restaurant";

export type Place = {
  id: string;
  harborId: string;
  name: string;
  category: PlaceCategory;
  address: string;
  note?: string;
  phone?: string;
  openHours?: string;
  lat?: number;
  lng?: number;
};

