import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { registerUser } from "@/modules/auth";

export async function POST(request: Request) {
  return handleApi(async () => {
    const payload = await request.json();
    const user = await registerUser(payload);
    return ok(user, 201);
  });
}
