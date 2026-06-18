import type {
  CreditRiskAnalysis,
  CreditRiskAnalysisSummary,
  CreditRiskLevel
} from "../types/finance.types";

export function calculateCreditUtilizationRatio(
  outstandingBalance: number,
  creditLimit: number
): number {
  if (creditLimit <= 0) {
    return 0;
  }

  return Number(
    ((outstandingBalance / creditLimit) * 100).toFixed(2)
  );
}

export function calculateCreditRiskScore(
  overdueDays: number,
  paymentHistoryScore: number,
  utilizationRatio: number
): number {
  const overdueScore = Math.min(overdueDays * 0.8, 40);

  const paymentPenalty =
    (100 - paymentHistoryScore) * 0.4;

  const utilizationPenalty =
    utilizationRatio * 0.2;

  return Number(
    Math.min(
      overdueScore +
        paymentPenalty +
        utilizationPenalty,
      100
    ).toFixed(2)
  );
}

export function determineCreditRiskLevel(
  riskScore: number
): CreditRiskLevel {
  if (riskScore >= 75) {
    return "CRITICAL";
  }

  if (riskScore >= 50) {
    return "HIGH";
  }

  if (riskScore >= 25) {
    return "MODERATE";
  }

  return "LOW";
}

export function createCreditRiskAnalysis(
  analysis: Omit<
    CreditRiskAnalysis,
    | "creditUtilizationRatio"
    | "riskScore"
    | "riskLevel"
  >
): CreditRiskAnalysis {
  const creditUtilizationRatio =
    calculateCreditUtilizationRatio(
      analysis.outstandingBalance,
      analysis.creditLimit
    );

  const riskScore =
    calculateCreditRiskScore(
      analysis.overdueDays,
      analysis.paymentHistoryScore,
      creditUtilizationRatio
    );

  return {
    ...analysis,
    creditUtilizationRatio,
    riskScore,
    riskLevel:
      determineCreditRiskLevel(
        riskScore
      )
  };
}

export function updateCreditRiskAnalysis(
  analysis: CreditRiskAnalysis,
  updates: Partial<
    Omit<
      CreditRiskAnalysis,
      "id" | "customerId"
    >
  >
): CreditRiskAnalysis {
  const updated = {
    ...analysis,
    ...updates
  };

  const creditUtilizationRatio =
    calculateCreditUtilizationRatio(
      updated.outstandingBalance,
      updated.creditLimit
    );

  const riskScore =
    calculateCreditRiskScore(
      updated.overdueDays,
      updated.paymentHistoryScore,
      creditUtilizationRatio
    );

  return {
    ...updated,
    creditUtilizationRatio,
    riskScore,
    riskLevel:
      determineCreditRiskLevel(
        riskScore
      )
  };
}

export function getCreditRiskAnalysesByLevel(
  analyses: CreditRiskAnalysis[],
  riskLevel: CreditRiskLevel
): CreditRiskAnalysis[] {
  return analyses.filter(
    analysis =>
      analysis.riskLevel === riskLevel
  );
}

export function getHighRiskCustomers(
  analyses: CreditRiskAnalysis[]
): CreditRiskAnalysis[] {
  return analyses.filter(
    analysis =>
      analysis.riskLevel === "HIGH" ||
      analysis.riskLevel ===
        "CRITICAL"
  );
}

export function calculateAverageCreditRiskScore(
  analyses: CreditRiskAnalysis[]
): number {
  if (analyses.length === 0) {
    return 0;
  }

  const total = analyses.reduce(
    (sum, analysis) =>
      sum + analysis.riskScore,
    0
  );

  return Number(
    (
      total / analyses.length
    ).toFixed(2)
  );
}

export function buildCreditRiskAnalysisSummary(
  analyses: CreditRiskAnalysis[]
): CreditRiskAnalysisSummary {
  return {
    totalCustomers:
      analyses.length,

    averageRiskScore:
      calculateAverageCreditRiskScore(
        analyses
      ),

    lowRiskCount:
      getCreditRiskAnalysesByLevel(
        analyses,
        "LOW"
      ).length,

    moderateRiskCount:
      getCreditRiskAnalysesByLevel(
        analyses,
        "MODERATE"
      ).length,

    highRiskCount:
      getCreditRiskAnalysesByLevel(
        analyses,
        "HIGH"
      ).length,

    criticalRiskCount:
      getCreditRiskAnalysesByLevel(
        analyses,
        "CRITICAL"
      ).length,

    totalOutstandingBalance:
      analyses.reduce(
        (sum, analysis) =>
          sum +
          analysis.outstandingBalance,
        0
      ),

    totalOverdueBalance:
      analyses.reduce(
        (sum, analysis) =>
          sum +
          analysis.overdueBalance,
        0
      )
  };
}