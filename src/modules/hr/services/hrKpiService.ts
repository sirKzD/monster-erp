import type {
  HrGrade,
  HrKpi
} from "../types/hr.types";

export function calculateHrGrade(
  score: number
): HrGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";

  return "C";
}

export function createHrKpi(
  attendanceRate: number,
  leaveUtilization: number,
  overtimeUtilization: number,
  performanceScore: number
): HrKpi {
  const overallScore = Math.round(
    (
      attendanceRate +
      (100 - leaveUtilization) +
      (100 - overtimeUtilization) +
      performanceScore
    ) / 4
  );

  return {
    attendanceRate,
    leaveUtilization,
    overtimeUtilization,
    performanceScore,
    grade: calculateHrGrade(overallScore)
  };
}