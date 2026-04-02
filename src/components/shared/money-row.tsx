type MoneyRowProps = {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
};

export function MoneyRow({ label, value, tone = "default" }: MoneyRowProps) {
  const valueClass =
    tone === "success"
      ? "text-accent"
      : tone === "warning"
        ? "text-warning"
        : "text-foreground";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line/70 bg-background px-3 py-2.5">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
