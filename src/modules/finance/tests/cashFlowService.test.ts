import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createCashFlowItem,
  filterCashFlowItemsByCategory,
  calculateCashFlowTotalByCategory,
  calculateNetCashFlow,
  generateCashFlowReport
} from "../services/cashFlowService";

import type {
  CashFlowItem
} from "../types/finance.types";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "cashflow-1"
  });
});

const items: CashFlowItem[] = [
  {
    id: "cashflow-1",
    category: "operating",
    description: "Cash received from customers",
    amount: 10000000,
    occurredAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cashflow-2",
    category: "operating",
    description: "Salary payment",
    amount: -3000000,
    occurredAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "cashflow-3",
    category: "investing",
    description: "Equipment purchase",
    amount: -2000000,
    occurredAt: "2026-01-03T00:00:00.000Z"
  },
  {
    id: "cashflow-4",
    category: "financing",
    description: "Owner capital injection",
    amount: 5000000,
    occurredAt: "2026-01-04T00:00:00.000Z"
  }
];

describe("cashFlowService", () => {
  it("creates cash flow item", () => {
    const item = createCashFlowItem(
      "operating",
      " Cash received ",
      10000000,
      "2026-01-01T00:00:00.000Z"
    );

    expect(item).toEqual({
      id: "cashflow-1",
      category: "operating",
      description: "Cash received",
      amount: 10000000,
      occurredAt: "2026-01-01T00:00:00.000Z"
    });
  });

  it("filters cash flow items by category", () => {
    const result = filterCashFlowItemsByCategory(
      items,
      "operating"
    );

    expect(result).toHaveLength(2);
    expect(result[0].category).toBe("operating");
  });

  it("calculates operating cash flow", () => {
    expect(
      calculateCashFlowTotalByCategory(
        items,
        "operating"
      )
    ).toBe(7000000);
  });

  it("calculates investing cash flow", () => {
    expect(
      calculateCashFlowTotalByCategory(
        items,
        "investing"
      )
    ).toBe(-2000000);
  });

  it("calculates financing cash flow", () => {
    expect(
      calculateCashFlowTotalByCategory(
        items,
        "financing"
      )
    ).toBe(5000000);
  });

  it("calculates net cash flow", () => {
    expect(
      calculateNetCashFlow(
        7000000,
        -2000000,
        5000000
      )
    ).toBe(10000000);
  });

  it("generates cash flow report", () => {
    const report = generateCashFlowReport(
      items,
      2000000
    );

    expect(report).toEqual({
      operatingCashFlow: 7000000,
      investingCashFlow: -2000000,
      financingCashFlow: 5000000,
      netCashFlow: 10000000,
      openingCashBalance: 2000000,
      endingCashBalance: 12000000
    });
  });
});