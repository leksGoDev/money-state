import { registerSchema } from "@/modules/auth/schemas";

export function parseRegisterPayload(input: unknown) {
  return registerSchema.parse(input);
}
