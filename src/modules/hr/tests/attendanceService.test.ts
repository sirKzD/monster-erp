import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  clockIn,
  clockOut,
  calculateWorkedHours,
  filterOpenAttendances
} from "../services/attendanceService";

import type {
  Employee,
  AttendanceRecord
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
    randomUUID: () => "attendance-1"
  });
});

describe("attendanceService", () => {
  it("creates attendance clock in", () => {
    const attendance = clockIn(employee);

    expect(attendance).toMatchObject({
      id: "attendance-1",
      employeeId: "employee-1",
      status: "open"
    });

    expect(attendance?.clockInAt).toBeTruthy();
  });

  it("blocks inactive employee clock in", () => {
    const attendance = clockIn({
      ...employee,
      status: "inactive"
    });

    expect(attendance).toBeNull();
  });

  it("closes attendance on clock out", () => {
    const attendance = clockIn(employee)!;

    const closed = clockOut(attendance);

    expect(closed?.status).toBe("closed");
    expect(closed?.clockOutAt).toBeTruthy();
  });

  it("blocks double clock out", () => {
    const attendance = clockIn(employee)!;

    const closed = clockOut(attendance)!;

    const again = clockOut(closed);

    expect(again).toBeNull();
  });

  it("calculates worked hours", () => {
    const attendance: AttendanceRecord = {
      id: "attendance-1",
      employeeId: "employee-1",
      clockInAt: "2026-01-01T08:00:00.000Z",
      clockOutAt: "2026-01-01T16:00:00.000Z",
      status: "closed"
    };

    expect(
      calculateWorkedHours(attendance)
    ).toBe(8);
  });

  it("returns zero if attendance still open", () => {
    const attendance = clockIn(employee)!;

    expect(
      calculateWorkedHours(attendance)
    ).toBe(0);
  });

  it("filters open attendances", () => {
    const open = clockIn(employee)!;

    const closed = clockOut(
      clockIn(employee)!
    )!;

    const result = filterOpenAttendances([
      open,
      closed
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("open");
  });
});