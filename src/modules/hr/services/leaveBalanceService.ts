import type {
  Employee,
  LeaveBalance,
  LeaveRequest
} from "../types/hr.types";

import {
  calculateLeaveDays
} from "./leaveRequestService";

export function createLeaveBalance(
  employee: Employee,
  year: number,
  annualQuota: number
): LeaveBalance | null {
  if (employee.status !== "active") {
    return null;
  }

  if (annualQuota < 0) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    employeeId: employee.id,
    year,
    annualQuota,
    usedDays: 0,
    remainingDays: annualQuota
  };
}

export function canUseLeaveBalance(
  balance: LeaveBalance,
  requestedDays: number
): boolean {
  if (requestedDays <= 0) return false;

  return balance.remainingDays >= requestedDays;
}

export function applyApprovedLeaveToBalance(
  balance: LeaveBalance,
  request: LeaveRequest
): LeaveBalance | null {
  if (request.status !== "approved") {
    return null;
  }

  if (request.type !== "annual") {
    return balance;
  }

  const requestedDays = calculateLeaveDays(
    request.startDate,
    request.endDate
  );

  if (!canUseLeaveBalance(balance, requestedDays)) {
    return null;
  }

  return {
    ...balance,
    usedDays: balance.usedDays + requestedDays,
    remainingDays: balance.remainingDays - requestedDays
  };
}

export function getLeaveBalanceStatus(
  balance: LeaveBalance
): "available" | "low" | "empty" {
  if (balance.remainingDays <= 0) return "empty";
  if (balance.remainingDays <= 3) return "low";

  return "available";
}