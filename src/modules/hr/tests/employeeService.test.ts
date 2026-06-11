import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createEmployee,
  updateEmployeeStatus,
  isEmployeeActive,
  filterActiveEmployees
} from "../services/employeeService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "employee-1"
  });
});

describe("employeeService", () => {
  it("creates employee", () => {
    const employee = createEmployee(
      " John Doe ",
      " JOHN@COMPANY.COM ",
      " Software Engineer ",
      "department-1"
    );

    expect(employee).toMatchObject({
      id: "employee-1",
      name: "John Doe",
      email: "john@company.com",
      position: "Software Engineer",
      departmentId: "department-1",
      status: "active"
    });

    expect(employee.joinedAt).toBeTruthy();
  });

  it("updates employee status", () => {
    const employee = createEmployee(
      "John Doe",
      "john@company.com",
      "Software Engineer",
      "department-1"
    );

    const updated = updateEmployeeStatus(
      employee,
      "inactive"
    );

    expect(updated.status).toBe("inactive");
  });

  it("checks active employee", () => {
    const employee = createEmployee(
      "John Doe",
      "john@company.com",
      "Software Engineer",
      "department-1"
    );

    expect(isEmployeeActive(employee)).toBe(true);

    expect(
      isEmployeeActive({
        ...employee,
        status: "terminated"
      })
    ).toBe(false);
  });

  it("filters active employees", () => {
    const active = createEmployee(
      "Active User",
      "active@company.com",
      "Developer",
      "department-1"
    );

    const inactive = updateEmployeeStatus(
      createEmployee(
        "Inactive User",
        "inactive@company.com",
        "Designer",
        "department-1"
      ),
      "inactive"
    );

    const result = filterActiveEmployees([
      active,
      inactive
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("active");
  });
});