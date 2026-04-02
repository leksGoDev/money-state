import { SectionTitle } from "@/components/shared/section-title";
import { SurfaceCard } from "@/components/shared/surface-card";
import { getServerUserId } from "@/lib/auth/session";
import { AccountSummaryCard } from "@/modules/settings/components/account-summary-card";
import { BaseCurrencyForm } from "@/modules/settings/components/base-currency-form";
import { loadSettingsPageData } from "@/modules/settings/page";

export default async function SettingsPage() {
  const userId = await getServerUserId();

  if (!userId) {
    return (
      <SurfaceCard className="space-y-4">
        <SectionTitle
          eyebrow="Settings"
          title="Settings"
          description="Sign in to manage base currency and account data."
        />
      </SurfaceCard>
    );
  }

  const data = await loadSettingsPageData(userId);

  return (
    <SurfaceCard className="space-y-4">
      <SectionTitle
        eyebrow="Settings"
        title="Settings"
        description="Base currency drives all aggregated summaries."
      />
      {data.loadError ? (
        <p className="text-sm text-warning">{data.loadError}</p>
      ) : data.profile && data.settings ? (
        <>
          <AccountSummaryCard profile={data.profile} />
          <BaseCurrencyForm value={data.settings.baseCurrency} />
        </>
      ) : null}
    </SurfaceCard>
  );
}
