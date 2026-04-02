import { describe, expect, it } from "vitest";

import { cancelObligationSchema, resolveObligationSchema } from "@/modules/obligations/schemas";

describe("obligations schema contracts", () => {
  it("rejects cancel payload with invalid resolved month", () => {
    expect(() =>
      cancelObligationSchema.parse({
        resolvedYear: 2026,
        resolvedMonth: 0,
      }),
    ).toThrow();
  });

  it("rejects resolve payload with invalid resolved month", () => {
    expect(() =>
      resolveObligationSchema.parse({
        resolution: "closed",
        resolvedYear: 2026,
        resolvedMonth: 99,
      }),
    ).toThrow();
  });
});
