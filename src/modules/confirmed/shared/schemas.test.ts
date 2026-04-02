import { describe, expect, it } from "vitest";

import { confirmedEntityCreateSchema } from "@/modules/confirmed/shared/schemas";

describe("confirmed schema contracts", () => {
  it("rejects payload with non-positive amount", () => {
    expect(() =>
      confirmedEntityCreateSchema.parse({
        title: "Salary",
        amount: 0,
        currency: "USD",
        timingType: "single",
        year: 2026,
        month: 4,
      }),
    ).toThrow();
  });

  it("rejects payload with invalid month", () => {
    expect(() =>
      confirmedEntityCreateSchema.parse({
        title: "Salary",
        amount: 10,
        currency: "USD",
        timingType: "single",
        year: 2026,
        month: 13,
      }),
    ).toThrow();
  });
});
