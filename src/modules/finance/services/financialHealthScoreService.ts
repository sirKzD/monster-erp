import type {
  FinancialHealthGrade,
  FinancialHealthScore,
  FinancialHealthScoreSummary
} from "../types/finance.types";

export function calculateOverallFinancialHealthScore(
  liquidityScore: number,
  profitabilityScore: number,
  solvencyScore: number,
  efficiencyScore: number,
  cashFlowScore: number
): number {
  return Number(
    (
      (
        liquidityScore +
        profitabilityScore +
        solvencyScore +
        efficiencyScore +
        cashFlowScore
      ) / 5
    ).toFixed(2)
  );
}

export function determineFinancialHealthGrade(
  overallScore: number
): FinancialHealthGrade {
  if (overallScore >= 85) {
    return "EXCELLENT";
  }

  if (overallScore >= 70) {
    return "GOOD";
  }

  if (overallScore >= 50) {
    return "FAIR";
  }

  return "POOR";
}

export function createFinancialHealthScore(
  assessment: Omit<
    FinancialHealthScore,
    "overallScore" | "grade"
  >
): FinancialHealthScore {
  const overallScore =
    calculateOverallFinancialHealthScore(
      assessment.liquidityScore,
      assessment.profitabilityScore,
      assessment.solvencyScore,
      assessment.efficiencyScore,
      assessment.cashFlowScore
    );

  return {
    ...assessment,
    overallScore,
    grade:
      determineFinancialHealthGrade(
        overallScore
      )
  };
}

export function updateFinancialHealthScore(
  assessment: FinancialHealthScore,
  updates: Partial<
    Omit<
      FinancialHealthScore,
      "id" | "companyName"
    >
  >
): FinancialHealthScore {
  const updated = {
    ...assessment,
    ...updates
  };

  const overallScore =
    calculateOverallFinancialHealthScore(
      updated.liquidityScore,
      updated.profitabilityScore,
      updated.solvencyScore,
      updated.efficiencyScore,
      updated.cashFlowScore
    );

  return {
    ...updated,
    overallScore,
    grade:
      determineFinancialHealthGrade(
        overallScore
      )
  };
}

export function getFinancialHealthScoresByGrade(
  assessments: FinancialHealthScore[],
  grade: FinancialHealthGrade
): FinancialHealthScore[] {
  return assessments.filter(
    assessment =>
      assessment.grade === grade
  );
}

export function getHighestFinancialHealthScore(
  assessments: FinancialHealthScore[]
): FinancialHealthScore | null {
  if (assessments.length === 0) {
    return null;
  }

  return assessments.reduce(
    (highest, current) =>
      current.overallScore >
      highest.overallScore
        ? current
        : highest
  );
}

export function getLowestFinancialHealthScore(
  assessments: FinancialHealthScore[]
): FinancialHealthScore | null {
  if (assessments.length === 0) {
    return null;
  }

  return assessments.reduce(
    (lowest, current) =>
      current.overallScore <
      lowest.overallScore
        ? current
        : lowest
  );
}

export function calculateAverageFinancialHealthScore(
  assessments: FinancialHealthScore[]
): number {
  if (assessments.length === 0) {
    return 0;
  }

  const total = assessments.reduce(
    (sum, assessment) =>
      sum + assessment.overallScore,
    0
  );

  return Number(
    (total / assessments.length).toFixed(2)
  );
}

export function buildFinancialHealthScoreSummary(
  assessments: FinancialHealthScore[]
): FinancialHealthScoreSummary {
  return {
    totalAssessments:
      assessments.length,
    averageScore:
      calculateAverageFinancialHealthScore(
        assessments
      ),
    highestScore:
      getHighestFinancialHealthScore(
        assessments
      )?.overallScore ?? 0,
    lowestScore:
      getLowestFinancialHealthScore(
        assessments
      )?.overallScore ?? 0,
    poorCount:
      getFinancialHealthScoresByGrade(
        assessments,
        "POOR"
      ).length,
    fairCount:
      getFinancialHealthScoresByGrade(
        assessments,
        "FAIR"
      ).length,
    goodCount:
      getFinancialHealthScoresByGrade(
        assessments,
        "GOOD"
      ).length,
    excellentCount:
      getFinancialHealthScoresByGrade(
        assessments,
        "EXCELLENT"
      ).length
  };
}