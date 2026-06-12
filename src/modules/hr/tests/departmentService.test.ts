import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createDepartment,
  assignDepartmentManager,
  updateDepartmentStatus,
  filterActiveDepartments
} from "../services/departmentService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "department-1"
  });
});

describe("departmentService", () => {
  it("creates department", () => {
    const department = createDepartment(
      " Engineering ",
      "employee-1"
    );

    expect(department).toMatchObject({
      id: "department-1",
      name: "Engineering",
      managerId: "employee-1",
      status: "active"
    });

    expect(department.createdAt).toBeTruthy();
  });

  it("assigns department manager", () => {
    const department = createDepartment(
      "Engineering"
    );

    const updated = assignDepartmentManager(
      department,
      "employee-2"
    );

    expect(updated.managerId).toBe("employee-2");
  });

  it("updates department status", () => {
    const department = createDepartment(
      "Engineering"
    );

    const updated = updateDepartmentStatus(
      department,
      "inactive"
    );

    expect(updated.status).toBe("inactive");
  });

  it("filters active departments", () => {
    const active = createDepartment(
      "Engineering"
    );

    const inactive = updateDepartmentStatus(
      createDepartment(
        "Finance"
      ),
      "inactive"
    );

    const result = filterActiveDepartments([
      active,
      inactive
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("active");
  });
});