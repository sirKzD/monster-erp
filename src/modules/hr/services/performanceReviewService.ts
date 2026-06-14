import type {
  Employee,
  PerformanceRating,
  PerformanceReview
} from "../types/hr.types";

export function calculatePerformanceRating(
  score: number
): PerformanceRating {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";

  return "needs_improvement";
}

export function createPerformanceReview(
  employee: Employee,
  reviewerId: string,
  score: number,
  comment: string
): PerformanceReview | null {
  if (employee.status !== "active") {
    return null;
  }

  if (score < 0 || score > 100) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    employeeId: employee.id,
    reviewerId,
    score,
    rating: calculatePerformanceRating(score),
    comment: comment.trim(),
    reviewedAt: new Date().toISOString()
  };
}

export function filterReviewsByRating(
  reviews: PerformanceReview[],
  rating: PerformanceRating
): PerformanceReview[] {
  return reviews.filter(
    review => review.rating === rating
  );
}

export function calculateAveragePerformanceScore(
  reviews: PerformanceReview[]
): number {
  if (reviews.length === 0) return 0;

  const total = reviews.reduce(
    (sum, review) => sum + review.score,
    0
  );

  return Math.round(total / reviews.length);
}