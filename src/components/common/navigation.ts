export type BottomTabKey = "home" | "harbors" | "review_write" | "my_reviews" | "my";

export type BottomTabItem = {
  key: BottomTabKey;
  label: string;
  href: string;
};
