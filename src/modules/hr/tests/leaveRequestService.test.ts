import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  calculateLeaveDays,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
  filterPendingLeaveRequests
} from "../services/leaveRequestService";

import type {
  Employee
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

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "leave-1"
  });
});

describe("leaveRequestService", () => {
  it("calculates leave days inclusively", () => {
    expect(
      calculateLeaveDays(
        "2026-01-01T00:00:00.000Z",
        "2026-01-03T00:00:00.000Z"
      )
    ).toBe(3);
  });

  it("creates leave request", () => {
    const request = createLeaveRequest(
      employee,
      "annual",
      "2026-01-01T00:00:00.000Z",
      "2026-01-03T00:00:00.000Z",
      "Family vacation"
    );

    expect(request).toMatchObject({
      id: "leave-1",
      employeeId: "employee-1",
      type: "annual",
      status: "pending",
      reason: "Family vacation"
    });

    expect(request?.createdAt).toBeTruthy();
  });

  it("blocks inactive employee leave request", () => {
    const request = createLeaveRequest(
      {
        ...employee,
        status: "inactive"
      },
      "annual",
      "2026-01-01T00:00:00.000Z",
      "2026-01-03T00:00:00.000Z",
      "Family vacation"
    );

    expect(request).toBeNull();
  });

  it("blocks invalid leave date range", () => {
    const request = createLeaveRequest(
      employee,
      "annual",
      "2026-01-03T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
      "Invalid range"
    );

    expect(request).toBeNull();
  });

  it("approves pending leave request", () => {
    const request = createLeaveRequest(
      employee,
      "annual",
      "2026-01-01T00:00:00.000Z",
      "2026-01-03T00:00:00.000Z",
      "Family vacation"
    )!;

    const approved = approveLeaveRequest(request);

    expect(approved?.status).toBe("approved");
    expect(approved?.reviewedAt).toBeTruthy();
  });

  it("rejects pending leave request", () => {
    const request = createLeaveRequest(
      employee,
      "sick",
      "2026-01-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
      "Sick leave"
    )!;

    const rejected = rejectLeaveRequest(request);

    expect(rejected?.status).toBe("rejected");
    expect(rejected?.reviewedAt).toBeTruthy();
  });

  it("cancels pending leave request", () => {
    const request = createLeaveRequest(
      employee,
      "unpaid",
      "2026-01-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
      "Personal reason"
    )!;

    const cancelled = cancelLeaveRequest(request);

    expect(cancelled?.status).toBe("cancelled");
    expect(cancelled?.reviewedAt).toBeTruthy();
  });

  it("blocks changing already reviewed leave request", () => {
    const request = createLeaveRequest(
      employee,
      "annual",
      "2026-01-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
      "Vacation"
    )!;

    const approved = approveLeaveRequest(request)!;
    const rejected = rejectLeaveRequest(approved);

    expect(rejected).toBeNull();
  });

  it("filters pending leave requests", () => {
    const pending = createLeaveRequest(
      employee,
      "annual",
      "2026-01-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
      "Vacation"
    )!;

    const approved = approveLeaveRequest(
      createLeaveRequest(
        employee,
        "sick",
        "2026-01-02T00:00:00.000Z",
        "2026-01-02T00:00:00.000Z",
        "Sick"
      )!
    )!;

    const result = filterPendingLeaveRequests([
      pending,
      approved
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("pending");
  });
});