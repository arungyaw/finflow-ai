package com.finflow.transaction.dto;

import jakarta.validation.constraints.*;
import com.finflow.transaction.TransactionCategory;
import java.math.BigDecimal;

public record WithdrawalRequest(
        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal amount,

        TransactionCategory category,

        String description
) {
}
