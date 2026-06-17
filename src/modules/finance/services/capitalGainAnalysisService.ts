import type {
  CapitalGainRecord,
  CapitalGainSummary
} from "../types/finance.types";

export function createCapitalGainRecord(
  record: CapitalGainRecord
): CapitalGainRecord {
  return {
    ...record
  };
}

export function updateCapitalGainCurrentValue(
  record: CapitalGainRecord,
  currentValue: number
): CapitalGainRecord {
  return {
    ...record,
    currentValue
  };
}

export function calculateCapitalGain(
  record: CapitalGainRecord
): number {
  return record.currentValue - record.purchaseAmount;
}

export function calculateCapitalGainPercentage(
  record: CapitalGainRecord
): number {
  if (record.purchaseAmount <= 0) {
    return 0;
  }

  return Number(
    (
      (calculateCapitalGain(record) /
        record.purchaseAmount) *
      100
    ).toFixed(2)
  );
}

export function getRealizedCapitalGains(
  records: CapitalGainRecord[]
): CapitalGainRecord[] {
  return records.filter(
    record => record.realized
  );
}

export function getUnrealizedCapitalGains(
  records: CapitalGainRecord[]
): CapitalGainRecord[] {
  return records.filter(
    record => !record.realized
  );
}

export function calculateTotalCapitalGain(
  records: CapitalGainRecord[]
): number {
  return records.reduce(
    (total, record) =>
      total + calculateCapitalGain(record),
    0
  );
}

export function getBestCapitalGainRecord(
  records: CapitalGainRecord[]
): CapitalGainRecord | null {
  if (records.length === 0) {
    return null;
  }

  return records.reduce(
    (best, current) =>
      calculateCapitalGainPercentage(current) >
      calculateCapitalGainPercentage(best)
        ? current
        : best
  );
}

export function getWorstCapitalGainRecord(
  records: CapitalGainRecord[]
): CapitalGainRecord | null {
  if (records.length === 0) {
    return null;
  }

  return records.reduce(
    (worst, current) =>
      calculateCapitalGainPercentage(current) <
      calculateCapitalGainPercentage(worst)
        ? current
        : worst
  );
}

export function buildCapitalGainSummary(
  records: CapitalGainRecord[]
): CapitalGainSummary {
  const totalCost = records.reduce(
    (total, record) =>
      total + record.purchaseAmount,
    0
  );

  const totalMarketValue = records.reduce(
    (total, record) =>
      total + record.currentValue,
    0
  );

  const totalGain =
    totalMarketValue - totalCost;

  const gainPercentage =
    totalCost <= 0
      ? 0
      : Number(
          (
            (totalGain / totalCost) *
            100
          ).toFixed(2)
        );

  return {
    totalCost,
    totalMarketValue,
    totalGain,
    gainPercentage
  };
}