import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/modules/obligations", () => ({
  deleteObligation: vi.fn(),
  getObligationById: vi.fn(),
  updateObligation: vi.fn(),
}));

import { auth } from "@/auth";

type MockAuthSession = { user?: { id?: string } } | null;
const mockAuth = vi.mocked(
  auth as unknown as () => Promise<MockAuthSession>,
);
import * as route from "@/app/api/obligations/[id]/route";
import {
  deleteObligation,
  getObligationById,
  updateObligation,
} from "@/modules/obligations";

type ObligationItemRequest = Parameters<typeof route.GET>[0];
type ObligationItemContext = Parameters<typeof route.GET>[1];
type GetObligationResult = Awaited<ReturnType<typeof getObligationById>>;
type UpdateObligationResult = Awaited<ReturnType<typeof updateObligation>>;
type DeleteObligationResult = Awaited<ReturnType<typeof deleteObligation>>;

const mockGetObligationById = vi.mocked(getObligationById);
const mockUpdateObligation = vi.mocked(updateObligation);
const mockDeleteObligation = vi.mocked(deleteObligation);

const context: ObligationItemContext = {
  params: Promise.resolve({ id: "ob_1" }),
};

describe("/api/obligations/[id] route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
  });

  it("GET wires userId and id", async () => {
    mockGetObligationById.mockResolvedValue(
      { id: "ob_1" } as unknown as GetObligationResult,
    );

    const response = await route.GET(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as ObligationItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockGetObligationById).toHaveBeenCalledWith("user_1", "ob_1");
  });

  it("PATCH wires payload", async () => {
    mockUpdateObligation.mockResolvedValue(
      { id: "ob_1" } as unknown as UpdateObligationResult,
    );

    const response = await route.PATCH(
      {
        json: vi.fn(async () => ({ title: "Updated title" })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as ObligationItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockUpdateObligation).toHaveBeenCalledWith("user_1", "ob_1", {
      title: "Updated title",
    });
  });

  it("DELETE wires userId and id", async () => {
    mockDeleteObligation.mockResolvedValue(
      { success: true } as unknown as DeleteObligationResult,
    );

    const response = await route.DELETE(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as ObligationItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockDeleteObligation).toHaveBeenCalledWith("user_1", "ob_1");
  });
});
