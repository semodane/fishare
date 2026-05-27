import type { Harbor } from "@/types/harbor";
import type { Review } from "@/types/review";

export type BeginnerScore = 1 | 2 | 3 | 4 | 5;

export type HarborCardVM = {
  harbor: Harbor;
  representativeFish: string[];
  reviewCount: number;
  beginnerScore: BeginnerScore;
};

// 최소한의 "하버 중심" 표현을 위해, MVP 단계에서는 화면용 메타를 하버 ID로 매핑합니다.
// 이후 DB/콘텐츠 모델이 확정되면 `lib/queries/*`에서 계산/조인하도록 옮기기 쉬운 구조입니다.
const HARBOR_META: Record<
  string,
  { representativeFish: string[]; beginnerScore: BeginnerScore }
> = {
  h_gunsan: { representativeFish: ["광어", "우럭", "쭈꾸미"], beginnerScore: 5 },
  h_hongwonhang: { representativeFish: ["참돔", "광어", "우럭"], beginnerScore: 4 },
  h_muchangpohang: { representativeFish: ["우럭", "광어"], beginnerScore: 4 },
  h_ocheonhang: { representativeFish: ["광어", "우럭", "갑오징어"], beginnerScore: 4 },
  h_yeongheungdo: { representativeFish: ["우럭", "광어"], beginnerScore: 5 },
  h_jeju: { representativeFish: ["부시리", "방어", "참돔"], beginnerScore: 3 },
  h_tongyeong: { representativeFish: ["볼락", "참돔", "갑오징어"], beginnerScore: 4 },
  h_gangwondo: { representativeFish: ["대구", "임연수", "문어"], beginnerScore: 3 },
  h_yeosu: { representativeFish: ["갈치", "열기", "참돔"], beginnerScore: 4 },
  h_wando: { representativeFish: ["감성돔", "참돔", "갑오징어"], beginnerScore: 3 },
  h_nokdonghang: { representativeFish: ["부시리", "방어", "참돔"], beginnerScore: 3 }
};

export function getHarborCardVM(params: {
  harbor: Harbor;
  reviews: Review[];
}): HarborCardVM {
  const meta = HARBOR_META[params.harbor.id] ?? {
    representativeFish: ["대표 어종"],
    beginnerScore: 3 as BeginnerScore
  };
  const reviewCount = params.reviews.filter(
    (r) => r.harborId === params.harbor.id
  ).length;

  // tags에 "초보추천"이 있으면 가중치
  const beginnerScore =
    params.harbor.tags.includes("초보추천") && meta.beginnerScore < 5
      ? ((meta.beginnerScore + 1) as BeginnerScore)
      : meta.beginnerScore;

  return {
    harbor: params.harbor,
    representativeFish: meta.representativeFish,
    reviewCount,
    beginnerScore
  };
}

