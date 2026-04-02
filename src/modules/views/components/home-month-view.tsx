import { MoneyRow } from "@/components/shared/money-row";
import { formatMonthLabel } from "@/lib/format/money";
import type { MonthViewDto } from "@/modules/views/types";

type HomeMonthViewProps = {
  data: MonthViewDto;
};

export function HomeMonthView({ data }: HomeMonthViewProps) {
  return (
    <>
      <div className="rounded-[1.4rem] border border-line bg-background px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {formatMonthLabel(data.period.year, data.period.month)}
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
          {data.confirmed.net}
        </p>
        <p className="text-xs text-muted-foreground">
          Net in {data.currency.baseCurrency} (rates {data.currency.ratesDate ?? "n/a"})
        </p>
      </div>
      <div className="grid gap-2">
        <MoneyRow label="Income" value={data.confirmed.income} tone="success" />
        <MoneyRow label="Expense" value={data.confirmed.expense} />
        <MoneyRow label="Possible Receive" value={data.possible.receive} tone="success" />
        <MoneyRow label="Possible Pay" value={data.possible.pay} tone="warning" />
        <MoneyRow label="Range Min" value={data.range.min} />
        <MoneyRow label="Range Max" value={data.range.max} />
      </div>
      <div className="space-y-2 rounded-2xl border border-line bg-background p-3">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Obligation Context
        </p>
        <MoneyRow label="Matched" value={`${data.obligations.matched.length}`} />
        <MoneyRow label="Overdue" value={`${data.obligations.overdue.length}`} tone="warning" />
        <MoneyRow label="Unscheduled" value={`${data.obligations.unscheduled.length}`} />
      </div>
    </>
  );
}
