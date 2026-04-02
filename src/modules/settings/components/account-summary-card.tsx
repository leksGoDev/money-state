import type { UserProfileDto } from "@/modules/auth/types";

type AccountSummaryCardProps = {
  profile: UserProfileDto;
};

export function AccountSummaryCard({ profile }: AccountSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-background p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Account
      </p>
      <p className="mt-1 text-sm text-foreground">{profile.name ?? "Unnamed user"}</p>
      <p className="text-xs text-muted-foreground">{profile.email}</p>
      <p className="text-xs text-muted-foreground">
        Providers: {profile.providers.join(", ")}
      </p>
    </div>
  );
}
