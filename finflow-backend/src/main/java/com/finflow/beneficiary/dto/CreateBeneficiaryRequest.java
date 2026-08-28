package com.finflow.beneficiary.dto;

import jakarta.validation.constraints.*;

public record CreateBeneficiaryRequest(

        @NotBlank
        @Size(max =100)
        String name,

        @NotBlank
        @Size(max =20)
        String accountNumber
) {
}

