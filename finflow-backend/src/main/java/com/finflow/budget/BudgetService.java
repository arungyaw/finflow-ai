package com.finflow.budget;

import com.finflow.budget.dto.CreateBudgetRequest;
import com.finflow.budget.dto.UpdateBudgetRequest;
import com.finflow.budget.dto.BudgetUsageResponse;
import com.finflow.transaction.TransactionRepository;

import com.finflow.exception.ResourceNotFoundException;
import com.finflow.exception.DuplicateBudgetException;

import com.finflow.user.User;
import com.finflow.user.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;


@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository) {

        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public Budget createBudget(
            String userEmail,
            CreateBudgetRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (budgetRepository.existsByUserAndCategoryAndPeriod(
                user,
                request.category(),
                request.period())) {

            throw new DuplicateBudgetException(
                    "Budget already exists for this category and period"
            );
        }

        Budget budget = new Budget(
                request.category(),
                request.amount(),
                request.period(),
                user
        );

        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgets(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return budgetRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    public Budget updateBudget(
            String userEmail,
            Long budgetId,
            UpdateBudgetRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Budget budget = budgetRepository
                .findByIdAndUser(budgetId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found"));

        budget.setAmount(request.amount());

        return budgetRepository.save(budget);
    }

    public void deleteBudget(
            String userEmail,
            Long budgetId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Budget budget = budgetRepository
                .findByIdAndUser(budgetId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found"));

        budgetRepository.delete(budget);
    }

    public BudgetUsageResponse getBudgetUsage(
            String userEmail,
            Long budgetId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Budget budget = budgetRepository
                .findByIdAndUser(budgetId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found"));

        LocalDate today = LocalDate.now();

        LocalDateTime startDate;
        LocalDateTime endDate;

        if (budget.getPeriod() == BudgetPeriod.WEEKLY) {

            LocalDate startOfWeek = today.with(
                    TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)
            );

            LocalDate endOfWeek = today.with(
                    TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)
            );

            startDate = startOfWeek.atStartOfDay();
            endDate = endOfWeek.atTime(LocalTime.MAX);

        } else {

            LocalDate startOfMonth = today.withDayOfMonth(1);
            LocalDate endOfMonth = today.with(
                    TemporalAdjusters.lastDayOfMonth()
            );

            startDate = startOfMonth.atStartOfDay();
            endDate = endOfMonth.atTime(LocalTime.MAX);
        }

        BigDecimal spentAmount =
                transactionRepository.getTotalSpentByCategoryAndDateRange(
                        user,
                        budget.getCategory(),
                        startDate,
                        endDate
                );

        BigDecimal remainingAmount =
                budget.getAmount().subtract(spentAmount);

        double percentageUsed = spentAmount
                .divide(
                        budget.getAmount(),
                        4,
                        RoundingMode.HALF_UP
                )
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();

        return new BudgetUsageResponse(
                budget.getId(),
                budget.getCategory(),
                budget.getPeriod(),
                budget.getAmount(),
                spentAmount,
                remainingAmount,
                percentageUsed
        );
    }

    public List<BudgetUsageResponse> getAllBudgetUsage(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        List<Budget> budgets =
                budgetRepository.findByUserOrderByCreatedAtDesc(user);

        return budgets.stream()
                .map(budget -> getBudgetUsage(userEmail, budget.getId()))
                .toList();
    }
}