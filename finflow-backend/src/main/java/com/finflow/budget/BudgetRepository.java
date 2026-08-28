package com.finflow.budget;

import com.finflow.transaction.TransactionCategory;
import com.finflow.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserOrderByCreatedAtDesc(User user);

    Optional<Budget> findByIdAndUser(Long id, User user);

    boolean existsByUserAndCategoryAndPeriod(
            User user,
            TransactionCategory category,
            BudgetPeriod period
    );
}