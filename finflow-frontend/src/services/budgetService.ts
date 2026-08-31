import { apiRequest } from "./api";

import type {
    Budget,
    CreateBudgetRequest,
    UpdateBudgetRequest,
} from "../types/budget";

export function getBudgets() {
    return apiRequest<Budget[]>("/api/budgets");
}

export function createBudget(request: CreateBudgetRequest) {
    return apiRequest<Budget>("/api/budgets", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function updateBudget(
    budgetId: number,
    request: UpdateBudgetRequest
) {
    return apiRequest<Budget>(`/api/budgets/${budgetId}`, {
        method: "PUT",
        body: JSON.stringify(request),
    });
}

export function deleteBudget(budgetId: number) {
    return apiRequest<void>(`/api/budgets/${budgetId}`, {
        method: "DELETE",
    });
}