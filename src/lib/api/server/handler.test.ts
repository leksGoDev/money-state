import { describe, expect, it } from "vitest";

import { notFound, unauthorized } from "@/lib/api/server/errors";
import { handleApi } from "@/lib/api/server/handler";

describe("handleApi", () => {
  it("maps unauthorized errors to 401 response", async () => {
    const response = await handleApi(async () => unauthorized());
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error.code).toBe("UNAUTHORIZED");
  });

  it("maps notFound errors to 404 response", async () => {
    const response = await handleApi(async () => notFound("Missing"));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error.code).toBe("NOT_FOUND");
    expect(payload.error.message).toBe("Missing");
  });
});
