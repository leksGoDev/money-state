import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/settings/repository", () => ({
  findUserSettingsRow: vi.fn(),
  updateUserBaseCurrencyRow: vi.fn(),
}));

vi.mock("@/modules/settings/mappers", () => ({
  toSettingsDto: vi.fn(),
}));

import { updateSettings } from "@/modules/settings/use-cases/update-settings";
import * as mappers from "@/modules/settings/mappers";
import * as repository from "@/modules/settings/repository";

const mockRepo = vi.mocked(repository);
const mockMappers = vi.mocked(mappers);
type SettingsDto = ReturnType<typeof mappers.toSettingsDto>;
type SettingsRow = NonNullable<Awaited<ReturnType<typeof repository.findUserSettingsRow>>>;
type UpdatedSettingsRow = Awaited<ReturnType<typeof repository.updateUserBaseCurrencyRow>>;

describe("updateSettings", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockMappers.toSettingsDto.mockReturnValue({ baseCurrency: "USD" } as SettingsDto);
  });

  it("updates user base currency", async () => {
    mockRepo.findUserSettingsRow.mockResolvedValue(
      { id: "u1", baseCurrency: "USD" } as unknown as SettingsRow,
    );
    mockRepo.updateUserBaseCurrencyRow.mockResolvedValue(
      { baseCurrency: "USD" } as unknown as UpdatedSettingsRow,
    );

    const result = await updateSettings("u1", { baseCurrency: "USD" });

    expect(mockRepo.updateUserBaseCurrencyRow).toHaveBeenCalled();
    expect(result).toEqual({ baseCurrency: "USD" });
  });

  it("returns notFound when user settings row does not exist", async () => {
    mockRepo.findUserSettingsRow.mockResolvedValue(null);

    await expect(updateSettings("u404", { baseCurrency: "USD" })).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
  });

  it("rejects invalid baseCurrency payload", async () => {
    await expect(updateSettings("u1", { baseCurrency: "BTC" })).rejects.toBeTruthy();
    expect(mockRepo.findUserSettingsRow).not.toHaveBeenCalled();
  });
});
