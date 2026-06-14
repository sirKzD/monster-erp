import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  hasDuplicateAccountCode,
  createAccount,
  updateAccount,
  deactivateAccount,
  findAccountByCode,
  filterActiveAccounts
} from "../services/chartOfAccountService";

import type {
  Account
} from "../types/finance.types";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "account-1"
  });
});

const existingAccounts: Account[] = [
  {
    id: "account-existing",
    code: "1000",
    name: "Cash",
    type: "asset",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

describe("chartOfAccountService", () => {
  it("creates asset account", () => {
    const account = createAccount(
      [],
      " 1000 ",
      " Cash ",
      "asset"
    );

    expect(account).toMatchObject({
      id: "account-1",
      code: "1000",
      name: "Cash",
      type: "asset",
      isActive: true
    });

    expect(account?.createdAt).toBeTruthy();
  });

  it("creates revenue account", () => {
    const account = createAccount(
      [],
      " 4000 ",
      " Sales Revenue ",
      "revenue"
    );

    expect(account).toMatchObject({
      id: "account-1",
      code: "4000",
      name: "Sales Revenue",
      type: "revenue",
      isActive: true
    });
  });

  it("detects duplicate account code", () => {
    expect(
      hasDuplicateAccountCode(
        existingAccounts,
        "1000"
      )
    ).toBe(true);

    expect(
      hasDuplicateAccountCode(
        existingAccounts,
        "2000"
      )
    ).toBe(false);
  });

  it("rejects duplicate account code", () => {
    const account = createAccount(
      existingAccounts,
      "1000",
      "Bank",
      "asset"
    );

    expect(account).toBeNull();
  });

  it("updates account", () => {
    const account = createAccount(
      [],
      "5000",
      "Salary Expense",
      "expense"
    )!;

    const updated = updateAccount(
      account,
      {
        name: " Payroll Expense ",
        type: "expense"
      }
    );

    expect(updated).toMatchObject({
      code: "5000",
      name: "Payroll Expense",
      type: "expense"
    });
  });

  it("deactivates account", () => {
    const account = createAccount(
      [],
      "1000",
      "Cash",
      "asset"
    )!;

    const deactivated = deactivateAccount(
      account
    );

    expect(deactivated.isActive).toBe(false);
  });

  it("finds account by code", () => {
    const found = findAccountByCode(
      existingAccounts,
      "1000"
    );

    expect(found?.name).toBe("Cash");
  });

  it("filters active accounts", () => {
    const active = createAccount(
      [],
      "1000",
      "Cash",
      "asset"
    )!;

    const inactive = deactivateAccount(
      createAccount(
        [],
        "1100",
        "Bank",
        "asset"
      )!
    );

    const result = filterActiveAccounts([
      active,
      inactive
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].isActive).toBe(true);
  });
});