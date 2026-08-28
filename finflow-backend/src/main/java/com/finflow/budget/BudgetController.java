package com.finflow.budget;

import com.finflow.budget.dto.BudgetResponse;
import com.finflow.budget.dto.CreateBudgetRequest;
import com.finflow.budget.dto.UpdateBudgetRequest;
import com.finflow.budget.dto.BudgetUsageResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(
            Authentication authentication,
            @Valid @RequestBody CreateBudgetRequest request) {

        Budget budget = budgetService.createBudget(
                authentication.getName(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(budget));
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(
            Authentication authentication) {

        List<BudgetResponse> budgets = budgetService
                .getBudgets(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(budgets);
    }

    private BudgetResponse toResponse(Budget budget) {
        return new BudgetResponse(
                budget.getId(),
                budget.getCategory(),
                budget.getAmount(),
                budget.getPeriod(),
                budget.getCreatedAt()
        );
    }

    @PutMapping("/{budgetId}")
    public ResponseEntity<BudgetResponse> updateBudget(
            @PathVariable Long budgetId,
            Authentication authentication,
            @Valid @RequestBody UpdateBudgetRequest request) {

        Budget budget = budgetService.updateBudget(
                authentication.getName(),
                budgetId,
                request
        );

        return ResponseEntity.ok(toResponse(budget));
    }

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long budgetId,
            Authentication authentication) {

        budgetService.deleteBudget(
                authentication.getName(),
                budgetId
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{budgetId}/usage")
    public ResponseEntity<BudgetUsageResponse> getBudgetUsage(
            @PathVariable Long budgetId,
            Authentication authentication) {

        BudgetUsageResponse response = budgetService.getBudgetUsage(
                authentication.getName(),
                budgetId
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/usage")
    public ResponseEntity<List<BudgetUsageResponse>> getAllBudgetUsage(
            Authentication authentication) {

        List<BudgetUsageResponse> response =
                budgetService.getAllBudgetUsage(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}