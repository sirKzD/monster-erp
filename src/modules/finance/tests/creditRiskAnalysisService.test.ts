import {
  describe,
  expect,
  it
} from "vitest";

import type {
  CreditRiskAnalysis
} from "../types/finance.types";

import {
  buildCreditRiskAnalysisSummary,
  calculateAverageCreditRiskScore,
  calculateCreditRiskScore,
  calculateCreditUtilizationRatio,
  createCreditRiskAnalysis,
  determineCreditRiskLevel,
  getCreditRiskAnalysesByLevel,
  getHighRiskCustomers,
  updateCreditRiskAnalysis
} from "../services/creditRiskAnalysisService";

const analyses: CreditRiskAnalysis[] =
  [
    {
      id: "1",
      customerId: "C001",
      customerName: "Alpha",
      outstandingBalance: 10000,
      overdueBalance: 500,
      overdueDays: 5,
      paymentHistoryScore: 95,
      creditLimit: 20000,
      creditUtilizationRatio: 50,
      riskScore: 18,
      riskLevel: "LOW",
      analysisDate: "2026-01-01",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01"
    },
    {
      id: "2",
      customerId: "C002",
      customerName: "Beta",
      outstandingBalance: 15000,
      overdueBalance: 3000,
      overdueDays: 40,
      paymentHistoryScore: 75,
      creditLimit: 20000,
      creditUtilizationRatio: 75,
      riskScore: 55,
      riskLevel: "HIGH",
      analysisDate: "2026-01-01",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01"
    },
    {
      id: "3",
      customerId: "C003",
      customerName: "Gamma",
      outstandingBalance: 19000,
      overdueBalance: 8000,
      overdueDays: 90,
      paymentHistoryScore: 40,
      creditLimit: 20000,
      creditUtilizationRatio: 95,
      riskScore: 85,
      riskLevel: "CRITICAL",
      analysisDate: "2026-01-01",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01"
    }
  ];

describe(
  "creditRiskAnalysisService",
  () => {
    it(
      "calculates utilization ratio",
      () => {
        expect(
          calculateCreditUtilizationRatio(
            10000,
            20000
          )
        ).toBe(50);
      }
    );

    it(
      "returns zero utilization ratio",
      () => {
        expect(
          calculateCreditUtilizationRatio(
            1000,
            0
          )
        ).toBe(0);
      }
    );

    it(
      "calculates risk score",
      () => {
        expect(
          calculateCreditRiskScore(
            30,
            80,
            70
          )
        ).toBeGreaterThan(0);
      }
    );

    it(
      "determines low risk",
      () => {
        expect(
          determineCreditRiskLevel(
            10
          )
        ).toBe("LOW");
      }
    );

    it(
      "determines moderate risk",
      () => {
        expect(
          determineCreditRiskLevel(
            30
          )
        ).toBe("MODERATE");
      }
    );

    it(
      "determines high risk",
      () => {
        expect(
          determineCreditRiskLevel(
            60
          )
        ).toBe("HIGH");
      }
    );

    it(
      "determines critical risk",
      () => {
        expect(
          determineCreditRiskLevel(
            90
          )
        ).toBe("CRITICAL");
      }
    );

    it(
      "creates analysis",
      () => {
        const result =
          createCreditRiskAnalysis({
            id: "4",
            customerId: "C004",
            customerName: "Delta",
            outstandingBalance: 5000,
            overdueBalance: 0,
            overdueDays: 0,
            paymentHistoryScore: 100,
            creditLimit: 10000,
            analysisDate:
              "2026-01-01",
            createdAt:
              "2026-01-01",
            updatedAt:
              "2026-01-01"
          });

        expect(
          result.creditUtilizationRatio
        ).toBe(50);
      }
    );

    it(
      "updates analysis",
      () => {
        const updated =
          updateCreditRiskAnalysis(
            analyses[0],
            {
              overdueDays: 50
            }
          );

        expect(
          updated.riskScore
        ).toBeGreaterThan(
          analyses[0].riskScore
        );
      }
    );

    it(
      "gets analyses by level",
      () => {
        expect(
          getCreditRiskAnalysesByLevel(
            analyses,
            "HIGH"
          )
        ).toHaveLength(1);
      }
    );

    it(
      "gets high risk customers",
      () => {
        expect(
          getHighRiskCustomers(
            analyses
          )
        ).toHaveLength(2);
      }
    );

    it(
      "calculates average score",
      () => {
        expect(
          calculateAverageCreditRiskScore(
            analyses
          )
        ).toBe(52.67);
      }
    );

    it(
      "builds summary",
      () => {
        expect(
          buildCreditRiskAnalysisSummary(
            analyses
          )
        ).toEqual({
          totalCustomers: 3,
          averageRiskScore:
            52.67,
          lowRiskCount: 1,
          moderateRiskCount: 0,
          highRiskCount: 1,
          criticalRiskCount: 1,
          totalOutstandingBalance:
            44000,
          totalOverdueBalance:
            11500
        });
      }
    );
  }
);