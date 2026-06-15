import type {
  JournalEntry,
  LedgerEntry
} from "../types/finance.types";

export function postJournalToLedger(
  journal: JournalEntry
): LedgerEntry[] | null {
  if (journal.status !== "posted") {
    return null;
  }

  return journal.lines.map(line => ({
    id: crypto.randomUUID(),
    journalEntryId: journal.id,
    accountCode: line.accountCode,
    debit: line.debit,
    credit: line.credit,
    balance: line.debit - line.credit,
    reference: journal.reference,
    description: journal.description,
    postedAt: journal.postedAt ?? new Date().toISOString()
  }));
}

export function getLedgerByAccount(
  entries: LedgerEntry[],
  accountCode: string
): LedgerEntry[] {
  return entries.filter(
    entry => entry.accountCode === accountCode.trim()
  );
}

export function calculateRunningBalance(
  entries: LedgerEntry[]
): LedgerEntry[] {
  let runningBalance = 0;

  return entries.map(entry => {
    runningBalance += entry.debit - entry.credit;

    return {
      ...entry,
      balance: runningBalance
    };
  });
}

export function getAccountBalance(
  entries: LedgerEntry[],
  accountCode: string
): number {
  return getLedgerByAccount(
    entries,
    accountCode
  ).reduce(
    (balance, entry) =>
      balance + entry.debit - entry.credit,
    0
  );
}

export function getLedgerByPeriod(
  entries: LedgerEntry[],
  startDate: string,
  endDate: string
): LedgerEntry[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return entries.filter(entry => {
    const postedAt = new Date(entry.postedAt).getTime();

    return postedAt >= start && postedAt <= end;
  });
}

export function generateLedgerSummary(
  entries: LedgerEntry[]
): {
  totalDebit: number;
  totalCredit: number;
  transactionCount: number;
} {
  return {
    totalDebit: entries.reduce(
      (total, entry) => total + entry.debit,
      0
    ),
    totalCredit: entries.reduce(
      (total, entry) => total + entry.credit,
      0
    ),
    transactionCount: entries.length
  };
}