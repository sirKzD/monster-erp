import {
  describe,
  it,
  expect
} from "vitest";

import {
  calculateOvertimePay,
  calculateGrossPay,
  calculateNetPay,
  calculatePayroll
} from "../services/payrollService";

describe("payrollService", () => {
  it("calculates overtime pay", () => {
    expect(
      calculateOvertimePay(
        10,
        50000
      )
    ).toBe(500000);
  });

  it("returns zero overtime pay for invalid input", () => {
    expect(
      calculateOvertimePay(
        0,
        50000
      )
    ).toBe(0);

    expect(
      calculateOvertimePay(
        10,
        0
      )
    ).toBe(0);
  });

  it("calculates gross pay", () => {
    expect(
      calculateGrossPay(
        5000000,
        500000
      )
    ).toBe(5500000);
  });

  it("calculates net pay", () => {
    expect(
      calculateNetPay(
        5500000,
        500000
      )
    ).toBe(5000000);
  });

  it("does not allow negative net pay", () => {
    expect(
      calculateNetPay(
        1000000,
        2000000
      )
    ).toBe(0);
  });

  it("calculates payroll result", () => {
    const payroll = calculatePayroll({
      employeeId: "employee-1",
      baseSalary: 5000000,
      attendanceHours: 160,
      overtimeHours: 10,
      overtimeRate: 50000,
      deduction: 500000
    });

    expect(payroll).toEqual({
      employeeId: "employee-1",
      baseSalary: 5000000,
      overtimePay: 500000,
      grossPay: 5500000,
      deduction: 500000,
      netPay: 5000000
    });
  });
});