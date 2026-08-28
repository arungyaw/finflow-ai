package com.finflow.dashboard.dto;

import java.math.BigDecimal;

public record MonthlyCashFlowResponse(
        String month,
        BigDecimal income,
        BigDecimal spending,
        BigDecimal netCashFlow
) {
}