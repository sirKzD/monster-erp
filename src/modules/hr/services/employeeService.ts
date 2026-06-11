import type {
  Employee,
  EmployeeStatus
} from "../types/hr.types";

export function createEmployee(
  name: string,
  email: string,
  position: string,
  departmentId: string
): Employee {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    position: position.trim(),
    departmentId,
    status: "active",
    joinedAt: new Date().toISOString()
  };
}

export function updateEmployeeStatus(
  employee: Employee,
  status: EmployeeStatus
): Employee {
  return {
    ...employee,
    status
  };
}

export function isEmployeeActive(
  employee: Employee
): boolean {
  return employee.status === "active";
}

export function filterActiveEmployees(
  employees: Employee[]
): Employee[] {
  return employees.filter(isEmployeeActive);
}