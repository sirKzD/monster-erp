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