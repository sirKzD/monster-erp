import type {
  Department
} from "../types/hr.types";

export function createDepartment(
  name: string,
  managerId?: string
): Department {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    managerId,
    status: "active",
    createdAt: new Date().toISOString()
  };
}

export function assignDepartmentManager(
  department: Department,
  managerId: string
): Department {
  return {
    ...department,
    managerId
  };
}

export function updateDepartmentStatus(
  department: Department,
  status: "active" | "inactive"
): Department {
  return {
    ...department,
    status
  };
}

export function filterActiveDepartments(
  departments: Department[]
): Department[] {
  return departments.filter(
    department => department.status === "active"
  );
}