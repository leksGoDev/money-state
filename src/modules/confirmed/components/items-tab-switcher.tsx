import Link from "next/link";

import { cn } from "@/lib/cn";
import { itemsTabRoute } from "@/lib/routes/app";
import {
  itemsTabLabels,
  itemsTabValues,
  type ItemsTab,
} from "@/modules/confirmed/constants";

type ItemsTabSwitcherProps = {
  tab: ItemsTab;
};

export function ItemsTabSwitcher({ tab }: ItemsTabSwitcherProps) {
  return (
    <div className="flex gap-2 rounded-xl bg-muted p-1 text-xs">
      {itemsTabValues.map((value) => (
        <Link
          key={value}
          href={itemsTabRoute(value)}
          className={cn(
            "rounded-lg px-3 py-1.5",
            tab === value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground",
          )}
        >
          {itemsTabLabels[value]}
        </Link>
      ))}
    </div>
  );
}
