import type {
  CashFlowCategory,
  CashFlowItem,
  CashFlowReport
} from "../types/finance.types";

export function createCashFlowItem(
  category: CashFlowCategory,
  description: string,
  amount: number,
  occurredAt: string
): CashFlowItem {
  return {
    id: crypto.randomUUID(),
    category,
    description: description.trim(),
    amount,
    occurredAt
  };
}

export function filterCashFlowItemsByCategory(
  items: CashFlowItem[],
  category: CashFlowCategory
): CashFlowItem[] {
  return items.filter(
    item => item.category === category
  );
}

export function calculateCashFlowTotalByCategory(
  items: CashFlowItem[],
  category: CashFlowCategory
): number {
  return filterCashFlowItemsByCategory(
    items,
    category
  ).reduce(
    (total, item) => total + item.amount,
    0
  );
}

export function calculateNetCashFlow(
  operatingCashFlow: number,
  investingCashFlow: number,
  financingCashFlow: number
): number {
  return operatingCashFlow +
    investingCashFlow +
    financingCashFlow;
}

export function generateCashFlowReport(
  items: CashFlowItem[],
  openingCashBalance: number
): CashFlowReport {
  const operatingCashFlow =
    calculateCashFlowTotalByCategory(
      items,
      "operating"
    );

  const investingCashFlow =
    calculateCashFlowTotalByCategory(
      items,
      "investing"
    );

  const financingCashFlow =
    calculateCashFlowTotalByCategory(
      items,
      "financing"
    );

  const netCashFlow = calculateNetCashFlow(
    operatingCashFlow,
    investingCashFlow,
    financingCashFlow
  );

  return {
    operatingCashFlow,
    investingCashFlow,
    financingCashFlow,
    netCashFlow,
    openingCashBalance,
    endingCashBalance: openingCashBalance + netCashFlow
  };
}