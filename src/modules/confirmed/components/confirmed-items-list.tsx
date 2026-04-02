import { confirmedItemApiPath } from "@/lib/routes/api";
import type { ItemsTab } from "@/modules/confirmed/constants";
import type { ConfirmedListItemDto } from "@/modules/confirmed/shared";

type ConfirmedItemsListProps = {
  tab: ItemsTab;
  rows: ReadonlyArray<ConfirmedListItemDto>;
};

export function ConfirmedItemsList({ tab, rows }: ConfirmedItemsListProps) {
  return (
    <ul className="space-y-2">
      {rows.map((item) => (
        <li key={item.id} className="rounded-xl border border-line bg-background px-3 py-3">
          <p className="text-sm font-semibold text-foreground">{item.title}</p>
          <p className="text-xs text-muted-foreground">
            {item.amount} {item.currency}
            {item.convertedAmount ? ` (~${item.convertedAmount} ${item.baseCurrency})` : ""}
          </p>
          <p className="text-xs text-muted-foreground">Timing: {item.timingType}</p>
          <p className="text-[11px] text-muted-foreground">
            Edit: {confirmedItemApiPath({ collection: tab, id: item.id })}
          </p>
        </li>
      ))}
      {rows.length === 0 ? (
        <li className="rounded-xl border border-dashed border-line bg-background px-3 py-4 text-sm text-muted-foreground">
          No items yet. Add the first one above.
        </li>
      ) : null}
    </ul>
  );
}
