import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  allocateCostToCenter,
  buildCostCenterSummary,
  calculateCostCenterTotal,
  createCostCenter,
  deactivateCostCenter,
  filterAllocationsByCostCenter
} from "../services/costCenterService";

import type {
  CostCenterAllocation
} from "../types/finance.types";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "cost-center-1"
  });
});

describe("costCenterService", () => {
  it("creates cost center", () => {
    const costCenter = createCostCenter(
      " IT ",
      " Information Technology "
    );

    expect(costCenter).toMatchObject({
      id: "cost-center-1",
      code: "IT",
      name: "Information Technology",
      status: "active"
    });

    expect(costCenter?.createdAt).toBeTruthy();
  });

  it("blocks invalid cost center", () => {
    expect(
      createCostCenter(
        "",
        "Information Technology"
      )
    ).toBeNull();

    expect(
      createCostCenter(
        "IT",
        ""
      )
    ).toBeNull();
  });

  it("deactivates active cost center", () => {
    const costCenter = createCostCenter(
      "IT",
      "Information Technology"
    )!;

    const inactive =
      deactivateCostCenter(costCenter);

    expect(inactive?.status).toBe("inactive");
  });

  it("blocks deactivating inactive cost center", () => {
    const costCenter = createCostCenter(
      "IT",
      "Information Technology"
    )!;

    const inactive =
      deactivateCostCenter(costCenter)!;

    expect(
      deactivateCostCenter(inactive)
    ).toBeNull();
  });

  it("allocates cost to active cost center", () => {
    const costCenter = createCostCenter(
      "IT",
      "Information Technology"
    )!;

    const allocation =
      allocateCostToCenter(
        costCenter,
        "5000",
        3000000,
        "Software subscription",
        "2026-01-01"
      );

    expect(allocation).toEqual({
      id: "cost-center-1",
      costCenterCode: "IT",
      accountCode: "5000",
      amount: 3000000,
      description: "Software subscription",
      allocatedAt: "2026-01-01"
    });
  });

  it("blocks allocation to inactive cost center", () => {
    const costCenter = deactivateCostCenter(
      createCostCenter(
        "IT",
        "Information Technology"
      )!
    )!;

    const allocation =
      allocateCostToCenter(
        costCenter,
        "5000",
        3000000,
        "Software subscription",
        "2026-01-01"
      );

    expect(allocation).toBeNull();
  });

  it("blocks invalid cost allocation", () => {
    const costCenter = createCostCenter(
      "IT",
      "Information Technology"
    )!;

    expect(
      allocateCostToCenter(
        costCenter,
        "",
        3000000,
        "Software subscription",
        "2026-01-01"
      )
    ).toBeNull();

    expect(
      allocateCostToCenter(
        costCenter,
        "5000",
        0,
        "Software subscription",
        "2026-01-01"
      )
    ).toBeNull();

    expect(
      allocateCostToCenter(
        costCenter,
        "5000",
        3000000,
        "",
        "2026-01-01"
      )
    ).toBeNull();
  });

  it("filters allocations by cost center", () => {
    const allocations: CostCenterAllocation[] = [
      {
        id: "allocation-1",
        costCenterCode: "IT",
        accountCode: "5000",
        amount: 3000000,
        description: "Software",
        allocatedAt: "2026-01-01"
      },
      {
        id: "allocation-2",
        costCenterCode: "HR",
        accountCode: "5000",
        amount: 2000000,
        description: "Training",
        allocatedAt: "2026-01-01"
      }
    ];

    const result =
      filterAllocationsByCostCenter(
        allocations,
        "IT"
      );

    expect(result).toHaveLength(1);
    expect(result[0].costCenterCode).toBe("IT");
  });

  it("calculates cost center total", () => {
    const allocations: CostCenterAllocation[] = [
      {
        id: "allocation-1",
        costCenterCode: "IT",
        accountCode: "5000",
        amount: 3000000,
        description: "Software",
        allocatedAt: "2026-01-01"
      },
      {
        id: "allocation-2",
        costCenterCode: "IT",
        accountCode: "5100",
        amount: 2000000,
        description: "Hardware",
        allocatedAt: "2026-01-01"
      }
    ];

    expect(
      calculateCostCenterTotal(
        allocations,
        "IT"
      )
    ).toBe(5000000);
  });

  it("builds cost center summary", () => {
    const allocations: CostCenterAllocation[] = [
      {
        id: "allocation-1",
        costCenterCode: "IT",
        accountCode: "5000",
        amount: 3000000,
        description: "Software",
        allocatedAt: "2026-01-01"
      },
      {
        id: "allocation-2",
        costCenterCode: "IT",
        accountCode: "5100",
        amount: 2000000,
        description: "Hardware",
        allocatedAt: "2026-01-01"
      }
    ];

    expect(
      buildCostCenterSummary(
        allocations,
        "IT"
      )
    ).toEqual({
      costCenterCode: "IT",
      totalAllocated: 5000000,
      allocationCount: 2
    });
  });
});