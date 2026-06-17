import type {
  BankAccount,
  BankAccountSummary
} from "../types/finance.types";

export function createBankAccount(
  account: BankAccount
): BankAccount {
  return {
    ...account
  };
}

export function activateBankAccount(
  account: BankAccount
): BankAccount {
  return {
    ...account,
    status: "active"
  };
}

export function deactivateBankAccount(
  account: BankAccount
): BankAccount {
  return {
    ...account,
    status: "inactive"
  };
}

export function closeBankAccount(
  account: BankAccount
): BankAccount {
  return {
    ...account,
    status: "closed"
  };
}

export function depositToBankAccount(
  account: BankAccount,
  amount: number
): BankAccount {
  if (amount <= 0) {
    throw new Error(
      "Deposit amount must be greater than zero"
    );
  }

  return {
    ...account,
    balance: account.balance + amount
  };
}

export function withdrawFromBankAccount(
  account: BankAccount,
  amount: number
): BankAccount {
  if (amount <= 0) {
    throw new Error(
      "Withdrawal amount must be greater than zero"
    );
  }

  if (amount > account.balance) {
    throw new Error(
      "Insufficient bank account balance"
    );
  }

  return {
    ...account,
    balance: account.balance - amount
  };
}

export function buildBankAccountSummary(
  accounts: BankAccount[]
): BankAccountSummary {
  const totalAccounts =
    accounts.length;

  const activeAccounts =
    accounts.filter(
      (account) =>
        account.status === "active"
    ).length;

  const inactiveAccounts =
    accounts.filter(
      (account) =>
        account.status === "inactive"
    ).length;

  const totalBalance =
    accounts.reduce(
      (sum, account) =>
        sum + account.balance,
      0
    );

  return {
    totalAccounts,
    activeAccounts,
    inactiveAccounts,
    totalBalance
  };
}