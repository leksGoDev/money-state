import { describe, expect, it } from "vitest";

import { parseIntegerParam } from "@/lib/http/query";

describe("parseIntegerParam", () => {
  it("uses fallback for invalid integer input", () => {
    expect(parseIntegerParam("abc", 42)).toBe(42);
  });

  it("returns fallback when value is below min", () => {
    expect(parseIntegerParam("0", 5, { min: 1 })).toBe(5);
  });

  it("returns fallback when value is above max", () => {
    expect(parseIntegerParam("13", 7, { max: 12 })).toBe(7);
  });

  it("returns parsed value when bounds are satisfied", () => {
    expect(parseIntegerParam("12", 1, { min: 1, max: 12 })).toBe(12);
  });
});
