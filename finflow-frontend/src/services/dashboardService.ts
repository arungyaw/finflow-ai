import { apiRequest } from './api'
import type {
    BudgetHealth,
    CategorySpending,
    DashboardSummary,
    MonthlyCashFlow,
    RecentTransaction
} from '../types/dashboard'

export function getDashboardSummary() {
    return apiRequest<DashboardSummary>("/api/dashboard/summary");
}

export function getRecentTransactions() {
    return apiRequest<RecentTransaction[]>("/api/dashboard/recent-transactions");
}

export function getBudgetHealth() {
    return apiRequest<BudgetHealth[]>("/api/dashboard/budget-health");
}

export function getSpendingByCategory() {
    return apiRequest<CategorySpending[]>("/api/dashboard/spending-by-category");
}

export function getMonthlyCashFlow() {
    return apiRequest<MonthlyCashFlow[]>("/api/dashboard/monthly-cash-flow");
}

