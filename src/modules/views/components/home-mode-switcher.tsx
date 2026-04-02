import Link from "next/link";

import { cn } from "@/lib/cn";
import { homeMonthRoute, homeYearRoute } from "@/lib/routes/app";
import { homeModeLabels, homeModeValues, type HomeMode } from "@/modules/views/constants";

type HomeModeSwitcherProps = {
  mode: HomeMode;
  year: number;
  month: number;
};

export function HomeModeSwitcher({ mode, year, month }: HomeModeSwitcherProps) {
  return (
    <div className="flex gap-2 rounded-xl bg-muted p-1 text-xs">
      {homeModeValues.map((value) => (
        <Link
          key={value}
          href={value === "month" ? homeMonthRoute({ year, month }) : homeYearRoute({ year })}
          className={cn(
            "rounded-lg px-3 py-1.5",
            mode === value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground",
          )}
        >
          {homeModeLabels[value]}
        </Link>
      ))}
    </div>
  );
}
