import { useEffect, useState } from "react";

import {
    createBudget,
    deleteBudget,
    getBudgets,
    updateBudget,
} from "../services/budgetService";

import type { Budget } from "../types/budget";

import "./BudgetsPage.css";

function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    const [category, setCategory] = useState("GROCERIES");
    const [amount, setAmount] = useState("");
    const [period, setPeriod] = useState<"WEEKLY" | "MONTHLY">(
        "MONTHLY"
    );

    const [editingBudgetId, setEditingBudgetId] = useState<number | null>(
        null
    );
    const [editCategory, setEditCategory] = useState("GROCERIES");
    const [editAmount, setEditAmount] = useState("");
    const [editPeriod, setEditPeriod] = useState<"WEEKLY" | "MONTHLY">(
        "MONTHLY"
    );

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deletingBudgetId, setDeletingBudgetId] = useState<number | null>(
        null
    );

    useEffect(() => {
        async function loadBudgets() {
            setIsLoading(true);
            setError("");

            try {
                const budgetData = await getBudgets();
                setBudgets(budgetData);
            } catch (budgetError) {
                setError(
                    budgetError instanceof Error
                        ? budgetError.message
                        : "Unable to load budgets"
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadBudgets();
    }, []);

    useEffect(() => {
        if (!successMessage) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [successMessage]);

    async function handleCreateBudget() {
        const parsedAmount = Number(amount);

        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setError("Enter a valid budget amount.");
            return;
        }

        setError("");
        setSuccessMessage("");
        setIsCreating(true);

        try {
            const newBudget = await createBudget({
                category,
                amount: parsedAmount,
                period,
            });

            setBudgets((currentBudgets) => [
                newBudget,
                ...currentBudgets,
            ]);

            setAmount("");
            setSuccessMessage("Budget created successfully.");
        } catch (budgetError) {
            setError(
                budgetError instanceof Error
                    ? budgetError.message
                    : "Unable to create budget"
            );
        } finally {
            setIsCreating(false);
        }
    }

    function startEditingBudget(budget: Budget) {
        setError("");
        setSuccessMessage("");

        setEditingBudgetId(budget.id);
        setEditCategory(budget.category);
        setEditAmount(String(budget.amount));
        setEditPeriod(budget.period);
    }

    function cancelEditingBudget() {
        setEditingBudgetId(null);
        setEditAmount("");
    }

    async function handleUpdateBudget(budgetId: number) {
        const parsedAmount = Number(editAmount);

        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setError("Enter a valid budget amount.");
            return;
        }

        setError("");
        setSuccessMessage("");
        setIsUpdating(true);

        try {
            const updatedBudget = await updateBudget(budgetId, {
                category: editCategory,
                amount: parsedAmount,
                period: editPeriod,
            });

            setBudgets((currentBudgets) =>
                currentBudgets.map((budget) =>
                    budget.id === budgetId ? updatedBudget : budget
                )
            );

            setEditingBudgetId(null);
            setEditAmount("");

            setSuccessMessage("Budget updated successfully.");
        } catch (budgetError) {
            setError(
                budgetError instanceof Error
                    ? budgetError.message
                    : "Unable to update budget"
            );
        } finally {
            setIsUpdating(false);
        }
    }

    async function handleDeleteBudget(budgetId: number) {
        setError("");
        setSuccessMessage("");
        setDeletingBudgetId(budgetId);

        try {
            await deleteBudget(budgetId);

            setBudgets((currentBudgets) =>
                currentBudgets.filter((budget) => budget.id !== budgetId)
            );

            if (editingBudgetId === budgetId) {
                setEditingBudgetId(null);
            }

            setSuccessMessage("Budget deleted successfully.");
        } catch (budgetError) {
            setError(
                budgetError instanceof Error
                    ? budgetError.message
                    : "Unable to delete budget"
            );
        } finally {
            setDeletingBudgetId(null);
        }
    }

    if (isLoading) {
        return <p className="budgets-loading">Loading budgets...</p>;
    }

    return (
        <main className="budgets-page">
            {successMessage && (
                <div className="budgets-success-toast">
                    {successMessage}
                </div>
            )}

            <header className="budgets-header">
                <div>
                    <h1>Budgets</h1>
                    <p>Create and manage your spending limits.</p>
                </div>
            </header>

            {error && <p className="budgets-error">{error}</p>}

            <section className="budget-form-panel">
                <div className="budget-form-field">
                    <label htmlFor="budgetCategory">Category</label>

                    <select
                        id="budgetCategory"
                        value={category}
                        onChange={(changeEvent) =>
                            setCategory(changeEvent.target.value)
                        }
                    >
                        <option value="GROCERIES">Groceries</option>
                        <option value="DINING">Dining</option>
                        <option value="TRANSPORTATION">Transportation</option>
                        <option value="SHOPPING">Shopping</option>
                        <option value="UTILITIES">Utilities</option>
                        <option value="ENTERTAINMENT">Entertainment</option>
                        <option value="HEALTHCARE">Healthcare</option>
                        <option value="HOUSING">Housing</option>
                        <option value="EDUCATION">Education</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div className="budget-form-field">
                    <label htmlFor="budgetAmount">Amount</label>

                    <input
                        id="budgetAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(changeEvent) =>
                            setAmount(changeEvent.target.value)
                        }
                    />
                </div>

                <div className="budget-form-field">
                    <label htmlFor="budgetPeriod">Period</label>

                    <select
                        id="budgetPeriod"
                        value={period}
                        onChange={(changeEvent) =>
                            setPeriod(
                                changeEvent.target.value as "WEEKLY" | "MONTHLY"
                            )
                        }
                    >
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={handleCreateBudget}
                    disabled={isCreating}
                >
                    {isCreating ? "Creating..." : "Create Budget"}
                </button>
            </section>

            {budgets.length === 0 ? (
                <section className="budgets-empty">
                    <h2>No budgets yet</h2>
                    <p>Create a budget above to start tracking spending limits.</p>
                </section>
            ) : (
                <section className="budgets-grid">
                    {budgets.map((budget) => {
                        const isEditing = editingBudgetId === budget.id;

                        return (
                            <article className="budget-item-card" key={budget.id}>
                                {isEditing ? (
                                    <>
                                        <div className="budget-edit-grid">
                                            <div className="budget-form-field">
                                                <label
                                                    htmlFor={`editCategory-${budget.id}`}
                                                >
                                                    Category
                                                </label>

                                                <select
                                                    id={`editCategory-${budget.id}`}
                                                    value={editCategory}
                                                    onChange={(changeEvent) =>
                                                        setEditCategory(changeEvent.target.value)
                                                    }
                                                >
                                                    <option value="GROCERIES">Groceries</option>
                                                    <option value="DINING">Dining</option>
                                                    <option value="TRANSPORTATION">
                                                        Transportation
                                                    </option>
                                                    <option value="SHOPPING">Shopping</option>
                                                    <option value="UTILITIES">Utilities</option>
                                                    <option value="ENTERTAINMENT">
                                                        Entertainment
                                                    </option>
                                                    <option value="HEALTHCARE">Healthcare</option>
                                                    <option value="HOUSING">Housing</option>
                                                    <option value="EDUCATION">Education</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>

                                            <div className="budget-form-field">
                                                <label htmlFor={`editAmount-${budget.id}`}>
                                                    Amount
                                                </label>

                                                <input
                                                    id={`editAmount-${budget.id}`}
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    value={editAmount}
                                                    onChange={(changeEvent) =>
                                                        setEditAmount(changeEvent.target.value)
                                                    }
                                                />
                                            </div>

                                            <div className="budget-form-field">
                                                <label htmlFor={`editPeriod-${budget.id}`}>
                                                    Period
                                                </label>

                                                <select
                                                    id={`editPeriod-${budget.id}`}
                                                    value={editPeriod}
                                                    onChange={(changeEvent) =>
                                                        setEditPeriod(
                                                            changeEvent.target.value as
                                                                | "WEEKLY"
                                                                | "MONTHLY"
                                                        )
                                                    }
                                                >
                                                    <option value="WEEKLY">Weekly</option>
                                                    <option value="MONTHLY">Monthly</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="budget-edit-actions">
                                            <button
                                                type="button"
                                                className="budget-save-button"
                                                onClick={() =>
                                                    handleUpdateBudget(budget.id)
                                                }
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? "Saving..." : "Save"}
                                            </button>

                                            <button
                                                type="button"
                                                className="budget-cancel-button"
                                                onClick={cancelEditingBudget}
                                                disabled={isUpdating}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="budget-item-header">
                                            <div>
                                                <h2>
                                                    {budget.category
                                                        .replaceAll("_", " ")
                                                        .toLowerCase()
                                                        .replace(/\b\w/g, (letter) =>
                                                            letter.toUpperCase()
                                                        )}
                                                </h2>

                                                <span>{budget.period}</span>
                                            </div>

                                            <div className="budget-card-actions">
                                                <button
                                                    type="button"
                                                    className="budget-edit-button"
                                                    onClick={() =>
                                                        startEditingBudget(budget)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="budget-delete-button"
                                                    onClick={() =>
                                                        handleDeleteBudget(budget.id)
                                                    }
                                                    disabled={
                                                        deletingBudgetId === budget.id
                                                    }
                                                >
                                                    {deletingBudgetId === budget.id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="budget-item-amount">
                                            <span>Budget limit</span>

                                            <strong>
                                                $
                                                {budget.amount.toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </strong>
                                        </div>
                                    </>
                                )}
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}

export default BudgetsPage;