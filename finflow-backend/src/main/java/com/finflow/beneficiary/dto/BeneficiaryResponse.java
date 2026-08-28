package com.finflow.beneficiary.dto;

import java.time.LocalDateTime;

public record BeneficiaryResponse(
        Long id,
        String name,
        String accountNumber,
        LocalDateTime createdAt
) {
}
