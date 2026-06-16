import {
  TaxRule,
  TaxCalculation,
  TaxSummary
} from "../types/finance.types";

const createTaxRule = (
  rules: TaxRule[],
  rule: TaxRule
): TaxRule[] => {
  return [...rules, rule];
};

const updateTaxRule = (
  rules: TaxRule[],
  ruleId: string,
  updates: Partial<TaxRule>
): TaxRule[] => {
  return rules.map(rule =>
    rule.id === ruleId
      ? { ...rule, ...updates }
      : rule
  );
};

const deactivateTaxRule = (
  rules: TaxRule[],
  ruleId: string
): TaxRule[] => {
  return rules.map(rule =>
    rule.id === ruleId
      ? { ...rule, isActive: false }
      : rule
  );
};

const calculateTax = (
  amount: number,
  rule: TaxRule
): TaxCalculation => {
  const taxAmount =
    amount * (rule.rate / 100);

  return {
    subtotal: amount,
    taxAmount,
    totalAmount: amount + taxAmount
  };
};

const generateTaxSummary = (
  transactions: {
    amount: number;
    taxRuleId: string;
  }[],
  rules: TaxRule[]
): TaxSummary[] => {
  return rules.map(rule => {
    const filtered =
      transactions.filter(
        t => t.taxRuleId === rule.id
      );

    const taxableAmount =
      filtered.reduce(
        (sum, t) => sum + t.amount,
        0
      );

    const taxAmount =
      taxableAmount *
      (rule.rate / 100);

    return {
      taxRuleId: rule.id,
      taxRuleName: rule.name,
      transactionCount:
        filtered.length,
      taxableAmount,
      taxAmount
    };
  });
};

export const taxManagementService = {
  createTaxRule,
  updateTaxRule,
  deactivateTaxRule,
  calculateTax,
  generateTaxSummary
};