import type {
  PortfolioRebalancing,
  PortfolioRebalancingAsset,
  PortfolioRebalancingSummary
} from "../types/finance.types";

export function calculateAssetVariancePercentage(
  currentWeight: number,
  targetWeight: number
): number {
  return Number(
    (
      currentWeight -
      targetWeight
    ).toFixed(2)
  );
}

export function calculateRecommendedBuyAmount(
  totalPortfolioValue: number,
  variancePercentage: number
): number {
  if (variancePercentage >= 0) {
    return 0;
  }

  return Number(
    (
      totalPortfolioValue *
      (Math.abs(variancePercentage) / 100)
    ).toFixed(2)
  );
}

export function calculateRecommendedSellAmount(
  totalPortfolioValue: number,
  variancePercentage: number
): number {
  if (variancePercentage <= 0) {
    return 0;
  }

  return Number(
    (
      totalPortfolioValue *
      (variancePercentage / 100)
    ).toFixed(2)
  );
}

export function createRebalancingAsset(
  asset: Omit<
    PortfolioRebalancingAsset,
    | "variancePercentage"
    | "recommendedBuyAmount"
    | "recommendedSellAmount"
  >,
  totalPortfolioValue: number
): PortfolioRebalancingAsset {
  const variancePercentage =
    calculateAssetVariancePercentage(
      asset.currentWeight,
      asset.targetWeight
    );

  return {
    ...asset,
    variancePercentage,
    recommendedBuyAmount:
      calculateRecommendedBuyAmount(
        totalPortfolioValue,
        variancePercentage
      ),
    recommendedSellAmount:
      calculateRecommendedSellAmount(
        totalPortfolioValue,
        variancePercentage
      )
  };
}

export function createPortfolioRebalancing(
  rebalancing: PortfolioRebalancing
): PortfolioRebalancing {
  return {
    ...rebalancing
  };
}

export function updatePortfolioRebalancing(
  rebalancing: PortfolioRebalancing,
  updates: Partial<
    Omit<
      PortfolioRebalancing,
      "id" | "portfolioId"
    >
  >
): PortfolioRebalancing {
  return {
    ...rebalancing,
    ...updates
  };
}

export function analyzePortfolioRebalancing(
  rebalancing: PortfolioRebalancing
): PortfolioRebalancing {
  return {
    ...rebalancing,
    status: "ANALYZED"
  };
}

export function approvePortfolioRebalancing(
  rebalancing: PortfolioRebalancing
): PortfolioRebalancing {
  return {
    ...rebalancing,
    status: "APPROVED"
  };
}

export function completePortfolioRebalancing(
  rebalancing: PortfolioRebalancing
): PortfolioRebalancing {
  return {
    ...rebalancing,
    status: "COMPLETED"
  };
}

export function getAssetsNeedingRebalance(
  rebalancing: PortfolioRebalancing
): PortfolioRebalancingAsset[] {
  return rebalancing.assets.filter(
    asset =>
      Math.abs(
        asset.variancePercentage
      ) >=
      rebalancing.thresholdPercentage
  );
}

export function buildPortfolioRebalancingSummary(
  rebalancing: PortfolioRebalancing
): PortfolioRebalancingSummary {
  const totalPortfolioValue =
    rebalancing.assets.reduce(
      (total, asset) =>
        total + asset.currentValue,
      0
    );

  const overweightAssets =
    rebalancing.assets.filter(
      asset =>
        asset.variancePercentage > 0
    ).length;

  const underweightAssets =
    rebalancing.assets.filter(
      asset =>
        asset.variancePercentage < 0
    ).length;

  const totalBuyAmount =
    rebalancing.assets.reduce(
      (total, asset) =>
        total +
        asset.recommendedBuyAmount,
      0
    );

  const totalSellAmount =
    rebalancing.assets.reduce(
      (total, asset) =>
        total +
        asset.recommendedSellAmount,
      0
    );

  const largestDeviationPercentage =
    rebalancing.assets.length === 0
      ? 0
      : Math.max(
          ...rebalancing.assets.map(
            asset =>
              Math.abs(
                asset.variancePercentage
              )
          )
        );

  return {
    totalPortfolioValue,
    assetCount:
      rebalancing.assets.length,
    overweightAssets,
    underweightAssets,
    totalBuyAmount,
    totalSellAmount,
    largestDeviationPercentage
  };
}