import type { ReactNode } from "react";

import { BottomNavigation } from "@/components/shared/bottom-navigation";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-app flex-col px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[calc(1.25rem+env(safe-area-inset-top))]">
      <div className="flex flex-1 flex-col gap-4">{children}</div>
      <BottomNavigation />
    </main>
  );
}
