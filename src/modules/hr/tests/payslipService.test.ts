import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createPayslip,
  issuePayslip,
  cancelPayslip,
  filterIssuedPayslips
} from "../services/payslipService";

import type {
  PayrollResult
} from "../types/hr.types";

const payroll: PayrollResult = {
  employeeId: "employee-1",
  baseSalary: 5000000,
  overtimePay: 500000,
  grossPay: 5500000,
  deduction: 500000,
  netPay: 5000000
};

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "payslip-1"
  });
});

describe("payslipService", () => {
  it("creates payslip from payroll result", () => {
    const payslip = createPayslip(payroll);

    expect(payslip).toMatchObject({
      id: "payslip-1",
      employeeId: "employee-1",
      baseSalary: 5000000,
      overtimePay: 500000,
      grossPay: 5500000,
      deduction: 500000,
      netPay: 5000000,
      status: "draft"
    });

    expect(payslip.createdAt).toBeTruthy();
  });

  it("issues draft payslip", () => {
    const payslip = createPayslip(payroll);

    const issued = issuePayslip(payslip);

    expect(issued?.status).toBe("issued");
    expect(issued?.issuedAt).toBeTruthy();
  });

  it("blocks issuing non-draft payslip", () => {
    const payslip = createPayslip(payroll);

    const issued = issuePayslip(payslip)!;
    const again = issuePayslip(issued);

    expect(again).toBeNull();
  });

  it("cancels draft payslip", () => {
    const payslip = createPayslip(payroll);

    const cancelled = cancelPayslip(payslip);

    expect(cancelled?.status).toBe("cancelled");
  });

  it("blocks cancelling issued payslip", () => {
    const payslip = createPayslip(payroll);

    const issued = issuePayslip(payslip)!;
    const cancelled = cancelPayslip(issued);

    expect(cancelled).toBeNull();
  });

  it("filters issued payslips", () => {
    const draft = createPayslip(payroll);

    const issued = issuePayslip(
      createPayslip(payroll)
    )!;

    const result = filterIssuedPayslips([
      draft,
      issued
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("issued");
  });
});