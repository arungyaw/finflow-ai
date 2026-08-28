package com.finflow.transaction.dto;

import com.finflow.transaction.TransactionCategory;
import com.finflow.transaction.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        Long accountId,
        TransactionType transactionType,
        TransactionCategory category,
        BigDecimal amount,
        String description,
        String referenceNumber,
        LocalDateTime createdAt
) {
}