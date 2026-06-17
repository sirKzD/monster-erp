import type {
  BankAccount,
  FundTransfer,
  FundTransferSummary
} from "../types/finance.types";

export function createFundTransfer(
  transfer: FundTransfer
): FundTransfer {
  return {
    ...transfer
  };
}

export function validateFundTransfer(
  fromAccount: BankAccount,
  toAccount: BankAccount,
  amount: number
): boolean {
  if (amount <= 0) {
    return false;
  }

  if (fromAccount.id === toAccount.id) {
    return false;
  }

  if (fromAccount.balance < amount) {
    return false;
  }

  if (fromAccount.status !== "active") {
    return false;
  }

  if (toAccount.status !== "active") {
    return false;
  }

  return true;
}

export function executeFundTransfer(
  transfer: FundTransfer,
  fromAccount: BankAccount,
  toAccount: BankAccount
): {
  transfer: FundTransfer;
  sourceAccount: BankAccount;
  destinationAccount: BankAccount;
} {
  if (
    !validateFundTransfer(
      fromAccount,
      toAccount,
      transfer.amount
    )
  ) {
    throw new Error(
      "Invalid fund transfer"
    );
  }

  return {
    transfer: {
      ...transfer,
      status: "completed"
    },
    sourceAccount: {
      ...fromAccount,
      balance:
        fromAccount.balance -
        transfer.amount
    },
    destinationAccount: {
      ...toAccount,
      balance:
        toAccount.balance +
        transfer.amount
    }
  };
}

export function cancelFundTransfer(
  transfer: FundTransfer
): FundTransfer {
  return {
    ...transfer,
    status: "cancelled"
  };
}

export function calculateTransferredAmount(
  transfers: FundTransfer[]
): number {
  return transfers
    .filter(
      transfer =>
        transfer.status ===
        "completed"
    )
    .reduce(
      (sum, transfer) =>
        sum + transfer.amount,
      0
    );
}

export function buildFundTransferSummary(
  transfers: FundTransfer[]
): FundTransferSummary {
  const completedTransfers =
    transfers.filter(
      transfer =>
        transfer.status ===
        "completed"
    );

  const cancelledTransfers =
    transfers.filter(
      transfer =>
        transfer.status ===
        "cancelled"
    );

  return {
    totalTransfers:
      transfers.length,
    completedTransfers:
      completedTransfers.length,
    cancelledTransfers:
      cancelledTransfers.length,
    totalTransferredAmount:
      calculateTransferredAmount(
        transfers
      )
  };
}