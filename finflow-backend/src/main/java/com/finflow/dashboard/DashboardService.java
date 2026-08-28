package com.finflow.dashboard;

import com.finflow.account.AccountRepository;
import com.finflow.dashboard.dto.DashboardSummaryResponse;
import com.finflow.dashboard.dto.CategorySpendingResponse;
import com.finflow.transaction.dto.TransactionResponse;
import com.finflow.dashboard.dto.MonthlyCashFlowResponse;
import com.finflow.dashboard.dto.BudgetHealthResponse;

import com.finflow.budget.Budget;
import com.finflow.budget.BudgetRepository;
import com.finflow.budget.BudgetService;
import com.finflow.budget.dto.BudgetUsageResponse;

import com.finflow.exception.ResourceNotFoundException;
import com.finflow.transaction.TransactionRepository;

import com.finflow.user.User;
import com.finflow.user.UserRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.ArrayList;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final BudgetService budgetService;

    public DashboardService(
            UserRepository userRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            BudgetRepository budgetRepository,
            BudgetService budgetService) {

        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.budgetService = budgetService;
    }

    public DashboardSummaryResponse getSummary(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        LocalDate today = LocalDate.now();

        LocalDateTime startOfMonth =
                today.withDayOfMonth(1).atStartOfDay();

        LocalDateTime endOfMonth =
                today.with(TemporalAdjusters.lastDayOfMonth())
                        .atTime(LocalTime.MAX);

        BigDecimal totalBalance =
                accountRepository.getTotalBalanceByUser(user);

        BigDecimal monthlyIncome =
                transactionRepository.getTotalIncomeByDateRange(
                        user,
                        startOfMonth,
                        endOfMonth
                );

        BigDecimal monthlySpending =
                transactionRepository.getTotalSpendingByDateRange(
                        user,
                        startOfMonth,
                        endOfMonth
                );

        BigDecimal netCashFlow =
                monthlyIncome.subtract(monthlySpending);

        return new DashboardSummaryResponse(
                totalBalance,
                monthlyIncome,
                monthlySpending,
                netCashFlow
        );
    }

    public List<CategorySpendingResponse> getSpendingByCategory(
            String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        LocalDate today = LocalDate.now();

        LocalDateTime startOfMonth =
                today.withDayOfMonth(1).atStartOfDay();

        LocalDateTime endOfMonth =
                today.with(TemporalAdjusters.lastDayOfMonth())
                        .atTime(LocalTime.MAX);

        return transactionRepository
                .getSpendingByCategoryAndDateRange(
                        user,
                        startOfMonth,
                        endOfMonth
                )
                .stream()
                .map(row -> new CategorySpendingResponse(
                        (com.finflow.transaction.TransactionCategory) row[0],
                        (BigDecimal) row[1]
                ))
                .toList();
    }

    public List<TransactionResponse> getRecentTransactions(
            String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return transactionRepository
                .findTop10ByAccountUserOrderByCreatedAtDesc(user)
                .stream()
                .map(transaction -> new TransactionResponse(
                        transaction.getId(),
                        transaction.getAccount().getId(),
                        transaction.getTransactionType(),
                        transaction.getCategory(),
                        transaction.getAmount(),
                        transaction.getDescription(),
                        transaction.getReferenceNumber(),
                        transaction.getCreatedAt()
                ))
                .toList();
    }

    public List<MonthlyCashFlowResponse> getMonthlyCashFlow(
            String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        LocalDate startDate = LocalDate.now()
                .minusMonths(5)
                .withDayOfMonth(1);

        List<Object[]> rows =
                transactionRepository.getMonthlyCashFlow(
                        user,
                        startDate.atStartOfDay()
                );

        List<MonthlyCashFlowResponse> response = new ArrayList<>();

        for (Object[] row : rows) {

            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();

            BigDecimal income = (BigDecimal) row[2];
            BigDecimal spending = (BigDecimal) row[3];

            response.add(
                    new MonthlyCashFlowResponse(
                            String.format("%04d-%02d", year, month),
                            income,
                            spending,
                            income.subtract(spending)
                    )
            );
        }

        return response;
    }

    public List<BudgetHealthResponse> getBudgetHealth(
            String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        List<Budget> budgets =
                budgetRepository.findByUserOrderByCreatedAtDesc(user);

        return budgets.stream()
                .map(budget -> {

                    BudgetUsageResponse usage =
                            budgetService.getBudgetUsage(
                                    userEmail,
                                    budget.getId()
                            );

                    String status;

                    if (usage.percentageUsed() >= 100) {
                        status = "OVER_BUDGET";
                    } else if (usage.percentageUsed() >= 80) {
                        status = "NEAR_LIMIT";
                    } else {
                        status = "ON_TRACK";
                    }

                    return new BudgetHealthResponse(
                            budget.getId(),
                            budget.getCategory(),
                            usage.budgetAmount(),
                            usage.spentAmount(),
                            usage.remainingAmount(),
                            usage.percentageUsed(),
                            status
                    );
                })
                .toList();
    }
}