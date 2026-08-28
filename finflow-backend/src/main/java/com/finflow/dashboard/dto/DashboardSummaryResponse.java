package com.finflow.dashboard.dto;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        BigDecimal totalBalance,
        BigDecimal monthlyIncome,
        BigDecimal monthlySpending,
        BigDecimal netCashFlow
) {
}