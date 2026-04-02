import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { setSessionCookie } from "@/lib/auth/session";
import { registerUser } from "@/modules/auth";

export async function POST(request: Request) {
  return handleApi(async () => {
    const payload = await request.json();
    const user = await registerUser(payload);
    const response = ok(user, 201);
    setSessionCookie(response, user.id);
    return response;
  });
}
