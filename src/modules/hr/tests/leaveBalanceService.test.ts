import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createLeaveBalance,
  canUseLeaveBalance,
  applyApprovedLeaveToBalance,
  getLeaveBalanceStatus
} from "../services/leaveBalanceService";

import type {
  Employee,
  LeaveRequest
} from "../types/hr.types";

const employee: Employee = {
  id: "employee-1",
  name: "John Doe",
  email: "john@company.com",
  position: "Developer",
  departmentId: "department-1",
  status: "active",
  joinedAt: "2026-01-01T00:00:00.000Z"
};

const approvedAnnualLeave: LeaveRequest = {
  id: "leave-1",
  employeeId: "employee-1",
  type: "annual",
  startDate: "2026-01-01T00:00:00.000Z",
  endDate: "2026-01-03T00:00:00.000Z",
  reason: "Vacation",
  status: "approved",
  createdAt: "2026-01-01T00:00:00.000Z",
  reviewedAt: "2026-01-01T01:00:00.000Z"
};

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "balance-1"
  });
});

describe("leaveBalanceService", () => {
  it("creates leave balance", () => {
    const balance = createLeaveBalance(
      employee,
      2026,
      12
    );

    expect(balance).toEqual({
      id: "balance-1",
      employeeId: "employee-1",
      year: 2026,
      annualQuota: 12,
      usedDays: 0,
      remainingDays: 12
    });
  });

  it("blocks leave balance for inactive employee", () => {
    const balance = createLeaveBalance(
      {
        ...employee,
        status: "inactive"
      },
      2026,
      12
    );

    expect(balance).toBeNull();
  });

  it("blocks negative annual quota", () => {
    const balance = createLeaveBalance(
      employee,
      2026,
      -1
    );

    expect(balance).toBeNull();
  });

  it("checks if leave balance can be used", () => {
    const balance = createLeaveBalance(
      employee,
      2026,
      12
    )!;

    expect(canUseLeaveBalance(balance, 3)).toBe(true);
    expect(canUseLeaveBalance(balance, 13)).toBe(false);
    expect(canUseLeaveBalance(balance, 0)).toBe(false);
  });

  it("applies approved annual leave to balance", () => {
    const balance = createLeaveBalance(
      employee,
      2026,
      12
    )!;

    const updated = applyApprovedLeaveToBalance(
      balance,
      approvedAnnualLeave
    );

    expect(updated).toEqual({
      ...balance,
      usedDays: 3,
      remainingDays: 9
    });
  });

  it("does not apply non-approved leave", () => {
    const balance = createLeaveBalance(
      employee,
      2026,
      12
    )!;

    const updated = applyApprovedLeaveToBalance(
      balance,
      {
        ...approvedAnnualLeave,
        status: "pending"
      }
    );

    expect(updated).toBeNull();
  });

  it("does not reduce balance for sick leave", () => {
    const balance = createLeaveBalance(
      employee,
      2026,
      12
    )!;

    const updated = applyApprovedLeaveToBalance(
      balance,
      {
        ...approvedAnnualLeave,
        type: "sick"
      }
    );

    expect(updated).toEqual(balance);
  });

  it("blocks leave exceeding balance", () => {
    const balance = createLeaveBalance(
      employee,
      2026,
      2
    )!;

    const updated = applyApprovedLeaveToBalance(
      balance,
      approvedAnnualLeave
    );

    expect(updated).toBeNull();
  });

  it("gets leave balance status", () => {
    expect(
      getLeaveBalanceStatus({
        id: "balance-1",
        employeeId: "employee-1",
        year: 2026,
        annualQuota: 12,
        usedDays: 0,
        remainingDays: 12
      })
    ).toBe("available");

    expect(
      getLeaveBalanceStatus({
        id: "balance-1",
        employeeId: "employee-1",
        year: 2026,
        annualQuota: 12,
        usedDays: 10,
        remainingDays: 2
      })
    ).toBe("low");

    expect(
      getLeaveBalanceStatus({
        id: "balance-1",
        employeeId: "employee-1",
        year: 2026,
        annualQuota: 12,
        usedDays: 12,
        remainingDays: 0
      })
    ).toBe("empty");
  });
});