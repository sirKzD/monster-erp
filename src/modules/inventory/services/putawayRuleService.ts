export interface PutawayRule {
  id: string;
  productId?: string;
  categoryId?: string;
  warehouseId: string;
  locationId: string;
  priority: number;
}

export function createPutawayRule(
  warehouseId: string,
  locationId: string,
  priority: number,
  productId?: string,
  categoryId?: string
): PutawayRule {
  return {
    id: crypto.randomUUID(),
    warehouseId,
    locationId,
    priority,
    productId,
    categoryId
  };
}

export function findPutawayLocation(
  rules: PutawayRule[],
  warehouseId: string,
  productId: string,
  categoryId: string
): string | null {
  const matchedRules = rules
    .filter(rule => rule.warehouseId === warehouseId)
    .filter(rule =>
      rule.productId === productId ||
      rule.categoryId === categoryId ||
      (!rule.productId && !rule.categoryId)
    )
    .sort((a, b) => {
      const specificityA =
        a.productId ? 3 :
        a.categoryId ? 2 :
        1;

      const specificityB =
        b.productId ? 3 :
        b.categoryId ? 2 :
        1;

      if (specificityB !== specificityA) {
        return specificityB - specificityA;
      }

      return b.priority - a.priority;
    });

  return matchedRules[0]?.locationId ?? null;
}

export function filterPutawayRulesByWarehouse(
  rules: PutawayRule[],
  warehouseId: string
): PutawayRule[] {
  return rules.filter(
    rule => rule.warehouseId === warehouseId
  );
}