package com.finflow.account.dto;

import com.finflow.account.AccountStatus;
import com.finflow.account.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountResponse(
        Long id,
        String accountNumber,
        AccountType accountType,
        BigDecimal balance,
        AccountStatus status,
        LocalDateTime createdAt
) {
}