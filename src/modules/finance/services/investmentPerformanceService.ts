import {
  InvestmentPerformance,
  InvestmentPerformanceSummary,
} from "../types/finance.types";

const investmentPerformances: InvestmentPerformance[] = [];

const createPerformance = (
  performance: InvestmentPerformance,
): InvestmentPerformance => {
  const exists = investmentPerformances.find(
    (item) => item.id === performance.id,
  );

  if (exists) {
    throw new Error("Investment performance already exists");
  }

  investmentPerformances.push(performance);

  return performance;
};

const updatePerformance = (
  id: string,
  updates: Partial<InvestmentPerformance>,
): InvestmentPerformance => {
  const performance = investmentPerformances.find(
    (item) => item.id === id,
  );

  if (!performance) {
    throw new Error("Investment performance not found");
  }

  Object.assign(performance, updates);

  return performance;
};

const deletePerformance = (id: string): void => {
  const index = investmentPerformances.findIndex(
    (item) => item.id === id,
  );

  if (index === -1) {
    throw new Error("Investment performance not found");
  }

  investmentPerformances.splice(index, 1);
};

const getPerformanceById = (
  id: string,
): InvestmentPerformance | undefined =>
  investmentPerformances.find((item) => item.id === id);

const getAllPerformances = (): InvestmentPerformance[] =>
  [...investmentPerformances];

const calculateTotalReturn = (
  realizedGain: number,
  unrealizedGain: number,
  dividendIncome: number,
): number =>
  realizedGain + unrealizedGain + dividendIncome;

const calculateReturnPercentage = (
  totalReturn: number,
  investedAmount: number,
): number => {
  if (investedAmount <= 0) {
    return 0;
  }

  return (totalReturn / investedAmount) * 100;
};

const calculateAnnualizedReturn = (
  investedAmount: number,
  endingValue: number,
  years: number,
): number => {
  if (
    investedAmount <= 0 ||
    endingValue <= 0 ||
    years <= 0
  ) {
    return 0;
  }

  return (
    (Math.pow(endingValue / investedAmount, 1 / years) - 1) *
    100
  );
};

const getTopPerformingInvestments = (): InvestmentPerformance[] =>
  [...investmentPerformances].sort(
    (a, b) =>
      b.totalReturnPercentage -
      a.totalReturnPercentage,
  );

const getPortfolioPerformanceSummary =
  (): InvestmentPerformanceSummary => {
    const totalPortfolios =
      investmentPerformances.length;

    const totalInvestedAmount =
      investmentPerformances.reduce(
        (sum, item) => sum + item.totalInvestedAmount,
        0,
      );

    const totalMarketValue =
      investmentPerformances.reduce(
        (sum, item) => sum + item.currentMarketValue,
        0,
      );

    const totalRealizedGain =
      investmentPerformances.reduce(
        (sum, item) => sum + item.realizedGain,
        0,
      );

    const totalUnrealizedGain =
      investmentPerformances.reduce(
        (sum, item) => sum + item.unrealizedGain,
        0,
      );

    const totalDividendIncome =
      investmentPerformances.reduce(
        (sum, item) => sum + item.dividendIncome,
        0,
      );

    const totalReturn =
      investmentPerformances.reduce(
        (sum, item) => sum + item.totalReturn,
        0,
      );

    const averageReturnPercentage =
      totalPortfolios === 0
        ? 0
        : investmentPerformances.reduce(
            (sum, item) =>
              sum + item.totalReturnPercentage,
            0,
          ) / totalPortfolios;

    const averageAnnualizedReturnPercentage =
      totalPortfolios === 0
        ? 0
        : investmentPerformances.reduce(
            (sum, item) =>
              sum +
              item.annualizedReturnPercentage,
            0,
          ) / totalPortfolios;

    const best =
      getTopPerformingInvestments()[0];

    return {
      totalPortfolios,
      totalInvestedAmount,
      totalMarketValue,
      totalRealizedGain,
      totalUnrealizedGain,
      totalDividendIncome,
      totalReturn,
      averageReturnPercentage,
      averageAnnualizedReturnPercentage,
      bestPerformingPortfolioId:
        best?.portfolioId,
    };
  };

const clearInvestmentPerformanceData =
  (): void => {
    investmentPerformances.length = 0;
  };

export const investmentPerformanceService = {
  createPerformance,
  updatePerformance,
  deletePerformance,
  getPerformanceById,
  getAllPerformances,

  calculateTotalReturn,
  calculateReturnPercentage,
  calculateAnnualizedReturn,

  getTopPerformingInvestments,
  getPortfolioPerformanceSummary,

  clearInvestmentPerformanceData,
};