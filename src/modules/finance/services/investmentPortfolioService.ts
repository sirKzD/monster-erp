import type {
  Investment,
  InvestmentSummary
} from "../types/finance.types";

export function createInvestment(
  investment: Investment
): Investment {
  return {
    ...investment
  };
}

export function sellInvestment(
  investment: Investment
): Investment {
  return {
    ...investment,
    status: "sold"
  };
}

export function updateInvestmentValue(
  investment: Investment,
  currentValue: number
): Investment {
  return {
    ...investment,
    currentValue
  };
}

export function calculateInvestmentGainLoss(
  investment: Investment
): number {
  return (
    investment.currentValue -
    investment.initialAmount
  );
}

export function calculateInvestmentReturnPercentage(
  investment: Investment
): number {
  if (investment.initialAmount <= 0) {
    return 0;
  }

  return Number(
    (
      (calculateInvestmentGainLoss(
        investment
      ) /
        investment.initialAmount) *
      100
    ).toFixed(2)
  );
}

export function calculateTotalInvestmentInitialAmount(
  investments: Investment[]
): number {
  return investments.reduce(
    (total, investment) =>
      total + investment.initialAmount,
    0
  );
}

export function calculateTotalInvestmentCurrentValue(
  investments: Investment[]
): number {
  return investments.reduce(
    (total, investment) =>
      total + investment.currentValue,
    0
  );
}

export function countActiveInvestments(
  investments: Investment[]
): number {
  return investments.filter(
    investment =>
      investment.status === "active"
  ).length;
}

export function countSoldInvestments(
  investments: Investment[]
): number {
  return investments.filter(
    investment =>
      investment.status === "sold"
  ).length;
}

export function buildInvestmentSummary(
  investments: Investment[]
): InvestmentSummary {
  const totalInitialAmount =
    calculateTotalInvestmentInitialAmount(
      investments
    );

  const totalCurrentValue =
    calculateTotalInvestmentCurrentValue(
      investments
    );

  const totalGainLoss =
    totalCurrentValue -
    totalInitialAmount;

  const returnPercentage =
    totalInitialAmount <= 0
      ? 0
      : Number(
          (
            (totalGainLoss /
              totalInitialAmount) *
            100
          ).toFixed(2)
        );

  return {
    totalInitialAmount,
    totalCurrentValue,
    totalGainLoss,
    returnPercentage,
    activeInvestmentCount:
      countActiveInvestments(
        investments
      ),
    soldInvestmentCount:
      countSoldInvestments(
        investments
      )
  };
}