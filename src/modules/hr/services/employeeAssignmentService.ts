import type {
  Employee,
  Department
} from "../types/hr.types";

export interface EmployeeAssignment {
  id: string;
  employeeId: string;
  departmentId: string;
  assignedAt: string;
  endedAt?: string;
  status: "active" | "ended";
}

export function createEmployeeAssignment(
  employee: Employee,
  department: Department
): EmployeeAssignment | null {
  if (employee.status !== "active") return null;
  if (department.status !== "active") return null;

  return {
    id: crypto.randomUUID(),
    employeeId: employee.id,
    departmentId: department.id,
    assignedAt: new Date().toISOString(),
    status: "active"
  };
}

export function endEmployeeAssignment(
  assignment: EmployeeAssignment
): EmployeeAssignment | null {
  if (assignment.status !== "active") {
    return null;
  }

  return {
    ...assignment,
    status: "ended",
    endedAt: new Date().toISOString()
  };
}

export function transferEmployeeDepartment(
  currentAssignment: EmployeeAssignment,
  employee: Employee,
  newDepartment: Department
): {
  endedAssignment: EmployeeAssignment;
  newAssignment: EmployeeAssignment;
} | null {
  const endedAssignment = endEmployeeAssignment(
    currentAssignment
  );

  if (!endedAssignment) return null;

  const newAssignment = createEmployeeAssignment(
    employee,
    newDepartment
  );

  if (!newAssignment) return null;

  return {
    endedAssignment,
    newAssignment
  };
}

export function filterActiveAssignments(
  assignments: EmployeeAssignment[]
): EmployeeAssignment[] {
  return assignments.filter(
    assignment => assignment.status === "active"
  );
}