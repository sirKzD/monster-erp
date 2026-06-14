import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  calculatePerformanceRating,
  createPerformanceReview,
  filterReviewsByRating,
  calculateAveragePerformanceScore
} from "../services/performanceReviewService";

import type {
  Employee
} from "../types/hr.types";

const employee: Employee = {
  id: "employee-1",
  name: "John Doe",
  email: "john@company.com",
  position: "Developer",
  departmentId: "department-1",
  status: "active",
  joinedAt: "2026-01-01T00:00:00.000Z"
};

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "review-1"
  });
});

describe("performanceReviewService", () => {
  it("calculates excellent rating", () => {
    expect(
      calculatePerformanceRating(95)
    ).toBe("excellent");
  });

  it("calculates good rating", () => {
    expect(
      calculatePerformanceRating(80)
    ).toBe("good");
  });

  it("calculates needs improvement rating", () => {
    expect(
      calculatePerformanceRating(60)
    ).toBe("needs_improvement");
  });

  it("creates performance review", () => {
    const review = createPerformanceReview(
      employee,
      "manager-1",
      95,
      " Excellent work "
    );

    expect(review).toMatchObject({
      id: "review-1",
      employeeId: "employee-1",
      reviewerId: "manager-1",
      score: 95,
      rating: "excellent",
      comment: "Excellent work"
    });

    expect(review?.reviewedAt).toBeTruthy();
  });

  it("blocks inactive employee review", () => {
    const review = createPerformanceReview(
      {
        ...employee,
        status: "inactive"
      },
      "manager-1",
      95,
      "Good"
    );

    expect(review).toBeNull();
  });

  it("blocks invalid score", () => {
    expect(
      createPerformanceReview(
        employee,
        "manager-1",
        -1,
        "Invalid"
      )
    ).toBeNull();

    expect(
      createPerformanceReview(
        employee,
        "manager-1",
        101,
        "Invalid"
      )
    ).toBeNull();
  });

  it("filters reviews by rating", () => {
    const excellent = createPerformanceReview(
      employee,
      "manager-1",
      95,
      "Excellent"
    )!;

    const good = createPerformanceReview(
      employee,
      "manager-1",
      80,
      "Good"
    )!;

    const result = filterReviewsByRating(
      [excellent, good],
      "excellent"
    );

    expect(result).toHaveLength(1);
    expect(result[0].rating).toBe("excellent");
  });

  it("calculates average performance score", () => {
    const reviews = [
      createPerformanceReview(
        employee,
        "manager-1",
        90,
        "Great"
      )!,
      createPerformanceReview(
        employee,
        "manager-1",
        80,
        "Good"
      )!
    ];

    expect(
      calculateAveragePerformanceScore(reviews)
    ).toBe(85);
  });

  it("returns zero average score for empty reviews", () => {
    expect(
      calculateAveragePerformanceScore([])
    ).toBe(0);
  });
});