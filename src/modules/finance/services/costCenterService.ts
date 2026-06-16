import type {
  CostCenter,
  CostCenterAllocation,
  CostCenterSummary
} from "../types/finance.types";

export function createCostCenter(
  code: string,
  name: string
): CostCenter | null {
  if (code.trim().length === 0) return null;
  if (name.trim().length === 0) return null;

  return {
    id: crypto.randomUUID(),
    code: code.trim(),
    name: name.trim(),
    status: "active",
    createdAt: new Date().toISOString()
  };
}

export function deactivateCostCenter(
  costCenter: CostCenter
): CostCenter | null {
  if (costCenter.status !== "active") {
    return null;
  }

  return {
    ...costCenter,
    status: "inactive"
  };
}

export function allocateCostToCenter(
  costCenter: CostCenter,
  accountCode: string,
  amount: number,
  description: string,
  allocatedAt: string
): CostCenterAllocation | null {
  if (costCenter.status !== "active") return null;
  if (accountCode.trim().length === 0) return null;
  if (amount <= 0) return null;
  if (description.trim().length === 0) return null;

  return {
    id: crypto.randomUUID(),
    costCenterCode: costCenter.code,
    accountCode: accountCode.trim(),
    amount,
    description: description.trim(),
    allocatedAt
  };
}

export function filterAllocationsByCostCenter(
  allocations: CostCenterAllocation[],
  costCenterCode: string
): CostCenterAllocation[] {
  return allocations.filter(
    allocation =>
      allocation.costCenterCode ===
      costCenterCode.trim()
  );
}

export function calculateCostCenterTotal(
  allocations: CostCenterAllocation[],
  costCenterCode: string
): number {
  return filterAllocationsByCostCenter(
    allocations,
    costCenterCode
  ).reduce(
    (total, allocation) =>
      total + allocation.amount,
    0
  );
}

export function buildCostCenterSummary(
  allocations: CostCenterAllocation[],
  costCenterCode: string
): CostCenterSummary {
  const filteredAllocations =
    filterAllocationsByCostCenter(
      allocations,
      costCenterCode
    );

  return {
    costCenterCode: costCenterCode.trim(),
    totalAllocated:
      filteredAllocations.reduce(
        (total, allocation) =>
          total + allocation.amount,
        0
      ),
    allocationCount:
      filteredAllocations.length
  };
}