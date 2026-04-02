import { notFound } from "@/lib/api/server/errors";
import { findUserWithAccountsById } from "@/modules/auth/repository";
import { toUserProfileDto } from "@/modules/auth/mappers";

export async function getCurrentUserProfile(userId: string) {
  const user = await findUserWithAccountsById(userId);

  if (!user) {
    notFound("User not found.");
  }

  return toUserProfileDto(user);
}
