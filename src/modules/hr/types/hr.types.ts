export type EmployeeStatus =
  | "active"
  | "inactive"
  | "terminated";

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  departmentId: string;
  status: EmployeeStatus;
  joinedAt: string;
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  clockInAt: string;
  clockOutAt?: string;
  status: "open" | "closed";
}

export type LeaveRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type LeaveType =
  | "annual"
  | "sick"
  | "unpaid";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
  createdAt: string;
  reviewedAt?: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  year: number;
  annualQuota: number;
  usedDays: number;
  remainingDays: number;
}

export type OvertimeRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export interface OvertimeRequest {
  id: string;
  employeeId: string;
  startAt: string;
  endAt: string;
  reason: string;
  status: OvertimeRequestStatus;
  createdAt: string;
  reviewedAt?: string;
}

export interface PayrollInput {
  employeeId: string;
  baseSalary: number;
  attendanceHours: number;
  overtimeHours: number;
  overtimeRate: number;
  deduction: number;
}

export interface PayrollResult {
  employeeId: string;
  baseSalary: number;
  overtimePay: number;
  grossPay: number;
  deduction: number;
  netPay: number;
}

export type PayslipStatus =
  | "draft"
  | "issued"
  | "cancelled";

export interface Payslip {
  id: string;
  employeeId: string;
  baseSalary: number;
  overtimePay: number;
  grossPay: number;
  deduction: number;
  netPay: number;
  status: PayslipStatus;
  issuedAt?: string;
  createdAt: string;
}