import { useEffect, useState } from "react";

import {
    getBudgetHealth,
    getDashboardSummary,
    getMonthlyCashFlow,
    getRecentTransactions,
    getSpendingByCategory,
} from "../services/dashboardService";

import type {
    BudgetHealth,
    CategorySpending,
    DashboardSummary,
    MonthlyCashFlow,
    RecentTransaction,
} from "../types/dashboard";

import "./DashboardPage.css";

function DashboardPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<
        RecentTransaction[]
    >([]);
    const [categorySpending, setCategorySpending] = useState<CategorySpending[]>(
        []
    );
    const [budgetHealth, setBudgetHealth] = useState<BudgetHealth[]>([]);
    const [monthlyCashFlow, setMonthlyCashFlow] = useState<MonthlyCashFlow[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getDashboardSummary()
            .then(setSummary)
            .catch((dashboardError) => {
                setError(
                    dashboardError instanceof Error
                        ? dashboardError.message
                        : "Unable to load dashboard"
                );
            });

        getRecentTransactions()
            .then(setRecentTransactions)
            .catch(() => {
                setRecentTransactions([]);
            });

        getSpendingByCategory()
            .then(setCategorySpending)
            .catch(() => {
                setCategorySpending([]);
            });

        getBudgetHealth()
            .then(setBudgetHealth)
            .catch(() => {
                setBudgetHealth([]);
            });

        getMonthlyCashFlow()
            .then(setMonthlyCashFlow)
            .catch(() => {
                setMonthlyCashFlow([]);
            });
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!summary) {
        return <p>Loading dashboard...</p>;
    }

    const maxCategoryAmount = Math.max(
        ...categorySpending.map((item) => item.amount),
        1
    );

    return (
        <main className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your financial activity</p>
                </div>
            </header>

            <section className="summary-grid">
                <article>
                    <h2>Total Balance</h2>
                    <p>${summary.totalBalance.toFixed(2)}</p>
                </article>

                <article>
                    <h2>Monthly Income</h2>
                    <p>${summary.monthlyIncome.toFixed(2)}</p>
                </article>

                <article>
                    <h2>Monthly Spending</h2>
                    <p>${summary.monthlySpending.toFixed(2)}</p>
                </article>

                <article>
                    <h2>Net Cash Flow</h2>
                    <p>${summary.netCashFlow.toFixed(2)}</p>
                </article>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Recent Transactions</h2>
                </div>

                <div className="transactions-table-wrapper">
                    <table className="transactions-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Amount</th>
                        </tr>
                        </thead>

                        <tbody>
                        {recentTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>
                                    {new Date(transaction.createdAt).toLocaleDateString()}
                                </td>

                                <td>{transaction.description || "Transaction"}</td>

                                <td>{transaction.category}</td>

                                <td>{transaction.transactionType}</td>

                                <td>${transaction.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Spending by Category</h2>
                </div>

                <div className="category-spending-list">
                    {categorySpending.map((item) => {
                        const width = (item.amount / maxCategoryAmount) * 100;

                        return (
                            <div className="category-spending-item" key={item.category}>
                                <div className="category-spending-row">
                                    <span>{item.category}</span>
                                    <strong>${item.amount.toFixed(2)}</strong>
                                </div>

                                <div className="category-spending-track">
                                    <div
                                        className="category-spending-bar"
                                        style={{ width: `${width}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Budget Health</h2>
                </div>

                <div className="budget-grid">
                    {budgetHealth.map((budget) => (
                        <article className="budget-card" key={budget.budgetId}>
                            <div className="budget-card-header">
                                <strong>{budget.category}</strong>
                                <span>{budget.status}</span>
                            </div>

                            <p>
                                ${budget.spentAmount.toFixed(2)} of $
                                {budget.budgetAmount.toFixed(2)}
                            </p>

                            <div className="budget-track">
                                <div
                                    className="budget-progress"
                                    style={{
                                        width: `${Math.min(budget.percentageUsed, 100)}%`,
                                    }}
                                />
                            </div>

                            <small>${budget.remainingAmount.toFixed(2)} remaining</small>
                        </article>
                    ))}
                </div>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Monthly Cash Flow</h2>
                </div>

                <div className="cash-flow-list">
                    {monthlyCashFlow.map((item) => (
                        <div className="cash-flow-row" key={item.month}>
                            <strong>{item.month}</strong>

                            <span>Income: ${item.income.toFixed(2)}</span>

                            <span>Spending: ${item.spending.toFixed(2)}</span>

                            <span>Net: ${item.netCashFlow.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default DashboardPage;