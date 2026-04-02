import { ObligationDirection, ObligationStatus, type Prisma } from "@prisma/client";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/modules/obligations/repository", () => ({
  createExpenseFromObligation: vi.fn(),
  createIncomeFromObligation: vi.fn(),
  findObligationById: vi.fn(),
  findObligationForResolve: vi.fn(),
  resolveObligationStatus: vi.fn(),
  updateObligationRow: vi.fn(),
  withObligationsTransaction: vi.fn(),
}));

vi.mock("@/modules/obligations/mappers", () => ({
  mapObligationRowsToDto: vi.fn(),
  toObligationCreateData: vi.fn(),
}));

import { cancelObligation } from "@/modules/obligations/use-cases/cancel-obligation";
import { resolveObligation } from "@/modules/obligations/use-cases/resolve-obligation";
import { updateObligation } from "@/modules/obligations/use-cases/update-obligation";
import * as mappers from "@/modules/obligations/mappers";
import * as repository from "@/modules/obligations/repository";

const mockRepo = vi.mocked(repository);
const mockMappers = vi.mocked(mappers);
type ResolveRow = NonNullable<Awaited<ReturnType<typeof repository.findObligationForResolve>>>;
type ByIdRow = NonNullable<Awaited<ReturnType<typeof repository.findObligationById>>>;
type StatusRow = Awaited<ReturnType<typeof repository.resolveObligationStatus>>;
type IncomeRow = Awaited<ReturnType<typeof repository.createIncomeFromObligation>>;
type MapDto = Awaited<ReturnType<typeof mappers.mapObligationRowsToDto>>;

function buildObligationRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "ob_1",
    title: "Loan",
    amount: 100,
    currency: "USD",
    direction: ObligationDirection.RECEIVE,
    status: ObligationStatus.ACTIVE,
    activeFromYear: 2026,
    activeFromMonth: 1,
    expectedYear: null,
    expectedMonth: null,
    resolvedYear: null,
    resolvedMonth: null,
    categoryId: null,
    notes: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    incomeConversion: null,
    expenseConversion: null,
    ...overrides,
  };
}

function asResolveRow(overrides: Record<string, unknown> = {}): ResolveRow {
  return buildObligationRow(overrides) as unknown as ResolveRow;
}

function asByIdRow(overrides: Record<string, unknown> = {}): ByIdRow {
  return buildObligationRow(overrides) as unknown as ByIdRow;
}

function asStatusRow(overrides: Record<string, unknown> = {}): StatusRow {
  return buildObligationRow(overrides) as unknown as StatusRow;
}

describe("obligation lifecycle use-cases", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockRepo.withObligationsTransaction.mockImplementation(async (action) =>
      action({} as unknown as Prisma.TransactionClient),
    );
    mockMappers.mapObligationRowsToDto.mockResolvedValue([
      { id: "dto_1", status: "done" } as unknown as MapDto[number],
    ]);
  });

  it("rejects resolve when obligation does not exist", async () => {
    mockRepo.findObligationForResolve.mockResolvedValue(null);

    await expect(
      resolveObligation("u1", "ob_404", {
        resolution: "closed",
        resolvedYear: 2026,
        resolvedMonth: 4,
      }),
    ).rejects.toMatchObject({ status: 404, code: "NOT_FOUND" });
  });

  it("rejects resolve when obligation is not active", async () => {
    mockRepo.findObligationForResolve.mockResolvedValue(
      asResolveRow({ status: ObligationStatus.CANCELED }),
    );

    await expect(
      resolveObligation("u1", "ob_1", {
        resolution: "closed",
        resolvedYear: 2026,
        resolvedMonth: 4,
      }),
    ).rejects.toMatchObject({ status: 400, code: "BAD_REQUEST" });
  });

  it("rejects converted resolve when conversion already exists before status update", async () => {
    mockRepo.findObligationForResolve.mockResolvedValue(
      asResolveRow({ incomeConversion: { id: "inc_1" } }),
    );

    await expect(
      resolveObligation("u1", "ob_1", {
        resolution: "converted",
        resolvedYear: 2026,
        resolvedMonth: 4,
        confirmed: {},
      }),
    ).rejects.toMatchObject({ status: 400, code: "BAD_REQUEST" });

    expect(mockRepo.resolveObligationStatus).not.toHaveBeenCalled();
  });

  it("resolves in converted mode and creates income for RECEIVE direction", async () => {
    mockRepo.findObligationForResolve.mockResolvedValue(
      asResolveRow({ direction: ObligationDirection.RECEIVE }),
    );
    mockRepo.resolveObligationStatus.mockResolvedValue(asStatusRow());
    mockRepo.createIncomeFromObligation.mockResolvedValue(
      { id: "inc_1" } as unknown as IncomeRow,
    );

    const result = await resolveObligation("u1", "ob_1", {
      resolution: "converted",
      resolvedYear: 2026,
      resolvedMonth: 4,
      confirmed: {},
    });

    expect(result.conversion).toEqual({ entityType: "income", id: "inc_1" });
    expect(mockRepo.createExpenseFromObligation).not.toHaveBeenCalled();
  });

  it("resolves in closed mode without creating confirmed entities", async () => {
    mockRepo.findObligationForResolve.mockResolvedValue(asResolveRow());
    mockRepo.resolveObligationStatus.mockResolvedValue(asStatusRow());

    const result = await resolveObligation("u1", "ob_1", {
      resolution: "closed",
      resolvedYear: 2026,
      resolvedMonth: 4,
    });

    expect(result.conversion).toBeNull();
    expect(mockRepo.createIncomeFromObligation).not.toHaveBeenCalled();
    expect(mockRepo.createExpenseFromObligation).not.toHaveBeenCalled();
  });

  it("cancels only active obligations", async () => {
    mockRepo.findObligationById.mockResolvedValue(
      asByIdRow({ status: ObligationStatus.DONE }),
    );

    await expect(
      cancelObligation("u1", "ob_1", {
        resolvedYear: 2026,
        resolvedMonth: 4,
      }),
    ).rejects.toMatchObject({ status: 400, code: "BAD_REQUEST" });
  });

  it("marks obligation as canceled with resolved period", async () => {
    mockRepo.findObligationById.mockResolvedValue(asByIdRow());
    mockRepo.resolveObligationStatus.mockResolvedValue(
      asStatusRow({ status: ObligationStatus.CANCELED, resolvedMonth: 4 }),
    );

    await cancelObligation("u1", "ob_1", {
      resolvedYear: 2026,
      resolvedMonth: 4,
    });

    expect(mockRepo.resolveObligationStatus).toHaveBeenCalledWith(
      expect.anything(),
      "ob_1",
      {
        status: ObligationStatus.CANCELED,
        resolvedYear: 2026,
        resolvedMonth: 4,
      },
    );
  });

  it("blocks editing done/canceled obligations", async () => {
    mockRepo.findObligationById.mockResolvedValue(
      asByIdRow({ status: ObligationStatus.DONE }),
    );

    await expect(
      updateObligation("u1", "ob_1", {
        title: "Updated",
        amount: 100,
        currency: "USD",
        direction: "pay",
        activeFromYear: 2026,
        activeFromMonth: 4,
      }),
    ).rejects.toMatchObject({ status: 400, code: "BAD_REQUEST" });
  });
});
