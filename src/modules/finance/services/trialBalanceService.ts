import type {
  LedgerEntry,
  TrialBalanceLine,
  TrialBalanceReport
} from "../types/finance.types";

export function groupLedgerEntriesByAccount(
  entries: LedgerEntry[]
): Record<string, LedgerEntry[]> {
  return entries.reduce<Record<string, LedgerEntry[]>>(
    (grouped, entry) => {
      if (!grouped[entry.accountCode]) {
        grouped[entry.accountCode] = [];
      }

      grouped[entry.accountCode].push(entry);

      return grouped;
    },
    {}
  );
}

export function createTrialBalanceLine(
  accountCode: string,
  entries: LedgerEntry[]
): TrialBalanceLine {
  return {
    accountCode,
    debit: entries.reduce(
      (total, entry) => total + entry.debit,
      0
    ),
    credit: entries.reduce(
      (total, entry) => total + entry.credit,
      0
    )
  };
}

export function calculateTrialBalanceTotalDebit(
  lines: TrialBalanceLine[]
): number {
  return lines.reduce(
    (total, line) => total + line.debit,
    0
  );
}

export function calculateTrialBalanceTotalCredit(
  lines: TrialBalanceLine[]
): number {
  return lines.reduce(
    (total, line) => total + line.credit,
    0
  );
}

export function isTrialBalanceBalanced(
  lines: TrialBalanceLine[]
): boolean {
  return calculateTrialBalanceTotalDebit(lines) ===
    calculateTrialBalanceTotalCredit(lines);
}

export function generateTrialBalance(
  entries: LedgerEntry[]
): TrialBalanceReport {
  const groupedEntries = groupLedgerEntriesByAccount(
    entries
  );

  const lines = Object.entries(groupedEntries).map(
    ([accountCode, accountEntries]) =>
      createTrialBalanceLine(
        accountCode,
        accountEntries
      )
  );

  return {
    lines,
    totalDebit: calculateTrialBalanceTotalDebit(
      lines
    ),
    totalCredit: calculateTrialBalanceTotalCredit(
      lines
    ),
    isBalanced: isTrialBalanceBalanced(lines)
  };
}