import type {
  LiquidityAnalysis,
  LiquidityStatus,
  LiquiditySummary
} from "../types/finance.types";

export function calculateTotalLiquidAssets(
  cashBalance: number,
  bankBalance: number,
  receivablesDueSoon: number
): number {
  return (
    cashBalance +
    bankBalance +
    receivablesDueSoon
  );
}

export function calculateTotalShortTermObligations(
  payablesDueSoon: number,
  shortTermDebt: number,
  operatingCashOutflow: number
): number {
  return (
    payablesDueSoon +
    shortTermDebt +
    operatingCashOutflow
  );
}

export function calculateNetLiquidityPosition(
  totalLiquidAssets: number,
  totalShortTermObligations: number
): number {
  return (
    totalLiquidAssets -
    totalShortTermObligations
  );
}

export function calculateLiquidityAnalysisRatio(
  totalLiquidAssets: number,
  totalShortTermObligations: number
): number {
  if (
    totalShortTermObligations <= 0
  ) {
    return 0;
  }

  return Number(
    (
      totalLiquidAssets /
      totalShortTermObligations
    ).toFixed(2)
  );
}

export function determineLiquidityStatus(
  liquidityRatio: number
): LiquidityStatus {
  if (liquidityRatio >= 2) {
    return "strong";
  }

  if (liquidityRatio >= 1.2) {
    return "stable";
  }

  if (liquidityRatio >= 0.8) {
    return "tight";
  }

  return "critical";
}

export function createLiquidityAnalysis(
  analysis: Omit<
    LiquidityAnalysis,
    | "liquidityRatio"
    | "netLiquidityPosition"
    | "status"
  >
): LiquidityAnalysis {
  const totalLiquidAssets =
    calculateTotalLiquidAssets(
      analysis.cashBalance,
      analysis.bankBalance,
      analysis.receivablesDueSoon
    );

  const totalShortTermObligations =
    calculateTotalShortTermObligations(
      analysis.payablesDueSoon,
      analysis.shortTermDebt,
      analysis.operatingCashOutflow
    );

  const liquidityRatio =
    calculateLiquidityAnalysisRatio(
    totalLiquidAssets,
    totalShortTermObligations
  );

  return {
    ...analysis,
    liquidityRatio,
    netLiquidityPosition:
      calculateNetLiquidityPosition(
        totalLiquidAssets,
        totalShortTermObligations
      ),
    status:
      determineLiquidityStatus(
        liquidityRatio
      )
  };
}

export function buildLiquiditySummary(
  analyses: LiquidityAnalysis[]
): LiquiditySummary {
  const totalLiquidAssets =
    analyses.reduce(
      (total, analysis) =>
        total +
        calculateTotalLiquidAssets(
          analysis.cashBalance,
          analysis.bankBalance,
          analysis.receivablesDueSoon
        ),
      0
    );

  const totalShortTermObligations =
    analyses.reduce(
      (total, analysis) =>
        total +
        calculateTotalShortTermObligations(
          analysis.payablesDueSoon,
          analysis.shortTermDebt,
          analysis.operatingCashOutflow
        ),
      0
    );

  const netLiquidityPosition =
    calculateNetLiquidityPosition(
      totalLiquidAssets,
      totalShortTermObligations
    );

  const liquidityRatio =
    calculateLiquidityAnalysisRatio(
      totalLiquidAssets,
      totalShortTermObligations
    );

  return {
    totalLiquidAssets,
    totalShortTermObligations,
    netLiquidityPosition,
    liquidityRatio,
    status:
      determineLiquidityStatus(
        liquidityRatio
      )
  };
}