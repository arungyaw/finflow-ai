package com.finflow.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransferResponse(
        String referenceNumber,
        Long sourceAccountId,
        Long destinationAccountId,
        BigDecimal amount,
        LocalDateTime createdAt
) {
}
