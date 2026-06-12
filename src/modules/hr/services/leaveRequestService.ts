import type {
  Employee,
  LeaveRequest,
  LeaveRequestStatus,
  LeaveType
} from "../types/hr.types";

export function calculateLeaveDays(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (end < start) return 0;

  return (
    Math.floor(
      (end - start) / (1000 * 60 * 60 * 24)
    ) + 1
  );
}

export function createLeaveRequest(
  employee: Employee,
  type: LeaveType,
  startDate: string,
  endDate: string,
  reason: string
): LeaveRequest | null {
  if (employee.status !== "active") {
    return null;
  }

  if (calculateLeaveDays(startDate, endDate) <= 0) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    employeeId: employee.id,
    type,
    startDate,
    endDate,
    reason: reason.trim(),
    status: "pending",
    createdAt: new Date().toISOString()
  };
}

export function updateLeaveRequestStatus(
  request: LeaveRequest,
  status: LeaveRequestStatus
): LeaveRequest | null {
  if (request.status !== "pending") {
    return null;
  }

  if (status === "pending") {
    return null;
  }

  return {
    ...request,
    status,
    reviewedAt: new Date().toISOString()
  };
}

export function approveLeaveRequest(
  request: LeaveRequest
): LeaveRequest | null {
  return updateLeaveRequestStatus(
    request,
    "approved"
  );
}

export function rejectLeaveRequest(
  request: LeaveRequest
): LeaveRequest | null {
  return updateLeaveRequestStatus(
    request,
    "rejected"
  );
}

export function cancelLeaveRequest(
  request: LeaveRequest
): LeaveRequest | null {
  if (request.status !== "pending") {
    return null;
  }

  return {
    ...request,
    status: "cancelled",
    reviewedAt: new Date().toISOString()
  };
}

export function filterPendingLeaveRequests(
  requests: LeaveRequest[]
): LeaveRequest[] {
  return requests.filter(
    request => request.status === "pending"
  );
}