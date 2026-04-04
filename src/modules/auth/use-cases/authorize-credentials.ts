import bcrypt from "bcryptjs";
import { z } from "zod";

import type { AuthorizedIdentity } from "@/modules/auth/types";
import { findUserForCredentialsByEmail } from "@/modules/auth/repository";

const credentialsAuthorizeSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function authorizeCredentials(
  rawCredentials: unknown,
): Promise<AuthorizedIdentity | null> {
  const parsed = credentialsAuthorizeSchema.safeParse(rawCredentials);
  if (!parsed.success) {
    return null;
  }

  const email = parsed.data.email.toLowerCase();
  const user = await findUserForCredentialsByEmail(email);

  if (!user?.passwordHash) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
