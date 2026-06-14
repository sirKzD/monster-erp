import {
  describe,
  expect,
  it
} from "vitest";

import {
  calculateHrGrade,
  createHrKpi
} from "../services/hrKpiService";

describe("hrKpiService", () => {
  it("returns grade A", () => {
    expect(
      calculateHrGrade(90)
    ).toBe("A");
  });

  it("returns grade B", () => {
    expect(
      calculateHrGrade(75)
    ).toBe("B");
  });

  it("returns grade C", () => {
    expect(
      calculateHrGrade(60)
    ).toBe("C");
  });

  it("creates KPI with grade A", () => {
    const result = createHrKpi(
      95,
      10,
      5,
      90
    );

    expect(result).toEqual({
      attendanceRate: 95,
      leaveUtilization: 10,
      overtimeUtilization: 5,
      performanceScore: 90,
      grade: "A"
    });
  });

  it("creates KPI with grade B", () => {
    const result = createHrKpi(
      80,
      25,
      20,
      75
    );

    expect(result.grade).toBe("B");
  });
});