import {
  SolvencyAnalysis,
  SolvencyAnalysisSummary,
  SolvencyLevel,
} from "../types/finance.types";

const analyses = new Map<string, SolvencyAnalysis>();

function calculateDebtToAssetRatio(
  totalAssets: number,
  totalLiabilities: number,
): number {
  if (totalAssets <= 0) {
    return 0;
  }

  return Number(((totalLiabilities / totalAssets) * 100).toFixed(2));
}

function calculateDebtToEquityRatio(
  totalEquity: number,
  totalLiabilities: number,
): number {
  if (totalEquity <= 0) {
    return 0;
  }

  return Number(((totalLiabilities / totalEquity) * 100).toFixed(2));
}

function calculateEquityRatio(
  totalAssets: number,
  totalEquity: number,
): number {
  if (totalAssets <= 0) {
    return 0;
  }

  return Number(((totalEquity / totalAssets) * 100).toFixed(2));
}

function calculateSolvencyRatio(
  totalEquity: number,
  totalLiabilities: number,
): number {
  if (totalLiabilities <= 0) {
    return 0;
  }

  return Number(((totalEquity / totalLiabilities) * 100).toFixed(2));
}

function determineSolvencyLevel(
  solvencyRatio: number,
): SolvencyLevel {
  if (solvencyRatio >= 100) {
    return "EXCELLENT";
  }

  if (solvencyRatio >= 75) {
    return "GOOD";
  }

  if (solvencyRatio >= 50) {
    return "MODERATE";
  }

  if (solvencyRatio >= 25) {
    return "WEAK";
  }

  return "CRITICAL";
}

function createAnalysis(
  analysis: SolvencyAnalysis,
): SolvencyAnalysis {
  analyses.set(analysis.id, analysis);
  return analysis;
}

function updateAnalysis(
  id: string,
  updates: Partial<SolvencyAnalysis>,
): SolvencyAnalysis {
  const existing = analyses.get(id);

  if (!existing) {
    throw new Error("Solvency analysis not found");
  }

  const updated: SolvencyAnalysis = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  analyses.set(id, updated);

  return updated;
}

function deleteAnalysis(id: string): void {
  analyses.delete(id);
}

function getAnalysisById(
  id: string,
): SolvencyAnalysis | undefined {
  return analyses.get(id);
}

function getAllAnalyses(): SolvencyAnalysis[] {
  return Array.from(analyses.values());
}

function generateSummary(): SolvencyAnalysisSummary {
  const items = getAllAnalyses();

  if (items.length === 0) {
    return {
      analysisCount: 0,
      averageDebtToAssetRatio: 0,
      averageDebtToEquityRatio: 0,
      averageEquityRatio: 0,
      averageSolvencyRatio: 0,
      healthyCompanies: 0,
      riskyCompanies: 0,
      highestSolvencyRatio: 0,
      lowestSolvencyRatio: 0,
    };
  }

  const averageDebtToAssetRatio =
    items.reduce(
      (sum, item) => sum + item.debtToAssetRatio,
      0,
    ) / items.length;

  const averageDebtToEquityRatio =
    items.reduce(
      (sum, item) => sum + item.debtToEquityRatio,
      0,
    ) / items.length;

  const averageEquityRatio =
    items.reduce(
      (sum, item) => sum + item.equityRatio,
      0,
    ) / items.length;

  const averageSolvencyRatio =
    items.reduce(
      (sum, item) => sum + item.solvencyRatio,
      0,
    ) / items.length;

  const healthyCompanies = items.filter(
    (item) =>
      item.solvencyLevel === "GOOD" ||
      item.solvencyLevel === "EXCELLENT",
  ).length;

  const riskyCompanies = items.filter(
    (item) =>
      item.solvencyLevel === "WEAK" ||
      item.solvencyLevel === "CRITICAL",
  ).length;

  return {
    analysisCount: items.length,
    averageDebtToAssetRatio: Number(
      averageDebtToAssetRatio.toFixed(2),
    ),
    averageDebtToEquityRatio: Number(
      averageDebtToEquityRatio.toFixed(2),
    ),
    averageEquityRatio: Number(
      averageEquityRatio.toFixed(2),
    ),
    averageSolvencyRatio: Number(
      averageSolvencyRatio.toFixed(2),
    ),
    healthyCompanies,
    riskyCompanies,
    highestSolvencyRatio: Math.max(
      ...items.map((item) => item.solvencyRatio),
    ),
    lowestSolvencyRatio: Math.min(
      ...items.map((item) => item.solvencyRatio),
    ),
  };
}

export const solvencyAnalysisService = {
  createAnalysis,
  updateAnalysis,
  deleteAnalysis,
  getAnalysisById,
  getAllAnalyses,
  calculateDebtToAssetRatio,
  calculateDebtToEquityRatio,
  calculateEquityRatio,
  calculateSolvencyRatio,
  determineSolvencyLevel,
  generateSummary,
};