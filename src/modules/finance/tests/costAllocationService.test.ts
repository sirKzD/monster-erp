import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildCostAllocationSummary,
  calculateAllocatedAmount,
  createCostAllocation,
  getTotalAllocatedAmount,
  validateAllocationPercentage
} from "../services/costAllocationService";

const allocations = [
  createCostAllocation(
    "alloc-1",
    "6100",
    "IT",
    50,
    10000000,
    "2026-07-01"
  ),
  createCostAllocation(
    "alloc-2",
    "6100",
    "HR",
    20,
    10000000,
    "2026-07-01"
  ),
  createCostAllocation(
    "alloc-3",
    "6100",
    "FIN",
    30,
    10000000,
    "2026-07-01"
  ),
  createCostAllocation(
    "alloc-4",
    "6200",
    "OPS",
    100,
    5000000,
    "2026-07-01"
  )
];

describe(
  "costAllocationService",
  () => {
    it(
      "calculates allocated amount 50 percent",
      () => {
        expect(
          calculateAllocatedAmount(
            10000000,
            50
          )
        ).toBe(5000000);
      }
    );

    it(
      "calculates allocated amount 20 percent",
      () => {
        expect(
          calculateAllocatedAmount(
            10000000,
            20
          )
        ).toBe(2000000);
      }
    );

    it(
      "calculates allocated amount 30 percent",
      () => {
        expect(
          calculateAllocatedAmount(
            10000000,
            30
          )
        ).toBe(3000000);
      }
    );

    it(
      "validates allocation percentage equals 100",
      () => {
        expect(
          validateAllocationPercentage(
            [50, 20, 30]
          )
        ).toBe(true);
      }
    );

    it(
      "rejects allocation percentage above 100",
      () => {
        expect(
          validateAllocationPercentage(
            [50, 30, 30]
          )
        ).toBe(false);
      }
    );

    it(
      "rejects allocation percentage below 100",
      () => {
        expect(
          validateAllocationPercentage(
            [50, 20]
          )
        ).toBe(false);
      }
    );

    it(
      "creates cost allocation",
      () => {
        const allocation =
          createCostAllocation(
            "alloc-test",
            "6100",
            "IT",
            50,
            10000000,
            "2026-07-01"
          );

        expect(
          allocation.allocatedAmount
        ).toBe(5000000);
      }
    );

    it(
      "calculates total allocated amount",
      () => {
        expect(
          getTotalAllocatedAmount(
            allocations
          )
        ).toBe(15000000);
      }
    );

    it(
      "builds cost allocation summary for account 6100",
      () => {
        const summary =
          buildCostAllocationSummary(
            "6100",
            allocations
          );

        expect(summary).toEqual({
          sourceAccountCode:
            "6100",
          totalAllocatedAmount:
            10000000,
          allocationCount: 3
        });
      }
    );

    it(
      "builds cost allocation summary for account 6200",
      () => {
        const summary =
          buildCostAllocationSummary(
            "6200",
            allocations
          );

        expect(summary).toEqual({
          sourceAccountCode:
            "6200",
          totalAllocatedAmount:
            5000000,
          allocationCount: 1
        });
      }
    );
  }
);