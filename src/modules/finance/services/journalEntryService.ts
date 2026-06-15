import type {
  Account,
  JournalEntry,
  JournalEntryLine
} from "../types/finance.types";

import {
  findAccountByCode
} from "./chartOfAccountService";

export function calculateTotalDebit(
  lines: JournalEntryLine[]
): number {
  return lines.reduce(
    (total, line) => total + line.debit,
    0
  );
}

export function calculateTotalCredit(
  lines: JournalEntryLine[]
): number {
  return lines.reduce(
    (total, line) => total + line.credit,
    0
  );
}

export function isJournalBalanced(
  lines: JournalEntryLine[]
): boolean {
  return calculateTotalDebit(lines) ===
    calculateTotalCredit(lines);
}

export function validateJournalEntryLines(
  accounts: Account[],
  lines: JournalEntryLine[]
): boolean {
  if (lines.length < 2) return false;

  return lines.every(line => {
    if (line.debit < 0 || line.credit < 0) {
      return false;
    }

    if (line.debit > 0 && line.credit > 0) {
      return false;
    }

    if (line.debit === 0 && line.credit === 0) {
      return false;
    }

    const account = findAccountByCode(
      accounts,
      line.accountCode
    );

    return !!account && account.isActive;
  });
}

export function createJournalEntry(
  accounts: Account[],
  reference: string,
  description: string,
  lines: JournalEntryLine[]
): JournalEntry | null {
  if (!validateJournalEntryLines(accounts, lines)) {
    return null;
  }

  if (!isJournalBalanced(lines)) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    reference: reference.trim(),
    description: description.trim(),
    lines,
    status: "draft",
    createdAt: new Date().toISOString()
  };
}

export function postJournalEntry(
  entry: JournalEntry
): JournalEntry | null {
  if (entry.status !== "draft") {
    return null;
  }

  return {
    ...entry,
    status: "posted",
    postedAt: new Date().toISOString()
  };
}

export function cancelJournalEntry(
  entry: JournalEntry
): JournalEntry | null {
  if (entry.status !== "draft") {
    return null;
  }

  return {
    ...entry,
    status: "cancelled"
  };
}