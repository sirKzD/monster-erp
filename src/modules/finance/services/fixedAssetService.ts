import type {
  FixedAsset
} from "../types/finance.types";

export function createFixedAsset(
  name: string,
  acquisitionCost: number,
  residualValue: number,
  usefulLifeMonths: number,
  acquiredAt: string
): FixedAsset | null {
  if (name.trim().length === 0) return null;
  if (acquisitionCost <= 0) return null;
  if (residualValue < 0) return null;
  if (residualValue >= acquisitionCost) return null;
  if (usefulLifeMonths <= 0) return null;

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    acquisitionCost,
    residualValue,
    usefulLifeMonths,
    status: "active",
    acquiredAt
  };
}

export function calculateDepreciableAmount(
  asset: FixedAsset
): number {
  return asset.acquisitionCost - asset.residualValue;
}

export function calculateMonthlyDepreciation(
  asset: FixedAsset
): number {
  return Math.round(
    calculateDepreciableAmount(asset) /
      asset.usefulLifeMonths
  );
}

export function disposeFixedAsset(
  asset: FixedAsset,
  disposedAt: string
): FixedAsset | null {
  if (asset.status !== "active") {
    return null;
  }

  return {
    ...asset,
    status: "disposed",
    disposedAt
  };
}

export function filterActiveFixedAssets(
  assets: FixedAsset[]
): FixedAsset[] {
  return assets.filter(
    asset => asset.status === "active"
  );
}

export function calculateTotalFixedAssetValue(
  assets: FixedAsset[]
): number {
  return assets
    .filter(asset => asset.status === "active")
    .reduce(
      (total, asset) =>
        total + asset.acquisitionCost,
      0
    );
}