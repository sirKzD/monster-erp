export {
  createEmployee,
  updateEmployeeStatus,
  isEmployeeActive,
  filterActiveEmployees
} from "./services/employeeService";

export type {
  Employee,
  EmployeeStatus
} from "./types/hr.types";

export {
  createDepartment,
  assignDepartmentManager,
  updateDepartmentStatus,
  filterActiveDepartments
} from "./services/departmentService";

export type {
  Department
} from "./types/hr.types";