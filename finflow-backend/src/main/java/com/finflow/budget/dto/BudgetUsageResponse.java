package com.finflow.budget.dto;

import com.finflow.budget.BudgetPeriod;
import com.finflow.transaction.TransactionCategory;

import java.math.BigDecimal;

public record BudgetUsageResponse(
        Long budgetId,
        TransactionCategory category,
        BudgetPeriod period,
        BigDecimal budgetAmount,
        BigDecimal spentAmount,
        BigDecimal remainingAmount,
        double percentageUsed
) {
}