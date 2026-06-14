import type {
  PayrollInput,
  PayrollResult
} from "../types/hr.types";

export function calculateOvertimePay(
  overtimeHours: number,
  overtimeRate: number
): number {
  if (overtimeHours <= 0 || overtimeRate <= 0) {
    return 0;
  }

  return overtimeHours * overtimeRate;
}

export function calculateGrossPay(
  baseSalary: number,
  overtimePay: number
): number {
  return baseSalary + overtimePay;
}

export function calculateNetPay(
  grossPay: number,
  deduction: number
): number {
  return Math.max(grossPay - deduction, 0);
}

export function calculatePayroll(
  input: PayrollInput
): PayrollResult {
  const overtimePay = calculateOvertimePay(
    input.overtimeHours,
    input.overtimeRate
  );

  const grossPay = calculateGrossPay(
    input.baseSalary,
    overtimePay
  );

  const netPay = calculateNetPay(
    grossPay,
    input.deduction
  );

  return {
    employeeId: input.employeeId,
    baseSalary: input.baseSalary,
    overtimePay,
    grossPay,
    deduction: input.deduction,
    netPay
  };
}