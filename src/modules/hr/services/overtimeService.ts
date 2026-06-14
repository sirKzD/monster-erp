import type {
  Employee,
  OvertimeRequest,
  OvertimeRequestStatus
} from "../types/hr.types";

export function calculateOvertimeHours(
  startAt: string,
  endAt: string
): number {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();

  if (end <= start) return 0;

  return (end - start) / (1000 * 60 * 60);
}

export function createOvertimeRequest(
  employee: Employee,
  startAt: string,
  endAt: string,
  reason: string
): OvertimeRequest | null {
  if (employee.status !== "active") {
    return null;
  }

  if (calculateOvertimeHours(startAt, endAt) <= 0) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    employeeId: employee.id,
    startAt,
    endAt,
    reason: reason.trim(),
    status: "pending",
    createdAt: new Date().toISOString()
  };
}

export function updateOvertimeRequestStatus(
  request: OvertimeRequest,
  status: OvertimeRequestStatus
): OvertimeRequest | null {
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

export function approveOvertimeRequest(
  request: OvertimeRequest
): OvertimeRequest | null {
  return updateOvertimeRequestStatus(
    request,
    "approved"
  );
}

export function rejectOvertimeRequest(
  request: OvertimeRequest
): OvertimeRequest | null {
  return updateOvertimeRequestStatus(
    request,
    "rejected"
  );
}

export function cancelOvertimeRequest(
  request: OvertimeRequest
): OvertimeRequest | null {
  return updateOvertimeRequestStatus(
    request,
    "cancelled"
  );
}

export function filterPendingOvertimeRequests(
  requests: OvertimeRequest[]
): OvertimeRequest[] {
  return requests.filter(
    request => request.status === "pending"
  );
}