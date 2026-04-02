import { cn } from "@/lib/cn";
import { ObligationActions } from "@/modules/obligations/components/obligation-actions";
import type { ObligationDto } from "@/modules/obligations/types";

type ObligationsListProps = {
  obligations: ReadonlyArray<ObligationDto>;
  overdueIds: ReadonlySet<string>;
};

export function ObligationsList({ obligations, overdueIds }: ObligationsListProps) {
  return (
    <ul className="space-y-2">
      {obligations.map((item) => (
        <li
          key={item.id}
          className={cn(
            "rounded-xl border px-3 py-3",
            overdueIds.has(item.id)
              ? "border-warning bg-[#fff8ec]"
              : "border-line bg-background",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.direction} {item.amount} {item.currency}
              </p>
              <p className="text-[11px] text-muted-foreground">
                expected:{" "}
                {item.expectedYear && item.expectedMonth
                  ? `${item.expectedYear}-${String(item.expectedMonth).padStart(2, "0")}`
                  : "none"}
              </p>
            </div>
            <ObligationActions
              obligationId={item.id}
              direction={item.direction}
              status={item.status}
            />
          </div>
        </li>
      ))}
      {obligations.length === 0 ? (
        <li className="rounded-xl border border-dashed border-line bg-background px-3 py-4 text-sm text-muted-foreground">
          No obligations yet.
        </li>
      ) : null}
    </ul>
  );
}
