export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  isActive: boolean;
  createdAt: string;
}

export type JournalEntryStatus =
  | "draft"
  | "posted"
  | "cancelled";

export interface JournalEntryLine {
  accountCode: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  reference: string;
  description: string;
  lines: JournalEntryLine[];
  status: JournalEntryStatus;
  createdAt: string;
  postedAt?: string;
}

export interface LedgerEntry {
  id: string;
  journalEntryId: string;
  accountCode: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
  description: string;
  postedAt: string;
}

export interface TrialBalanceLine {
  accountCode: string;
  debit: number;
  credit: number;
}

export interface TrialBalanceReport {
  lines: TrialBalanceLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}