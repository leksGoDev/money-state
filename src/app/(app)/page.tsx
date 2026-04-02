import { SectionTitle } from "@/components/shared/section-title";
import { SurfaceCard } from "@/components/shared/surface-card";
import { getServerUserId } from "@/lib/auth/session";
import { RegisterForm } from "@/modules/auth/components/register-form";
import { HomeModeSwitcher } from "@/modules/views/components/home-mode-switcher";
import { HomeMonthView } from "@/modules/views/components/home-month-view";
import { HomeYearView } from "@/modules/views/components/home-year-view";
import { loadHomePageData, parseHomePageQuery } from "@/modules/views/page";
import type { SearchParamsRecord } from "@/lib/http/query";

type HomePageProps = {
  searchParams: Promise<SearchParamsRecord>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const userId = await getServerUserId();
  const query = parseHomePageQuery(params);
  const homeData = userId
    ? await loadHomePageData(userId, query)
    : { monthData: null, yearData: null, loadError: null };

  return (
    <>
      <SurfaceCard className="space-y-4">
        <SectionTitle
          eyebrow="MoneyState"
          title="Home"
          description="Confirmed values and uncertainty stay separate by design."
        />
        <HomeModeSwitcher mode={query.mode} year={query.year} month={query.month} />
        {!userId ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Create a credentials account to initialize your personal scope.
            </p>
            <RegisterForm />
          </div>
        ) : homeData.loadError ? (
          <p className="text-sm text-warning">{homeData.loadError}</p>
        ) : query.mode === "month" && homeData.monthData ? (
          <HomeMonthView data={homeData.monthData} />
        ) : query.mode === "year" && homeData.yearData ? (
          <HomeYearView data={homeData.yearData} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No data yet. Add confirmed items and obligations to see monthly and yearly views.
          </p>
        )}
      </SurfaceCard>
    </>
  );
}
