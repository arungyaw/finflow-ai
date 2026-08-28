package com.finflow.budget.dto;

import com.finflow.budget.BudgetPeriod;
import com.finflow.transaction.TransactionCategory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BudgetResponse(
        Long id,
        TransactionCategory category,
        BigDecimal amount,
        BudgetPeriod period,
        LocalDateTime createdAt
) {
}