package com.finflow.budget.dto;

import com.finflow.budget.BudgetPeriod;
import com.finflow.transaction.TransactionCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateBudgetRequest(

        @NotNull
        TransactionCategory category,

        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal amount,

        @NotNull
        BudgetPeriod period
) {
}