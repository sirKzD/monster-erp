import type {
  AttendanceRecord,
  Employee
} from "../types/hr.types";

export function clockIn(
  employee: Employee
): AttendanceRecord | null {
  if (employee.status !== "active") {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    employeeId: employee.id,
    clockInAt: new Date().toISOString(),
    status: "open"
  };
}

export function clockOut(
  attendance: AttendanceRecord
): AttendanceRecord | null {
  if (attendance.status !== "open") {
    return null;
  }

  return {
    ...attendance,
    clockOutAt: new Date().toISOString(),
    status: "closed"
  };
}

export function calculateWorkedHours(
  attendance: AttendanceRecord
): number {
  if (!attendance.clockOutAt) {
    return 0;
  }

  const start =
    new Date(attendance.clockInAt).getTime();

  const end =
    new Date(attendance.clockOutAt).getTime();

  return (end - start) / (1000 * 60 * 60);
}

export function filterOpenAttendances(
  attendances: AttendanceRecord[]
): AttendanceRecord[] {
  return attendances.filter(
    attendance => attendance.status === "open"
  );
}