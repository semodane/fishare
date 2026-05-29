export const dynamic = "force-dynamic";

import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { HomeFeaturedHarborsSection } from "@/components/home/HomeFeaturedHarborsSection";
import { HomeNearbyPlacesSection } from "@/components/home/HomeNearbyPlacesSection";
import { HomePopularBoatsSection } from "@/components/home/HomePopularBoatsSection";
import { HomeRecentReviewsSection } from "@/components/home/HomeRecentReviewsSection";
import { getHomeData } from "@/lib/queries/home";

export default async function PublicHomePage() {
  const home = await getHomeData();
  return (
    <MobilePageLayout headerVariant="logo-search" activeTab="home">
      <div className="space-y-6">
        <HomeFeaturedHarborsSection harbors={home.featuredHarbors} />
        <HomePopularBoatsSection boats={home.popularBoats} />
        <HomeRecentReviewsSection reviews={home.recentReviews} />
        <HomeNearbyPlacesSection places={home.nearbyPlaces} />
      </div>
    </MobilePageLayout>
  );
}

