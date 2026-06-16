import type {
  AccountingPeriod,
  FiscalYear
} from "../types/finance.types";

export function createAccountingPeriod(
  name: string,
  startDate: string,
  endDate: string
): AccountingPeriod | null {
  if (name.trim().length === 0) return null;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return null;
  }

  if (start > end) return null;

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    startDate,
    endDate,
    status: "open",
    createdAt: new Date().toISOString()
  };
}

export function closeAccountingPeriod(
  period: AccountingPeriod
): AccountingPeriod | null {
  if (period.status !== "open") {
    return null;
  }

  return {
    ...period,
    status: "closed"
  };
}

export function lockAccountingPeriod(
  period: AccountingPeriod
): AccountingPeriod | null {
  if (period.status === "locked") {
    return null;
  }

  return {
    ...period,
    status: "locked"
  };
}

export function isDateWithinAccountingPeriod(
  date: string,
  period: AccountingPeriod
): boolean {
  const target = new Date(date).getTime();
  const start = new Date(period.startDate).getTime();
  const end = new Date(period.endDate).getTime();

  return target >= start && target <= end;
}

export function isPostingAllowed(
  date: string,
  periods: AccountingPeriod[]
): boolean {
  return periods.some(
    period =>
      period.status === "open" &&
      isDateWithinAccountingPeriod(
        date,
        period
      )
  );
}

export function findAccountingPeriodByDate(
  date: string,
  periods: AccountingPeriod[]
): AccountingPeriod | undefined {
  return periods.find(period =>
    isDateWithinAccountingPeriod(
      date,
      period
    )
  );
}

export function createFiscalYear(
  year: number,
  periods: AccountingPeriod[]
): FiscalYear | null {
  if (periods.length === 0) return null;

  const sortedPeriods = [...periods].sort(
    (a, b) =>
      new Date(a.startDate).getTime() -
      new Date(b.startDate).getTime()
  );

  return {
    id: crypto.randomUUID(),
    year,
    startDate: sortedPeriods[0].startDate,
    endDate:
      sortedPeriods[sortedPeriods.length - 1]
        .endDate,
    periods: sortedPeriods,
    createdAt: new Date().toISOString()
  };
}