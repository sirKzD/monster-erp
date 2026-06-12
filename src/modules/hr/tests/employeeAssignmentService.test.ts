import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createEmployeeAssignment,
  endEmployeeAssignment,
  transferEmployeeDepartment,
  filterActiveAssignments
} from "../services/employeeAssignmentService";

import type {
  Employee,
  Department
} from "../types/hr.types";

const employee: Employee = {
  id: "employee-1",
  name: "John Doe",
  email: "john@company.com",
  position: "Software Engineer",
  departmentId: "department-1",
  status: "active",
  joinedAt: "2026-01-01T00:00:00.000Z"
};

const department: Department = {
  id: "department-1",
  name: "Engineering",
  managerId: "employee-manager",
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z"
};

const newDepartment: Department = {
  id: "department-2",
  name: "Product",
  managerId: "employee-manager-2",
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z"
};

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "assignment-1"
  });
});

describe("employeeAssignmentService", () => {
  it("creates employee assignment", () => {
    const assignment = createEmployeeAssignment(
      employee,
      department
    );

    expect(assignment).toMatchObject({
      id: "assignment-1",
      employeeId: "employee-1",
      departmentId: "department-1",
      status: "active"
    });

    expect(assignment?.assignedAt).toBeTruthy();
  });

  it("blocks assignment for inactive employee", () => {
    const assignment = createEmployeeAssignment(
      {
        ...employee,
        status: "inactive"
      },
      department
    );

    expect(assignment).toBeNull();
  });

  it("blocks assignment for inactive department", () => {
    const assignment = createEmployeeAssignment(
      employee,
      {
        ...department,
        status: "inactive"
      }
    );

    expect(assignment).toBeNull();
  });

  it("ends employee assignment", () => {
    const assignment = createEmployeeAssignment(
      employee,
      department
    )!;

    const ended = endEmployeeAssignment(
      assignment
    );

    expect(ended?.status).toBe("ended");
    expect(ended?.endedAt).toBeTruthy();
  });

  it("blocks ending already ended assignment", () => {
    const assignment = createEmployeeAssignment(
      employee,
      department
    )!;

    const ended = endEmployeeAssignment(
      assignment
    )!;

    const again = endEmployeeAssignment(
      ended
    );

    expect(again).toBeNull();
  });

  it("transfers employee department", () => {
    const assignment = createEmployeeAssignment(
      employee,
      department
    )!;

    const result = transferEmployeeDepartment(
      assignment,
      employee,
      newDepartment
    );

    expect(result?.endedAssignment.status).toBe("ended");
    expect(result?.newAssignment.departmentId).toBe("department-2");
    expect(result?.newAssignment.status).toBe("active");
  });

  it("filters active assignments", () => {
    const active = createEmployeeAssignment(
      employee,
      department
    )!;

    const ended = endEmployeeAssignment(
      createEmployeeAssignment(
        employee,
        department
      )!
    )!;

    const result = filterActiveAssignments([
      active,
      ended
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("active");
  });
});