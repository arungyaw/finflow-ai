export type DashboardSummary = {
  totalBalance: number;
  monthlyIncome: number;
  monthlySpending: number;
  netCashFlow: number;
};

export type RecentTransaction = {
    id: number;
    transactionType: string;
    category: string;
    amount: number;
    description: string;
    referenceNumber: string;
    createdAt: string;
};

export type CategorySpending = {
    category: string;
    amount: number;
};

export type BudgetHealth = {
  budgetId: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  status: string;
};

export type MonthlyCashFlow = {
    month: string;
    income: number;
    spending: number;
    netCashFlow: number;
};
