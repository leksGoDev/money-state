import { SectionTitle } from "@/components/shared/section-title";
import { SurfaceCard } from "@/components/shared/surface-card";
import { getServerUserId } from "@/lib/auth/session";
import type { SearchParamsRecord } from "@/lib/http/query";
import { ConfirmedItemsList } from "@/modules/confirmed/components/confirmed-items-list";
import { CreateConfirmedForm } from "@/modules/confirmed/components/create-confirmed-form";
import { ItemsTabSwitcher } from "@/modules/confirmed/components/items-tab-switcher";
import {
  getConfirmedCreateConfig,
  getItemsRowsByTab,
  loadItemsPageData,
  parseItemsTab,
} from "@/modules/confirmed/page";

type ItemsPageProps = {
  searchParams: Promise<SearchParamsRecord>;
};

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const params = await searchParams;
  const userId = await getServerUserId();
  const tab = parseItemsTab(params);
  const data = userId
    ? await loadItemsPageData(userId)
    : { incomes: [], expenses: [], loadError: null };
  const rows = getItemsRowsByTab(tab, data);
  const createConfig = getConfirmedCreateConfig(tab);

  return (
    <SurfaceCard className="space-y-4">
      <SectionTitle
        eyebrow="Confirmed Layer"
        title="Items"
        description="Income and expense stay in one screen for fast access."
      />
      <ItemsTabSwitcher tab={tab} />

      {!userId ? (
        <p className="text-sm text-muted-foreground">Sign in first to manage items.</p>
      ) : data.loadError ? (
        <p className="text-sm text-warning">{data.loadError}</p>
      ) : (
        <>
          <CreateConfirmedForm endpoint={createConfig.endpoint} label={createConfig.label} />
          <ConfirmedItemsList tab={tab} rows={rows} />
        </>
      )}
    </SurfaceCard>
  );
}
