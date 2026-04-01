import { NextResponse } from "next/server";

import { handleApi } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { setSessionCookie } from "@/lib/auth/session";
import { registerUser } from "@/modules/auth";

export async function POST(request: Request) {
  return handleApi(async () => {
    const payload = await request.json();
    const user = await registerUser(payload);
    const response = ok(user, 201) as NextResponse;
    setSessionCookie(response, user.id);
    return response;
  });
}
