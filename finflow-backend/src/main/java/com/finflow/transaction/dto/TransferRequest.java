package com.finflow.transaction.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record TransferRequest(

        @NotBlank
        String destinationAccountNumber,

        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal amount,

        String description
) {
}
