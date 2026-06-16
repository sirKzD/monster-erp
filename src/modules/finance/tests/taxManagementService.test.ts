import {
  describe,
  expect,
  it
} from "vitest";

import {
  taxManagementService
} from "../services/taxManagementService";

describe(
  "taxManagementService",
  () => {
    const vatRule = {
      id: "TAX-001",
      code: "VAT11",
      name: "PPN 11%",
      type: "VAT" as const,
      rate: 11,
      isActive: true
    };

    it(
      "creates tax rule",
      () => {
        const result =
          taxManagementService.createTaxRule(
            [],
            vatRule
          );

        expect(result).toHaveLength(1);
      }
    );

    it(
      "updates tax rule",
      () => {
        const result =
          taxManagementService.updateTaxRule(
            [vatRule],
            "TAX-001",
            {
              rate: 12
            }
          );

        expect(
          result[0].rate
        ).toBe(12);
      }
    );

    it(
      "deactivates tax rule",
      () => {
        const result =
          taxManagementService.deactivateTaxRule(
            [vatRule],
            "TAX-001"
          );

        expect(
          result[0].isActive
        ).toBe(false);
      }
    );

    it(
      "calculates VAT correctly",
      () => {
        const result =
          taxManagementService.calculateTax(
            1000000,
            vatRule
          );

        expect(
          result.taxAmount
        ).toBe(110000);

        expect(
          result.totalAmount
        ).toBe(1110000);
      }
    );

    it(
      "creates tax summary",
      () => {
        const result =
          taxManagementService.generateTaxSummary(
            [
              {
                amount: 1000000,
                taxRuleId:
                  "TAX-001"
              },
              {
                amount: 500000,
                taxRuleId:
                  "TAX-001"
              }
            ],
            [vatRule]
          );

        expect(
          result[0]
            .transactionCount
        ).toBe(2);

        expect(
          result[0]
            .taxableAmount
        ).toBe(1500000);
      }
    );

    it(
      "returns correct tax amount",
      () => {
        const result =
          taxManagementService.generateTaxSummary(
            [
              {
                amount: 1000000,
                taxRuleId:
                  "TAX-001"
              }
            ],
            [vatRule]
          );

        expect(
          result[0].taxAmount
        ).toBe(110000);
      }
    );

    it(
      "handles empty transactions",
      () => {
        const result =
          taxManagementService.generateTaxSummary(
            [],
            [vatRule]
          );

        expect(
          result[0]
            .transactionCount
        ).toBe(0);
      }
    );

    it(
      "supports withholding tax",
      () => {
        const result =
          taxManagementService.calculateTax(
            1000000,
            {
              ...vatRule,
              type:
                "WITHHOLDING",
              rate: 2
            }
          );

        expect(
          result.taxAmount
        ).toBe(20000);
      }
    );

    it(
      "supports zero amount",
      () => {
        const result =
          taxManagementService.calculateTax(
            0,
            vatRule
          );

        expect(
          result.taxAmount
        ).toBe(0);
      }
    );

    it(
      "supports large amount",
      () => {
        const result =
          taxManagementService.calculateTax(
            100000000,
            vatRule
          );

        expect(
          result.taxAmount
        ).toBe(11000000);
      }
    );
  }
);