export type TideInfo = {
  id: string;
  harborId: string;
  date: string; // YYYY-MM-DD
  timezone: "Asia/Seoul";
  sourceLabel: string; // e.g., "mock"
  summary: string; // human-readable
  tides: Array<{
    time: string; // HH:mm
    type: "high" | "low";
    heightCm?: number;
  }>;
};

