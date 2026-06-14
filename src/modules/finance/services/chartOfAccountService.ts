import type {
  Account,
  AccountType
} from "../types/finance.types";

export function hasDuplicateAccountCode(
  accounts: Account[],
  code: string
): boolean {
  return accounts.some(
    account => account.code === code.trim()
  );
}

export function createAccount(
  accounts: Account[],
  code: string,
  name: string,
  type: AccountType
): Account | null {
  if (hasDuplicateAccountCode(accounts, code)) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    code: code.trim(),
    name: name.trim(),
    type,
    isActive: true,
    createdAt: new Date().toISOString()
  };
}

export function updateAccount(
  account: Account,
  updates: Partial<
    Pick<Account, "name" | "type">
  >
): Account {
  return {
    ...account,
    ...updates,
    name: updates.name?.trim() ?? account.name
  };
}

export function deactivateAccount(
  account: Account
): Account {
  return {
    ...account,
    isActive: false
  };
}

export function findAccountByCode(
  accounts: Account[],
  code: string
): Account | undefined {
  return accounts.find(
    account => account.code === code.trim()
  );
}

export function filterActiveAccounts(
  accounts: Account[]
): Account[] {
  return accounts.filter(
    account => account.isActive
  );
}