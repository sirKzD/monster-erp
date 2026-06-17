import type {
  CostAllocation,
  CostAllocationSummary
} from "../types/finance.types";

export function calculateAllocatedAmount(
  totalAmount: number,
  allocationPercentage: number
): number {
  return Number(
    (
      totalAmount *
      (allocationPercentage / 100)
    ).toFixed(2)
  );
}

export function validateAllocationPercentage(
  allocations: number[]
): boolean {
  const total = allocations.reduce(
    (sum, value) => sum + value,
    0
  );

  return total === 100;
}

export function createCostAllocation(
  id: string,
  sourceAccountCode: string,
  targetCostCenterCode: string,
  allocationPercentage: number,
  totalAmount: number,
  allocatedAt: string
): CostAllocation {
  return {
    id,
    sourceAccountCode,
    targetCostCenterCode,
    allocationPercentage,
    allocatedAmount:
      calculateAllocatedAmount(
        totalAmount,
        allocationPercentage
      ),
    allocatedAt
  };
}

export function getTotalAllocatedAmount(
  allocations: CostAllocation[]
): number {
  return allocations.reduce(
    (sum, allocation) =>
      sum + allocation.allocatedAmount,
    0
  );
}

export function buildCostAllocationSummary(
  sourceAccountCode: string,
  allocations: CostAllocation[]
): CostAllocationSummary {
  const filtered = allocations.filter(
    allocation =>
      allocation.sourceAccountCode ===
      sourceAccountCode
  );

  return {
    sourceAccountCode,
    totalAllocatedAmount:
      getTotalAllocatedAmount(filtered),
    allocationCount: filtered.length
  };
}