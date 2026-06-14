import {
  describe,
  it,
  expect
} from "vitest";

import {
  calculateHrHealthScore,
  createHrDashboardSummary
} from "../services/hrDashboardService";

import type {
  Employee,
  LeaveRequest,
  OvertimeRequest,
  Payslip,
  PerformanceReview
} from "../types/hr.types";

const employees: Employee[] = [
  {
    id: "employee-1",
    name: "John Doe",
    email: "john@company.com",
    position: "Developer",
    departmentId: "department-1",
    status: "active",
    joinedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "employee-2",
    name: "Jane Doe",
    email: "jane@company.com",
    position: "Designer",
    departmentId: "department-1",
    status: "inactive",
    joinedAt: "2026-01-01T00:00:00.000Z"
  }
];

const leaveRequests: LeaveRequest[] = [
  {
    id: "leave-1",
    employeeId: "employee-1",
    type: "annual",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-01-01T00:00:00.000Z",
    reason: "Vacation",
    status: "pending",
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

const overtimeRequests: OvertimeRequest[] = [
  {
    id: "overtime-1",
    employeeId: "employee-1",
    startAt: "2026-01-01T18:00:00.000Z",
    endAt: "2026-01-01T20:00:00.000Z",
    reason: "Deployment",
    status: "pending",
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

const payslips: Payslip[] = [
  {
    id: "payslip-1",
    employeeId: "employee-1",
    baseSalary: 5000000,
    overtimePay: 500000,
    grossPay: 5500000,
    deduction: 500000,
    netPay: 5000000,
    status: "issued",
    createdAt: "2026-01-01T00:00:00.000Z",
    issuedAt: "2026-01-01T01:00:00.000Z"
  }
];

const performanceReviews: PerformanceReview[] = [
  {
    id: "review-1",
    employeeId: "employee-1",
    reviewerId: "manager-1",
    score: 90,
    rating: "excellent",
    comment: "Great",
    reviewedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "review-2",
    employeeId: "employee-2",
    reviewerId: "manager-1",
    score: 80,
    rating: "good",
    comment: "Good",
    reviewedAt: "2026-01-01T00:00:00.000Z"
  }
];

describe("hrDashboardService", () => {
  it("calculates HR health score", () => {
    expect(
      calculateHrHealthScore(
        9,
        10,
        1,
        1
      )
    ).toBe(85);
  });

  it("returns zero HR health score when no employees", () => {
    expect(
      calculateHrHealthScore(
        0,
        0,
        0,
        0
      )
    ).toBe(0);
  });

  it("creates HR dashboard summary", () => {
    const summary = createHrDashboardSummary(
      employees,
      leaveRequests,
      overtimeRequests,
      payslips,
      performanceReviews
    );

    expect(summary).toEqual({
      totalEmployees: 2,
      activeEmployees: 1,
      pendingLeaveRequests: 1,
      pendingOvertimeRequests: 1,
      issuedPayslips: 1,
      averagePerformanceScore: 85,
      hrHealthScore: 45
    });
  });
});