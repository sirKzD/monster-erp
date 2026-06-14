import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  calculateOvertimeHours,
  createOvertimeRequest,
  approveOvertimeRequest,
  rejectOvertimeRequest,
  cancelOvertimeRequest,
  filterPendingOvertimeRequests
} from "../services/overtimeService";

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
    randomUUID: () => "overtime-1"
  });
});

describe("overtimeService", () => {
  it("calculates overtime hours", () => {
    expect(
      calculateOvertimeHours(
        "2026-01-01T18:00:00.000Z",
        "2026-01-01T21:00:00.000Z"
      )
    ).toBe(3);
  });

  it("creates overtime request", () => {
    const request = createOvertimeRequest(
      employee,
      "2026-01-01T18:00:00.000Z",
      "2026-01-01T21:00:00.000Z",
      "Production deployment"
    );

    expect(request).toMatchObject({
      id: "overtime-1",
      employeeId: "employee-1",
      reason: "Production deployment",
      status: "pending"
    });

    expect(request?.createdAt).toBeTruthy();
  });

  it("blocks inactive employee overtime request", () => {
    const request = createOvertimeRequest(
      {
        ...employee,
        status: "inactive"
      },
      "2026-01-01T18:00:00.000Z",
      "2026-01-01T21:00:00.000Z",
      "Production deployment"
    );

    expect(request).toBeNull();
  });

  it("blocks invalid overtime range", () => {
    const request = createOvertimeRequest(
      employee,
      "2026-01-01T21:00:00.000Z",
      "2026-01-01T18:00:00.000Z",
      "Invalid range"
    );

    expect(request).toBeNull();
  });

  it("approves pending overtime request", () => {
    const request = createOvertimeRequest(
      employee,
      "2026-01-01T18:00:00.000Z",
      "2026-01-01T21:00:00.000Z",
      "Production deployment"
    )!;

    const approved = approveOvertimeRequest(
      request
    );

    expect(approved?.status).toBe("approved");
    expect(approved?.reviewedAt).toBeTruthy();
  });

  it("rejects pending overtime request", () => {
    const request = createOvertimeRequest(
      employee,
      "2026-01-01T18:00:00.000Z",
      "2026-01-01T21:00:00.000Z",
      "Production deployment"
    )!;

    const rejected = rejectOvertimeRequest(
      request
    );

    expect(rejected?.status).toBe("rejected");
    expect(rejected?.reviewedAt).toBeTruthy();
  });

  it("cancels pending overtime request", () => {
    const request = createOvertimeRequest(
      employee,
      "2026-01-01T18:00:00.000Z",
      "2026-01-01T21:00:00.000Z",
      "Production deployment"
    )!;

    const cancelled = cancelOvertimeRequest(
      request
    );

    expect(cancelled?.status).toBe("cancelled");
    expect(cancelled?.reviewedAt).toBeTruthy();
  });

  it("blocks changing already reviewed overtime request", () => {
    const request = createOvertimeRequest(
      employee,
      "2026-01-01T18:00:00.000Z",
      "2026-01-01T21:00:00.000Z",
      "Production deployment"
    )!;

    const approved = approveOvertimeRequest(
      request
    )!;

    const rejected = rejectOvertimeRequest(
      approved
    );

    expect(rejected).toBeNull();
  });

  it("filters pending overtime requests", () => {
    const pending = createOvertimeRequest(
      employee,
      "2026-01-01T18:00:00.000Z",
      "2026-01-01T21:00:00.000Z",
      "Deployment"
    )!;

    const approved = approveOvertimeRequest(
      createOvertimeRequest(
        employee,
        "2026-01-02T18:00:00.000Z",
        "2026-01-02T20:00:00.000Z",
        "Support"
      )!
    )!;

    const result = filterPendingOvertimeRequests([
      pending,
      approved
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("pending");
  });
});