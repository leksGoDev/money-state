import bcrypt from "bcryptjs";

import { conflict } from "@/lib/api/server/errors";
import {
  attachCredentialsToUser,
  createCredentialsUser,
  findUserWithAccountsByEmail,
} from "@/modules/auth/repository";
import { parseRegisterPayload } from "@/modules/auth/schemas";
import { toUserProfileDto } from "@/modules/auth/mappers";

export async function registerUser(payload: unknown) {
  const input = parseRegisterPayload(payload);
  const email = input.email.toLowerCase();
  const passwordHash = await bcrypt.hash(input.password, 10);
  const existing = await findUserWithAccountsByEmail(email);

  const user = await (async () => {
    if (!existing) {
      return createCredentialsUser({
        email,
        name: input.name,
        passwordHash,
      });
    }

    if (existing.passwordHash) {
      conflict("Credentials account for this email already exists.");
    }

    return attachCredentialsToUser({
      userId: existing.id,
      existingName: existing.name,
      newName: input.name,
      passwordHash,
    });
  })();

  return toUserProfileDto(user);
}
