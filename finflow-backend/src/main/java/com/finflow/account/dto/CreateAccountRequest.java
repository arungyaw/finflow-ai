package com.finflow.account.dto;

import com.finflow.account.AccountType;
import jakarta.validation.constraints.NotNull;

public record CreateAccountRequest(

        @NotNull
        AccountType accountType

) {
}