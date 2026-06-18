export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  isActive: boolean;
  createdAt: string;
}

export type JournalEntryStatus =
  | "draft"
  | "posted"
  | "cancelled";

export interface JournalEntryLine {
  accountCode: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  reference: string;
  description: string;
  lines: JournalEntryLine[];
  status: JournalEntryStatus;
  createdAt: string;
  postedAt?: string;
}

export interface LedgerEntry {
  id: string;
  journalEntryId: string;
  accountCode: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
  description: string;
  postedAt: string;
}

export interface TrialBalanceLine {
  accountCode: string;
  debit: number;
  credit: number;
}

export interface TrialBalanceReport {
  lines: TrialBalanceLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

export interface ProfitAndLossReport {
  totalRevenue: number;
  totalExpense: number;
  netIncome: number;
  status: "profit" | "loss" | "break_even";
}

export interface BalanceSheetReport {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
}

export type CashFlowCategory =
  | "operating"
  | "investing"
  | "financing";

export interface CashFlowItem {
  id: string;
  category: CashFlowCategory;
  description: string;
  amount: number;
  occurredAt: string;
}

export interface CashFlowReport {
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  openingCashBalance: number;
  endingCashBalance: number;
}

export interface FinanceDashboardSummary {
  totalRevenue: number;
  totalExpense: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  netCashFlow: number;
  financeHealthScore: number;
}

export type FinanceGrade =
  | "A"
  | "B"
  | "C";

export interface FinanceKpi {
  profitMargin: number;
  debtRatio: number;
  cashFlowRatio: number;
  grade: FinanceGrade;
}

export type InvoiceStatus =
  | "draft"
  | "issued"
  | "paid"
  | "cancelled";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  createdAt: string;
  issuedAt?: string;
  paidAt?: string;
  dueDate?: string;
}

export type PaymentStatus =
  | "completed"
  | "cancelled";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  status: PaymentStatus;
  paidAt: string;
}

export interface ReceivableSummary {
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  overdueBalance: number;
  overdueInvoiceCount: number;
  collectionRate: number;
}

export type VendorBillStatus =
  | "draft"
  | "issued"
  | "paid"
  | "cancelled";

export interface VendorBill {
  id: string;
  vendorId: string;
  total: number;
  status: VendorBillStatus;
  createdAt: string;
  dueDate?: string;
  paidAt?: string;
}

export type BillPaymentStatus =
  | "completed"
  | "cancelled";

export interface BillPayment {
  id: string;
  billId: string;
  amount: number;
  status: BillPaymentStatus;
  paidAt: string;
}

export interface PayableSummary {
  totalBilled: number;
  totalPaid: number;
  outstandingPayable: number;
  overdueBalance: number;
  overdueBillCount: number;
  paymentRate: number;
}

export type BankTransactionStatus =
  | "unmatched"
  | "matched"
  | "reconciled";

export interface BankTransaction {
  id: string;
  reference: string;
  description: string;
  amount: number;
  occurredAt: string;
  status: BankTransactionStatus;
  matchedPaymentId?: string;
}

export interface BankReconciliationSummary {
  totalTransactions: number;
  matchedTransactions: number;
  unmatchedTransactions: number;
  reconciledTransactions: number;
  totalMatchedAmount: number;
  totalUnmatchedAmount: number;
}

export type BudgetStatus =
  | "active"
  | "closed";

export interface Budget {
  id: string;
  accountCode: string;
  period: string;
  plannedAmount: number;
  status: BudgetStatus;
  createdAt: string;
}

export interface BudgetVariance {
  accountCode: string;
  period: string;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  status: "under_budget" | "on_budget" | "over_budget";
}

export type FixedAssetStatus =
  | "active"
  | "disposed";

export interface FixedAsset {
  id: string;
  name: string;
  acquisitionCost: number;
  residualValue: number;
  usefulLifeMonths: number;
  status: FixedAssetStatus;
  acquiredAt: string;
  disposedAt?: string;
}

export interface AssetDepreciationSchedule {
  assetId: string;
  month: number;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
}

export type CostCenterStatus =
  | "active"
  | "inactive";

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  status: CostCenterStatus;
  createdAt: string;
}

export interface CostCenterAllocation {
  id: string;
  costCenterCode: string;
  accountCode: string;
  amount: number;
  description: string;
  allocatedAt: string;
}

export interface CostCenterSummary {
  costCenterCode: string;
  totalAllocated: number;
  allocationCount: number;
}

export type TaxType =
  | "VAT"
  | "WITHHOLDING";

export interface TaxRule {
  id: string;
  code: string;
  name: string;
  type: TaxType;
  rate: number;
  isActive: boolean;
}

export interface TaxCalculation {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export interface TaxSummary {
  taxRuleId: string;
  taxRuleName: string;
  transactionCount: number;
  taxableAmount: number;
  taxAmount: number;
}

export type AccountingPeriodStatus =
  | "open"
  | "closed"
  | "locked";

export interface AccountingPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: AccountingPeriodStatus;
  createdAt: string;
}

export interface FiscalYear {
  id: string;
  year: number;
  startDate: string;
  endDate: string;
  periods: AccountingPeriod[];
  createdAt: string;
}

export type CurrencyStatus =
  | "active"
  | "inactive";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  status: CurrencyStatus;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: string;
}

export interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  originalAmount: number;
  convertedAmount: number;
  rate: number;
}

export type FinancialClosingStatus =
  | "draft"
  | "closed"
  | "reopened";

export interface FinancialClosing {
  id: string;
  periodId: string;
  trialBalanceTotalDebit: number;
  trialBalanceTotalCredit: number;
  status: FinancialClosingStatus;
  closedAt?: string;
  reopenedAt?: string;
  createdAt: string;
}

export interface FinancialClosingSummary {
  periodId: string;
  isTrialBalanceBalanced: boolean;
  totalDebit: number;
  totalCredit: number;
  status: FinancialClosingStatus;
}

export type FinancialRatioGrade =
  | "excellent"
  | "healthy"
  | "warning"
  | "critical";

export interface FinancialRatioAnalysis {
  currentRatio: number;
  debtRatio: number;
  netProfitMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  grade: FinancialRatioGrade;
}

export interface CustomerLedgerEntry {
  customerId: string;
  invoiceId: string;
  invoiceTotal: number;
  paidAmount: number;
  outstandingAmount: number;
  status: InvoiceStatus;
}

export interface CustomerLedgerSummary {
  customerId: string;
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  invoiceCount: number;
}

export interface VendorLedgerEntry {
  vendorId: string;
  billId: string;
  billTotal: number;
  paidAmount: number;
  outstandingAmount: number;
  status: VendorBillStatus;
}

export interface VendorLedgerSummary {
  vendorId: string;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
  billCount: number;
}

export type AgingBucket =
  | "current"
  | "1_30"
  | "31_60"
  | "61_90"
  | "90_plus";

export interface ReceivableAgingItem {
  invoiceId: string;
  customerId: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  outstandingAmount: number;
  daysOverdue: number;
  bucket: AgingBucket;
}

export interface ReceivableAgingSummary {
  current: number;
  bucket1To30: number;
  bucket31To60: number;
  bucket61To90: number;
  bucket90Plus: number;
  totalOutstanding: number;
}

export interface PayableAgingItem {
  billId: string;
  vendorId: string;
  vendorName: string;
  billDate: string;
  dueDate: string;
  outstandingAmount: number;
  daysOverdue: number;
  bucket: AgingBucket;
}

export interface PayableAgingSummary {
  current: number;
  bucket1To30: number;
  bucket31To60: number;
  bucket61To90: number;
  bucket90Plus: number;
  totalOutstanding: number;
}

export type BudgetVarianceStatus =
  | "under_budget"
  | "on_budget"
  | "over_budget";

export interface BudgetVarianceAnalysis {
  budgetId: string;
  accountCode: string;
  period: string;
  plannedAmount: number;
  actualAmount: number;
  varianceAmount: number;
  variancePercentage: number;
  status: BudgetVarianceStatus;
}

export interface BudgetVarianceSummary {
  totalPlanned: number;
  totalActual: number;
  totalVariance: number;
  totalVariancePercentage: number;
  underBudgetCount: number;
  onBudgetCount: number;
  overBudgetCount: number;
}

export type DepartmentBudgetStatus =
  | "active"
  | "closed";

export interface DepartmentBudget {
  id: string;
  departmentId: string;
  departmentName: string;
  period: string;
  allocatedBudget: number;
  usedBudget: number;
  status: DepartmentBudgetStatus;
  createdAt: string;
}

export interface DepartmentBudgetSummary {
  departmentId: string;
  departmentName: string;
  allocatedBudget: number;
  usedBudget: number;
  remainingBudget: number;
  utilizationRate: number;
}

export interface CostAllocation {
  id: string;
  sourceAccountCode: string;
  targetCostCenterCode: string;
  allocationPercentage: number;
  allocatedAmount: number;
  allocatedAt: string;
}

export interface CostAllocationSummary {
  sourceAccountCode: string;
  totalAllocatedAmount: number;
  allocationCount: number;
}

export type ExpenseClaimStatus =
  | "submitted"
  | "approved"
  | "rejected"
  | "paid";

export interface ExpenseClaim {
  id: string;
  employeeId: string;
  category: string;
  description: string;
  amount: number;
  status: ExpenseClaimStatus;
  submittedAt: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface ExpenseClaimSummary {
  totalClaims: number;
  totalAmount: number;
  approvedAmount: number;
  paidAmount: number;
}

export type CashTransactionType =
  | "inflow"
  | "outflow";

export interface CashTransaction {
  id: string;
  description: string;
  amount: number;
  type: CashTransactionType;
  transactionDate: string;
}

export interface CashPosition {
  openingBalance: number;
  totalInflow: number;
  totalOutflow: number;
  closingBalance: number;
}

export interface DailyCashSummary {
  date: string;
  inflow: number;
  outflow: number;
  netCashFlow: number;
}

export interface CashManagementSummary {
  totalTransactions: number;
  totalInflow: number;
  totalOutflow: number;
  endingCashBalance: number;
}

export type PettyCashStatus =
  | "active"
  | "closed";

export interface PettyCashFund {
  id: string;
  name: string;
  openingBalance: number;
  currentBalance: number;
  status: PettyCashStatus;
  createdAt: string;
}

export interface PettyCashExpense {
  id: string;
  fundId: string;
  description: string;
  amount: number;
  expenseDate: string;
}

export interface PettyCashReplenishment {
  id: string;
  fundId: string;
  amount: number;
  replenishedAt: string;
}

export interface PettyCashSummary {
  fundId: string;
  openingBalance: number;
  currentBalance: number;
  totalExpenses: number;
  totalReplenishments: number;
}

export interface CashForecastEntry {
  date: string;
  expectedInflow: number;
  expectedOutflow: number;
}

export interface CashForecastResult {
  date: string;
  openingBalance: number;
  inflow: number;
  outflow: number;
  closingBalance: number;
}

export interface CashForecastSummary {
  openingBalance: number;
  totalInflow: number;
  totalOutflow: number;
  endingBalance: number;
}

export type BankAccountStatus =
  | "active"
  | "inactive"
  | "closed";

export interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  currencyCode: string;
  balance: number;
  status: BankAccountStatus;
  createdAt: string;
}

export interface BankAccountSummary {
  totalAccounts: number;
  activeAccounts: number;
  inactiveAccounts: number;
  totalBalance: number;
}

export type FundTransferStatus =
  | "draft"
  | "completed"
  | "cancelled";

export interface FundTransfer {
  id: string;
  fromBankAccountId: string;
  toBankAccountId: string;
  amount: number;
  description: string;
  transferredAt: string;
  status: FundTransferStatus;
}

export interface FundTransferSummary {
  totalTransfers: number;
  completedTransfers: number;
  cancelledTransfers: number;
  totalTransferredAmount: number;
}

export type TreasuryPositionStatus =
  | "healthy"
  | "warning"
  | "critical";

export interface TreasuryPosition {
  totalCash: number;
  totalBankBalance: number;
  totalAvailableFunds: number;
  minimumLiquidityTarget: number;
  status: TreasuryPositionStatus;
}

export interface TreasurySummary {
  totalCashAccounts: number;
  totalFunds: number;
  liquidityRatio: number;
  status: TreasuryPositionStatus;
}

export type LoanStatus =
  | "active"
  | "closed";

export interface Loan {
  id: string;
  lenderName: string;
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  startDate: string;
  maturityDate: string;
  status: LoanStatus;
}

export interface LoanSummary {
  totalPrincipal: number;
  totalOutstanding: number;
  activeLoanCount: number;
  closedLoanCount: number;
}

export type LoanRepaymentStatus =
  | "scheduled"
  | "paid"
  | "overdue";

export interface LoanRepayment {
  id: string;
  loanId: string;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  status: LoanRepaymentStatus;
}

export interface LoanRepaymentSummary {
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  totalPaid: number;
  paidCount: number;
  overdueCount: number;
}

export type InvestmentStatus =
  | "active"
  | "sold";

export interface Investment {
  id: string;
  name: string;
  type: string;
  initialAmount: number;
  currentValue: number;
  acquiredAt: string;
  status: InvestmentStatus;
}

export interface InvestmentSummary {
  totalInitialAmount: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  returnPercentage: number;
  activeInvestmentCount: number;
  soldInvestmentCount: number;
}

export interface DividendPayment {
  id: string;
  investmentId: string;
  paymentDate: string;
  amount: number;
}

export interface DividendSummary {
  totalDividend: number;
  paymentCount: number;
  averageDividend: number;
}

export interface CapitalGainRecord {
  id: string;
  investmentId: string;
  purchaseAmount: number;
  currentValue: number;
  realized: boolean;
}

export interface CapitalGainSummary {
  totalCost: number;
  totalMarketValue: number;
  totalGain: number;
  gainPercentage: number;
}

export interface InvestmentPerformance {
  id: string;
  portfolioId: string;

  evaluationDate: string;

  totalInvestedAmount: number;
  currentMarketValue: number;

  realizedGain: number;
  unrealizedGain: number;
  dividendIncome: number;

  totalReturn: number;
  totalReturnPercentage: number;
  annualizedReturnPercentage: number;

  createdAt: string;
  updatedAt: string;
}


export interface InvestmentPerformanceSummary {
  totalPortfolios: number;

  totalInvestedAmount: number;
  totalMarketValue: number;

  totalRealizedGain: number;
  totalUnrealizedGain: number;
  totalDividendIncome: number;

  totalReturn: number;

  averageReturnPercentage: number;
  averageAnnualizedReturnPercentage: number;

  bestPerformingPortfolioId?: string;
}

export type InvestmentRiskLevel =
  | "low"
  | "medium"
  | "high";

export interface InvestmentRiskAssessment {
  id: string;
  portfolioId: string;
  riskScore: number;
  riskLevel: InvestmentRiskLevel;
  volatilityPercentage: number;
  maxDrawdownPercentage: number;
  concentrationRiskPercentage: number;
  liquidityRiskLevel: InvestmentRiskLevel;
  evaluationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentRiskSummary {
  totalAssessments: number;
  averageRiskScore: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
}

export interface InvestmentBenchmark {
  id: string;
  portfolioId: string;
  benchmarkName: string;
  benchmarkReturnPercentage: number;
  portfolioReturnPercentage: number;
  excessReturnPercentage: number;
  trackingErrorPercentage: number;
  evaluationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentBenchmarkSummary {
  totalBenchmarks: number;
  averagePortfolioReturn: number;
  averageBenchmarkReturn: number;
  averageExcessReturn: number;
  outperformCount: number;
  underperformCount: number;
}

export type RebalancingStatus =
  | "DRAFT"
  | "ANALYZED"
  | "APPROVED"
  | "COMPLETED";

export interface PortfolioRebalancingAsset {
  investmentId: string;
  symbol: string;
  currentValue: number;
  currentWeight: number;
  targetWeight: number;
  variancePercentage: number;
  recommendedBuyAmount: number;
  recommendedSellAmount: number;
}

export interface PortfolioRebalancing {
  id: string;
  portfolioId: string;
  name: string;
  rebalancingDate: string;
  thresholdPercentage: number;
  status: RebalancingStatus;
  assets: PortfolioRebalancingAsset[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioRebalancingSummary {
  totalPortfolioValue: number;
  assetCount: number;
  overweightAssets: number;
  underweightAssets: number;
  totalBuyAmount: number;
  totalSellAmount: number;
  largestDeviationPercentage: number;
}

export type LiquidityStatus =
  | "strong"
  | "stable"
  | "tight"
  | "critical";

export interface LiquidityAnalysis {
  id: string;
  period: string;
  cashBalance: number;
  bankBalance: number;
  receivablesDueSoon: number;
  payablesDueSoon: number;
  shortTermDebt: number;
  operatingCashOutflow: number;
  liquidityRatio: number;
  netLiquidityPosition: number;
  status: LiquidityStatus;
  analyzedAt: string;
}

export interface LiquiditySummary {
  totalLiquidAssets: number;
  totalShortTermObligations: number;
  netLiquidityPosition: number;
  liquidityRatio: number;
  status: LiquidityStatus;
}

export interface WorkingCapitalAnalysis {
  id: string;
  analysisDate: string;

  currentAssets: number;
  currentLiabilities: number;

  inventory: number;
  accountsReceivable: number;
  accountsPayable: number;

  annualRevenue: number;
  annualCostOfGoodsSold: number;

  workingCapital: number;
  currentRatio: number;
  workingCapitalTurnover: number;

  inventoryDays: number;
  receivableDays: number;
  payableDays: number;

  cashConversionCycle: number;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface WorkingCapitalAnalysisSummary {
  totalWorkingCapital: number;
  currentRatio: number;
  workingCapitalTurnover: number;
  cashConversionCycle: number;
  liquidityStatus: "WEAK" | "STABLE" | "STRONG";
}

export interface CashConversionCycleAnalysis {
  id: string;
  analysisDate: string;

  inventory: number;
  accountsReceivable: number;
  accountsPayable: number;

  annualRevenue: number;
  annualCostOfGoodsSold: number;

  inventoryDays: number;
  receivableDays: number;
  payableDays: number;

  cashConversionCycle: number;

  efficiencyScore: number;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CashConversionCycleAnalysisSummary {
  inventoryDays: number;
  receivableDays: number;
  payableDays: number;
  cashConversionCycle: number;
  efficiencyScore: number;
  cycleStatus: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
}

export type DebtRiskLevel =
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "CRITICAL";

export interface DebtAnalysis {
  id: string;
  analysisDate: string;

  totalDebt: number;
  totalAssets: number;
  totalEquity: number;

  ebit: number;
  interestExpense: number;

  debtRatio: number;
  debtToEquityRatio: number;
  debtToAssetRatio: number;
  interestCoverageRatio: number;

  riskLevel: DebtRiskLevel;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface DebtAnalysisSummary {
  totalDebt: number;
  debtRatio: number;
  debtToEquityRatio: number;
  debtToAssetRatio: number;
  interestCoverageRatio: number;
  riskLevel: DebtRiskLevel;
}

export type SolvencyLevel =
  | "EXCELLENT"
  | "GOOD"
  | "MODERATE"
  | "WEAK"
  | "CRITICAL";

export interface SolvencyAnalysis {
  id: string;
  companyName: string;

  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;

  debtToAssetRatio: number;
  debtToEquityRatio: number;
  equityRatio: number;
  solvencyRatio: number;

  solvencyLevel: SolvencyLevel;

  analysisDate: string;
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface SolvencyAnalysisSummary {
  analysisCount: number;

  averageDebtToAssetRatio: number;
  averageDebtToEquityRatio: number;
  averageEquityRatio: number;
  averageSolvencyRatio: number;

  healthyCompanies: number;
  riskyCompanies: number;

  highestSolvencyRatio: number;
  lowestSolvencyRatio: number;
}

export type FinancialHealthGrade =
  | "POOR"
  | "FAIR"
  | "GOOD"
  | "EXCELLENT";

export interface FinancialHealthScore {
  id: string;
  companyName: string;

  liquidityScore: number;
  profitabilityScore: number;
  solvencyScore: number;
  efficiencyScore: number;
  cashFlowScore: number;

  overallScore: number;
  grade: FinancialHealthGrade;

  assessmentDate: string;
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface FinancialHealthScoreSummary {
  totalAssessments: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;

  poorCount: number;
  fairCount: number;
  goodCount: number;
  excellentCount: number;
}

export type CreditRiskLevel =
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "CRITICAL";

export interface CreditRiskAnalysis {
  id: string;
  customerId: string;
  customerName: string;

  outstandingBalance: number;
  overdueBalance: number;
  overdueDays: number;
  paymentHistoryScore: number;
  creditLimit: number;

  creditUtilizationRatio: number;
  riskScore: number;
  riskLevel: CreditRiskLevel;

  analysisDate: string;
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreditRiskAnalysisSummary {
  totalCustomers: number;
  averageRiskScore: number;
  lowRiskCount: number;
  moderateRiskCount: number;
  highRiskCount: number;
  criticalRiskCount: number;
  totalOutstandingBalance: number;
  totalOverdueBalance: number;
}

export type ProfitabilityGrade =
  | "LOW"
  | "MODERATE"
  | "GOOD"
  | "EXCELLENT";

export interface ProfitabilityAnalysis {
  id: string;
  period: string;

  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  totalAssets: number;
  totalEquity: number;

  grossProfit: number;
  operatingProfit: number;
  netProfit: number;

  grossProfitMargin: number;
  operatingProfitMargin: number;
  netProfitMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;

  profitabilityScore: number;
  grade: ProfitabilityGrade;

  analysisDate: string;
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ProfitabilityAnalysisSummary {
  totalAnalyses: number;
  averageGrossProfitMargin: number;
  averageOperatingProfitMargin: number;
  averageNetProfitMargin: number;
  averageReturnOnAssets: number;
  averageReturnOnEquity: number;
  averageProfitabilityScore: number;
  lowCount: number;
  moderateCount: number;
  goodCount: number;
  excellentCount: number;
}

export type RevenueTrend =
  | "STRONG_GROWTH"
  | "GROWTH"
  | "STABLE"
  | "DECLINE"
  | "STRONG_DECLINE";

export interface RevenueAnalysis {
  id: string;
  period: string;

  currentRevenue: number;
  previousRevenue: number;

  revenueGrowthPercentage: number;

  monthlyAverageRevenue: number;
  highestRevenue: number;
  lowestRevenue: number;

  revenueVolatilityPercentage: number;

  trend: RevenueTrend;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface RevenueAnalysisSummary {
  totalRevenue: number;
  averageRevenue: number;

  revenueGrowthPercentage: number;

  highestRevenue: number;
  lowestRevenue: number;

  revenueVolatilityPercentage: number;

  trend: RevenueTrend;
}

export type RevenueForecastStatus =
  | "DRAFT"
  | "PROJECTED"
  | "REVIEWED"
  | "APPROVED";

export type ForecastMethod =
  | "MANUAL"
  | "GROWTH_RATE"
  | "MOVING_AVERAGE";

export interface RevenueForecastPeriod {
  period: string;
  historicalRevenue: number;
  projectedRevenue: number;
  growthPercentage: number;
}

export interface RevenueForecast {
  id: string;
  name: string;
  forecastDate: string;
  method: ForecastMethod;
  forecastPeriods: RevenueForecastPeriod[];
  status: RevenueForecastStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueForecastSummary {
  periodCount: number;
  totalHistoricalRevenue: number;
  totalProjectedRevenue: number;
  averageGrowthPercentage: number;
  projectedIncreaseAmount: number;
}

export type BreakEvenStatus =
  | "DRAFT"
  | "ANALYZED"
  | "APPROVED";

export interface BreakEvenAnalysis {
  id: string;
  name: string;

  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;

  targetProfit?: number;

  status: BreakEvenStatus;

  createdAt: string;
  updatedAt: string;
}

export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;

  contributionMarginPerUnit: number;
  contributionMarginRatio: number;

  marginOfSafetyRevenue: number;
  marginOfSafetyPercentage: number;

  targetProfitUnits: number;
  targetProfitRevenue: number;
}

export interface BreakEvenSummary {
  totalAnalyses: number;

  averageBreakEvenUnits: number;
  averageContributionMarginRatio: number;
  averageMarginOfSafetyPercentage: number;
}