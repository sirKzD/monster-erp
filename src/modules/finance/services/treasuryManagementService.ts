import type {
  BankAccount,
  TreasuryPosition,
  TreasuryPositionStatus,
  TreasurySummary
} from "../types/finance.types";

export function calculateTotalBankBalance(
  accounts: BankAccount[]
): number {
  return accounts.reduce(
    (sum, account) =>
      sum + account.balance,
    0
  );
}

export function calculateTotalAvailableFunds(
  cashBalance: number,
  accounts: BankAccount[]
): number {
  return (
    cashBalance +
    calculateTotalBankBalance(
      accounts
    )
  );
}

export function calculateLiquidityRatio(
  availableFunds: number,
  minimumLiquidityTarget: number
): number {
  if (
    minimumLiquidityTarget <= 0
  ) {
    return 0;
  }

  return Number(
    (
      availableFunds /
      minimumLiquidityTarget
    ).toFixed(2)
  );
}

export function determineTreasuryStatus(
  liquidityRatio: number
): TreasuryPositionStatus {
  if (liquidityRatio >= 1.5) {
    return "healthy";
  }

  if (liquidityRatio >= 1) {
    return "warning";
  }

  return "critical";
}

export function createTreasuryPosition(
  cashBalance: number,
  accounts: BankAccount[],
  minimumLiquidityTarget: number
): TreasuryPosition {
  const totalBankBalance =
    calculateTotalBankBalance(
      accounts
    );

  const totalAvailableFunds =
    cashBalance +
    totalBankBalance;

  const liquidityRatio =
    calculateLiquidityRatio(
      totalAvailableFunds,
      minimumLiquidityTarget
    );

  return {
    totalCash: cashBalance,
    totalBankBalance,
    totalAvailableFunds,
    minimumLiquidityTarget,
    status:
      determineTreasuryStatus(
        liquidityRatio
      )
  };
}

export function buildTreasurySummary(
  cashBalance: number,
  accounts: BankAccount[],
  minimumLiquidityTarget: number
): TreasurySummary {
  const totalFunds =
    calculateTotalAvailableFunds(
      cashBalance,
      accounts
    );

  const liquidityRatio =
    calculateLiquidityRatio(
      totalFunds,
      minimumLiquidityTarget
    );

  return {
    totalCashAccounts:
      accounts.length,
    totalFunds,
    liquidityRatio,
    status:
      determineTreasuryStatus(
        liquidityRatio
      )
  };
}