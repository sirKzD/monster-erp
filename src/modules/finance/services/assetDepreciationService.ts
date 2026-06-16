import type {
  AssetDepreciationSchedule,
  FixedAsset
} from "../types/finance.types";

import {
  calculateDepreciableAmount,
  calculateMonthlyDepreciation
} from "./fixedAssetService";

export function calculateAccumulatedDepreciation(
  asset: FixedAsset,
  months: number
): number {
  if (months <= 0) return 0;

  const limitedMonths = Math.min(
    months,
    asset.usefulLifeMonths
  );

  return Math.min(
    calculateMonthlyDepreciation(asset) *
      limitedMonths,
    calculateDepreciableAmount(asset)
  );
}

export function calculateBookValue(
  asset: FixedAsset,
  months: number
): number {
  const accumulatedDepreciation =
    calculateAccumulatedDepreciation(
      asset,
      months
    );

  return Math.max(
    asset.acquisitionCost -
      accumulatedDepreciation,
    asset.residualValue
  );
}

export function generateDepreciationSchedule(
  asset: FixedAsset
): AssetDepreciationSchedule[] {
  return Array.from(
    {
      length: asset.usefulLifeMonths
    },
    (_, index) => {
      const month = index + 1;
      const accumulatedDepreciation =
        calculateAccumulatedDepreciation(
          asset,
          month
        );

      return {
        assetId: asset.id,
        month,
        depreciationAmount:
          calculateMonthlyDepreciation(asset),
        accumulatedDepreciation,
        bookValue: calculateBookValue(
          asset,
          month
        )
      };
    }
  );
}

export function getDepreciationAtMonth(
  asset: FixedAsset,
  month: number
): AssetDepreciationSchedule | null {
  if (
    month <= 0 ||
    month > asset.usefulLifeMonths
  ) {
    return null;
  }

  const accumulatedDepreciation =
    calculateAccumulatedDepreciation(
      asset,
      month
    );

  return {
    assetId: asset.id,
    month,
    depreciationAmount:
      calculateMonthlyDepreciation(asset),
    accumulatedDepreciation,
    bookValue: calculateBookValue(
      asset,
      month
    )
  };
}