import type {
  Employee,
  LeaveRequest,
  OvertimeRequest,
  Payslip,
  PerformanceReview
} from "../types/hr.types";

import {
  calculateAveragePerformanceScore
} from "./performanceReviewService";

export interface HrDashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaveRequests: number;
  pendingOvertimeRequests: number;
  issuedPayslips: number;
  averagePerformanceScore: number;
  hrHealthScore: number;
}

export function calculateHrHealthScore(
  activeEmployees: number,
  totalEmployees: number,
  pendingLeaveRequests: number,
  pendingOvertimeRequests: number
): number {
  if (totalEmployees === 0) return 0;

  const activeRate = Math.round(
    (activeEmployees / totalEmployees) * 100
  );

  const penalty =
    pendingLeaveRequests * 3 +
    pendingOvertimeRequests * 2;

  return Math.max(activeRate - penalty, 0);
}

export function createHrDashboardSummary(
  employees: Employee[],
  leaveRequests: LeaveRequest[],
  overtimeRequests: OvertimeRequest[],
  payslips: Payslip[],
  performanceReviews: PerformanceReview[]
): HrDashboardSummary {
  const activeEmployees = employees.filter(
    employee => employee.status === "active"
  ).length;

  const pendingLeaveRequests = leaveRequests.filter(
    request => request.status === "pending"
  ).length;

  const pendingOvertimeRequests = overtimeRequests.filter(
    request => request.status === "pending"
  ).length;

  const issuedPayslips = payslips.filter(
    payslip => payslip.status === "issued"
  ).length;

  return {
    totalEmployees: employees.length,
    activeEmployees,
    pendingLeaveRequests,
    pendingOvertimeRequests,
    issuedPayslips,
    averagePerformanceScore:
      calculateAveragePerformanceScore(performanceReviews),
    hrHealthScore: calculateHrHealthScore(
      activeEmployees,
      employees.length,
      pendingLeaveRequests,
      pendingOvertimeRequests
    )
  };
}