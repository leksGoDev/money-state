import { MoneyRow } from "@/components/shared/money-row";
import { formatMonthLabel } from "@/lib/format/money";
import type { YearViewDto } from "@/modules/views/types";

type HomeYearViewProps = {
  data: YearViewDto;
};

export function HomeYearView({ data }: HomeYearViewProps) {
  return (
    <>
      <div className="rounded-[1.4rem] border border-line bg-background px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Year {data.year}
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
          {data.summary.confirmed.net}
        </p>
        <p className="text-xs text-muted-foreground">
          Net summary in {data.currency.baseCurrency}
        </p>
      </div>
      <div className="grid gap-2">
        <MoneyRow label="Income" value={data.summary.confirmed.income} tone="success" />
        <MoneyRow label="Expense" value={data.summary.confirmed.expense} />
      </div>
      <div className="space-y-2 rounded-2xl border border-line bg-background p-3">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Month Context
        </p>
        <ul className="space-y-2">
          {data.months.map((monthSummary) => (
            <li
              key={`${monthSummary.period.year}-${monthSummary.period.month}`}
              className="rounded-xl border border-line/70 bg-surface px-3 py-2"
            >
              <p className="text-xs text-muted-foreground">
                {formatMonthLabel(monthSummary.period.year, monthSummary.period.month)}
              </p>
              <p className="text-sm font-semibold text-foreground">
                Net {monthSummary.confirmed.net}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Possible +{monthSummary.possible.receive} / -{monthSummary.possible.pay}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Range {monthSummary.range.min} to {monthSummary.range.max}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
