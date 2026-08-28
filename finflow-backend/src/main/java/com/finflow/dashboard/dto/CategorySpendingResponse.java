package com.finflow.dashboard.dto;

import com.finflow.transaction.TransactionCategory;

import java.math.BigDecimal;

public record CategorySpendingResponse(
        TransactionCategory category,
        BigDecimal amount
) {
}