import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(100).optional(),
});

export function parseRegisterPayload(input: unknown) {
  return registerSchema.parse(input);
}
