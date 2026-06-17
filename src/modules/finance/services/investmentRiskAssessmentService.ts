import type {
  InvestmentRiskAssessment,
  InvestmentRiskLevel,
  InvestmentRiskSummary
} from "../types/finance.types";

export function determineInvestmentRiskLevel(
  riskScore: number
): InvestmentRiskLevel {
  if (riskScore >= 70) {
    return "high";
  }

  if (riskScore >= 40) {
    return "medium";
  }

  return "low";
}

export function calculateInvestmentRiskScore(
  volatilityPercentage: number,
  maxDrawdownPercentage: number,
  concentrationRiskPercentage: number
): number {
  const score =
    volatilityPercentage * 0.4 +
    maxDrawdownPercentage * 0.35 +
    concentrationRiskPercentage * 0.25;

  return Number(score.toFixed(2));
}

export function createInvestmentRiskAssessment(
  assessment: Omit<
    InvestmentRiskAssessment,
    "riskScore" | "riskLevel"
  >
): InvestmentRiskAssessment {
  const riskScore =
    calculateInvestmentRiskScore(
      assessment.volatilityPercentage,
      assessment.maxDrawdownPercentage,
      assessment.concentrationRiskPercentage
    );

  return {
    ...assessment,
    riskScore,
    riskLevel:
      determineInvestmentRiskLevel(
        riskScore
      )
  };
}

export function updateInvestmentRiskAssessment(
  assessment: InvestmentRiskAssessment,
  updates: Partial<
    Omit<
      InvestmentRiskAssessment,
      "id" | "portfolioId"
    >
  >
): InvestmentRiskAssessment {
  const updated = {
    ...assessment,
    ...updates
  };

  const riskScore =
    calculateInvestmentRiskScore(
      updated.volatilityPercentage,
      updated.maxDrawdownPercentage,
      updated.concentrationRiskPercentage
    );

  return {
    ...updated,
    riskScore,
    riskLevel:
      determineInvestmentRiskLevel(
        riskScore
      )
  };
}

export function getHighRiskAssessments(
  assessments: InvestmentRiskAssessment[]
): InvestmentRiskAssessment[] {
  return assessments.filter(
    assessment =>
      assessment.riskLevel === "high"
  );
}

export function getAssessmentsByPortfolio(
  portfolioId: string,
  assessments: InvestmentRiskAssessment[]
): InvestmentRiskAssessment[] {
  return assessments.filter(
    assessment =>
      assessment.portfolioId === portfolioId
  );
}

export function calculateAverageRiskScore(
  assessments: InvestmentRiskAssessment[]
): number {
  if (assessments.length === 0) {
    return 0;
  }

  const total = assessments.reduce(
    (sum, assessment) =>
      sum + assessment.riskScore,
    0
  );

  return Number(
    (total / assessments.length).toFixed(2)
  );
}

export function buildInvestmentRiskSummary(
  assessments: InvestmentRiskAssessment[]
): InvestmentRiskSummary {
  return {
    totalAssessments:
      assessments.length,
    averageRiskScore:
      calculateAverageRiskScore(
        assessments
      ),
    lowRiskCount:
      assessments.filter(
        assessment =>
          assessment.riskLevel === "low"
      ).length,
    mediumRiskCount:
      assessments.filter(
        assessment =>
          assessment.riskLevel === "medium"
      ).length,
    highRiskCount:
      assessments.filter(
        assessment =>
          assessment.riskLevel === "high"
      ).length
  };
}