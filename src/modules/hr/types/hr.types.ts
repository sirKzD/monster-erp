export type EmployeeStatus =
  | "active"
  | "inactive"
  | "terminated";

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  departmentId: string;
  status: EmployeeStatus;
  joinedAt: string;
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
  status: "active" | "inactive";
  createdAt: string;
}