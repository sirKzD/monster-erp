import {
  describe,
  expect,
  it
} from "vitest";

import {
  analyzePortfolioRebalancing,
  approvePortfolioRebalancing,
  buildPortfolioRebalancingSummary,
  calculateAssetVariancePercentage,
  calculateRecommendedBuyAmount,
  calculateRecommendedSellAmount,
  completePortfolioRebalancing,
  createPortfolioRebalancing,
  createRebalancingAsset,
  getAssetsNeedingRebalance,
  updatePortfolioRebalancing
} from "../services/portfolioRebalancingService";

import type {
  PortfolioRebalancing
} from "../types/finance.types";

const rebalancing: PortfolioRebalancing = {
  id: "rebalance-1",
  portfolioId: "portfolio-1",
  name: "Quarterly Rebalance",
  rebalancingDate: "2026-06-30",
  thresholdPercentage: 5,
  status: "DRAFT",
  assets: [
    {
      investmentId: "investment-1",
      symbol: "BBCA",
      currentValue: 60000000,
      currentWeight: 60,
      targetWeight: 50,
      variancePercentage: 10,
      recommendedBuyAmount: 0,
      recommendedSellAmount: 10000000
    },
    {
      investmentId: "investment-2",
      symbol: "TLKM",
      currentValue: 30000000,
      currentWeight: 30,
      targetWeight: 40,
      variancePercentage: -10,
      recommendedBuyAmount: 10000000,
      recommendedSellAmount: 0
    },
    {
      investmentId: "investment-3",
      symbol: "UNVR",
      currentValue: 10000000,
      currentWeight: 10,
      targetWeight: 10,
      variancePercentage: 0,
      recommendedBuyAmount: 0,
      recommendedSellAmount: 0
    }
  ],
  notes: "Initial portfolio rebalancing",
  createdAt: "2026-06-30",
  updatedAt: "2026-06-30"
};

describe("portfolioRebalancingService", () => {
  it("calculates asset variance percentage", () => {
    expect(
      calculateAssetVariancePercentage(
        60,
        50
      )
    ).toBe(10);
  });

  it("calculates recommended buy amount", () => {
    expect(
      calculateRecommendedBuyAmount(
        100000000,
        -10
      )
    ).toBe(10000000);
  });

  it("calculates recommended sell amount", () => {
    expect(
      calculateRecommendedSellAmount(
        100000000,
        10
      )
    ).toBe(10000000);
  });

  it("creates rebalancing asset", () => {
    expect(
      createRebalancingAsset(
        {
          investmentId:
            "investment-new",
          symbol: "ASII",
          currentValue:
            20000000,
          currentWeight: 20,
          targetWeight: 25
        },
        100000000
      )
    ).toEqual({
      investmentId: "investment-new",
      symbol: "ASII",
      currentValue: 20000000,
      currentWeight: 20,
      targetWeight: 25,
      variancePercentage: -5,
      recommendedBuyAmount: 5000000,
      recommendedSellAmount: 0
    });
  });

  it("creates portfolio rebalancing", () => {
    expect(
      createPortfolioRebalancing(
        rebalancing
      )
    ).toEqual(rebalancing);
  });

  it("updates portfolio rebalancing", () => {
    const updated =
      updatePortfolioRebalancing(
        rebalancing,
        {
          name:
            "Updated Rebalance",
          notes:
            "Updated notes"
        }
      );

    expect(updated.name).toBe(
      "Updated Rebalance"
    );

    expect(updated.notes).toBe(
      "Updated notes"
    );
  });

  it("analyzes portfolio rebalancing", () => {
    expect(
      analyzePortfolioRebalancing(
        rebalancing
      ).status
    ).toBe("ANALYZED");
  });

  it("approves portfolio rebalancing", () => {
    expect(
      approvePortfolioRebalancing(
        rebalancing
      ).status
    ).toBe("APPROVED");
  });

  it("completes portfolio rebalancing", () => {
    expect(
      completePortfolioRebalancing(
        rebalancing
      ).status
    ).toBe("COMPLETED");
  });

  it("gets assets needing rebalance", () => {
    expect(
      getAssetsNeedingRebalance(
        rebalancing
      )
    ).toHaveLength(2);
  });

  it("builds portfolio rebalancing summary", () => {
    expect(
      buildPortfolioRebalancingSummary(
        rebalancing
      )
    ).toEqual({
      totalPortfolioValue:
        100000000,
      assetCount: 3,
      overweightAssets: 1,
      underweightAssets: 1,
      totalBuyAmount:
        10000000,
      totalSellAmount:
        10000000,
      largestDeviationPercentage:
        10
    });
  });

  it("builds empty portfolio rebalancing summary", () => {
    expect(
      buildPortfolioRebalancingSummary({
        ...rebalancing,
        assets: []
      })
    ).toEqual({
      totalPortfolioValue: 0,
      assetCount: 0,
      overweightAssets: 0,
      underweightAssets: 0,
      totalBuyAmount: 0,
      totalSellAmount: 0,
      largestDeviationPercentage: 0
    });
  });
});