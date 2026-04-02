import { PageContainer } from "@/components/shared/page-container";

const navigationItems = [
  "Home",
  "Items",
  "Obligations",
  "Settings",
];

export default function HomePage() {
  return (
    <PageContainer>
      <section className="space-y-5 rounded-[2rem] border border-line bg-surface p-6 shadow-card">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            MoneyState
          </p>
          <h1 className="font-serif text-4xl leading-none text-foreground">
            Financial state, not transaction noise.
          </h1>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Minimal Next.js scaffold based on the current product docs. Domain
            logic, API routes, and persistence will fit into this structure next.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-line bg-background px-4 py-4">
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>April 2026</span>
            <span>Month mode</span>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Confirmed net</p>
            <p className="text-4xl font-semibold tracking-tight text-foreground">
              0.00
            </p>
            <p className="text-sm text-muted-foreground">
              Range and obligations stay separate by design.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-[2rem] border border-line bg-surface/80 p-5">
        <h2 className="font-serif text-2xl text-foreground">Initial structure</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>`src/app` for routes and layout</li>
          <li>`src/modules/*` for use-case level code</li>
          <li>`src/domain` reserved for pure business rules</li>
          <li>`src/components` for shared UI composition</li>
        </ul>
      </section>

      <nav className="grid grid-cols-4 gap-2 rounded-[1.75rem] border border-line bg-[#f3ecdf]/95 p-2 shadow-card">
        {navigationItems.map((item, index) => (
          <div
            key={item}
            className={`rounded-[1.15rem] px-3 py-3 text-center text-xs font-medium ${
              index === 0
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            }`}
          >
            {item}
          </div>
        ))}
      </nav>
    </PageContainer>
  );
}
