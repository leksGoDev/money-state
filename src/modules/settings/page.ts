import { getCurrentUserProfile } from "@/modules/auth";
import { getSettings } from "@/modules/settings";
import type { UserProfileDto } from "@/modules/auth/types";
import type { SettingsDto } from "@/modules/settings/types";

export type SettingsPageData = {
  profile: UserProfileDto | null;
  settings: SettingsDto | null;
  loadError: string | null;
};

export async function loadSettingsPageData(
  userId: string,
): Promise<SettingsPageData> {
  try {
    const [profile, settings] = await Promise.all([
      getCurrentUserProfile(userId),
      getSettings(userId),
    ]);

    return {
      profile,
      settings,
      loadError: null,
    };
  } catch {
    return {
      profile: null,
      settings: null,
      loadError: "Unable to load settings. Check database connection.",
    };
  }
}
