package com.finflow.beneficiary.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record BeneficiaryTransferRequest(

        @NotNull
        Long beneficiaryId,

        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal amount,

        String description
) {
}
