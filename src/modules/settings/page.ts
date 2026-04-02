import { getCurrentUserProfile } from "@/modules/auth";
import { getSettings } from "@/modules/settings";
import type { UserProfileDto } from "@/modules/auth/types";
import type { SettingsDto } from "@/modules/settings/types";
import { toPageLoadErrorMessage } from "@/lib/api/client/load-error";

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
  } catch (error) {
    console.error("Failed to load settings page data.", error);
    return {
      profile: null,
      settings: null,
      loadError: toPageLoadErrorMessage(
        error,
        "Unable to load settings. Check database connection.",
      ),
    };
  }
}
