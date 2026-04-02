import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/obligations/repository", () => ({
  findObligationById: vi.fn(),
}));

vi.mock("@/modules/obligations/mappers", () => ({
  mapObligationRowsToDto: vi.fn(),
}));

import { getObligationById } from "@/modules/obligations/use-cases/get-obligation-by-id";
import * as mappers from "@/modules/obligations/mappers";
import * as repository from "@/modules/obligations/repository";

const mockRepo = vi.mocked(repository);
const mockMappers = vi.mocked(mappers);

describe("getObligationById", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockMappers.mapObligationRowsToDto.mockResolvedValue([{ id: "ob_1" } as never]);
  });

  it("passes userId to repository scope", async () => {
    mockRepo.findObligationById.mockResolvedValue({ id: "ob_1" } as never);

    await getObligationById("user_1", "ob_1");

    expect(mockRepo.findObligationById).toHaveBeenCalledWith("user_1", "ob_1");
  });

  it("returns notFound when entity is outside user scope", async () => {
    mockRepo.findObligationById.mockResolvedValue(null);

    await expect(getObligationById("user_1", "other_user_ob")).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
  });
});
