export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-app flex-col gap-5 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
      {children}
    </main>
  );
}
