import { describe, expect, it } from "vitest";
import { z } from "zod";

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

  it("maps zod errors to 400 validation response", async () => {
    const schema = z.object({ month: z.number().min(1).max(12) });
    const response = await handleApi(async () => schema.parse({ month: 99 }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("VALIDATION_ERROR");
  });

  it("maps unknown errors to 500", async () => {
    const response = await handleApi(async () => {
      throw new Error("boom");
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
