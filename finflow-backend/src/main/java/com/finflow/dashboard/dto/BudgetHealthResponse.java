package com.finflow.dashboard.dto;

import com.finflow.transaction.TransactionCategory;

import java.math.BigDecimal;

public record BudgetHealthResponse(
        Long budgetId,
        TransactionCategory category,
        BigDecimal budgetAmount,
        BigDecimal spentAmount,
        BigDecimal remainingAmount,
        double percentageUsed,
        String status
) {
}