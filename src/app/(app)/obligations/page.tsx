import { SectionTitle } from "@/components/shared/section-title";
import { SurfaceCard } from "@/components/shared/surface-card";
import { getServerUserId } from "@/lib/auth/session";
import { CreateObligationForm } from "@/modules/obligations/components/create-obligation-form";
import { ObligationsList } from "@/modules/obligations/components/obligations-list";
import {
  buildOverdueObligationIdSet,
  loadObligationsPageData,
} from "@/modules/obligations/page";

export default async function ObligationsPage() {
  const userId = await getServerUserId();
  const data = userId
    ? await loadObligationsPageData(userId)
    : { obligations: [], loadError: null };
  const overdueIds = buildOverdueObligationIdSet(data.obligations);

  return (
    <SurfaceCard className="space-y-4">
      <SectionTitle
        eyebrow="Possible Layer"
        title="Obligations"
        description="Active obligations are prioritized, overdue remains visible until resolved."
      />
      {!userId ? (
        <p className="text-sm text-muted-foreground">Sign in first to manage obligations.</p>
      ) : data.loadError ? (
        <p className="text-sm text-warning">{data.loadError}</p>
      ) : (
        <>
          <CreateObligationForm />
          <ObligationsList obligations={data.obligations} overdueIds={overdueIds} />
        </>
      )}
    </SurfaceCard>
  );
}
