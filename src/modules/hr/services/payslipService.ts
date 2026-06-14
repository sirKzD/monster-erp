import type {
  PayrollResult,
  Payslip
} from "../types/hr.types";

export function createPayslip(
  payroll: PayrollResult
): Payslip {
  return {
    id: crypto.randomUUID(),
    employeeId: payroll.employeeId,
    baseSalary: payroll.baseSalary,
    overtimePay: payroll.overtimePay,
    grossPay: payroll.grossPay,
    deduction: payroll.deduction,
    netPay: payroll.netPay,
    status: "draft",
    createdAt: new Date().toISOString()
  };
}

export function issuePayslip(
  payslip: Payslip
): Payslip | null {
  if (payslip.status !== "draft") {
    return null;
  }

  return {
    ...payslip,
    status: "issued",
    issuedAt: new Date().toISOString()
  };
}

export function cancelPayslip(
  payslip: Payslip
): Payslip | null {
  if (payslip.status !== "draft") {
    return null;
  }

  return {
    ...payslip,
    status: "cancelled"
  };
}

export function filterIssuedPayslips(
  payslips: Payslip[]
): Payslip[] {
  return payslips.filter(
    payslip => payslip.status === "issued"
  );
}