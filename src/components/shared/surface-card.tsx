import { cn } from "@/lib/cn";

type SurfaceCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <section
      className={cn(
        "rounded-[1.7rem] border border-line bg-surface p-5 shadow-card",
        className,
      )}
    >
      {children}
    </section>
  );
}
