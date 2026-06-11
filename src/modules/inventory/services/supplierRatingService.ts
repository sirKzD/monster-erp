import type {
  Supplier
} from "../types/inventory.types";

export interface SupplierRatingInput {
  deliveryScore: number;
  qualityScore: number;
  priceScore: number;
}

export function clampRating(
  rating: number
): number {
  return Math.min(Math.max(rating, 0), 5);
}

export function calculateSupplierRating(
  input: SupplierRatingInput
): number {
  const delivery = clampRating(input.deliveryScore);
  const quality = clampRating(input.qualityScore);
  const price = clampRating(input.priceScore);

  return Number(
    ((delivery + quality + price) / 3).toFixed(2)
  );
}

export function applySupplierRating(
  supplier: Supplier,
  input: SupplierRatingInput
): Supplier {
  return {
    ...supplier,
    rating: calculateSupplierRating(input)
  };
}