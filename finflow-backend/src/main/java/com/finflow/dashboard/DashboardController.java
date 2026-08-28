package com.finflow.dashboard;

import com.finflow.dashboard.dto.DashboardSummaryResponse;
import com.finflow.dashboard.dto.CategorySpendingResponse;
import com.finflow.transaction.dto.TransactionResponse;
import com.finflow.dashboard.dto.MonthlyCashFlowResponse;
import com.finflow.dashboard.dto.BudgetHealthResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            Authentication authentication) {

        DashboardSummaryResponse response =
                dashboardService.getSummary(authentication.getName());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/spending-by-category")
    public ResponseEntity<List<CategorySpendingResponse>> getSpendingByCategory(
            Authentication authentication) {

        List<CategorySpendingResponse> response =
                dashboardService.getSpendingByCategory(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<List<TransactionResponse>> getRecentTransactions(
            Authentication authentication) {

        List<TransactionResponse> response =
                dashboardService.getRecentTransactions(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthly-cash-flow")
    public ResponseEntity<List<MonthlyCashFlowResponse>> getMonthlyCashFlow(
            Authentication authentication) {

        List<MonthlyCashFlowResponse> response =
                dashboardService.getMonthlyCashFlow(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/budget-health")
    public ResponseEntity<List<BudgetHealthResponse>> getBudgetHealth(
            Authentication authentication) {

        List<BudgetHealthResponse> response =
                dashboardService.getBudgetHealth(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}