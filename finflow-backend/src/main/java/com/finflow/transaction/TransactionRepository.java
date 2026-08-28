package com.finflow.transaction;
import com.finflow.account.Account;
import com.finflow.user.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountOrderByCreatedAtDesc(Account account);

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.account.user = :user
        AND t.transactionType = com.finflow.transaction.TransactionType.WITHDRAWAL
        AND t.category = :category
        AND t.createdAt BETWEEN :startDate AND :endDate
        """)
    BigDecimal getTotalSpentByCategoryAndDateRange(
            @Param("user") User user,
            @Param("category") TransactionCategory category,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.account.user = :user
        AND t.transactionType = com.finflow.transaction.TransactionType.DEPOSIT
        AND t.createdAt BETWEEN :startDate AND :endDate
        """)
    BigDecimal getTotalIncomeByDateRange(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.account.user = :user
        AND t.transactionType = com.finflow.transaction.TransactionType.WITHDRAWAL
        AND t.createdAt BETWEEN :startDate AND :endDate
        """)
    BigDecimal getTotalSpendingByDateRange(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("""
        SELECT t.category, COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.account.user = :user
        AND t.transactionType = com.finflow.transaction.TransactionType.WITHDRAWAL
        AND t.createdAt BETWEEN :startDate AND :endDate
        GROUP BY t.category
        ORDER BY SUM(t.amount) DESC
        """)
    List<Object[]> getSpendingByCategoryAndDateRange(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("""
        SELECT
            EXTRACT(YEAR FROM t.createdAt),
            EXTRACT(MONTH FROM t.createdAt),
            SUM(CASE
                WHEN t.transactionType = com.finflow.transaction.TransactionType.DEPOSIT
                THEN t.amount
                ELSE 0
            END),
            SUM(CASE
                WHEN t.transactionType = com.finflow.transaction.TransactionType.WITHDRAWAL
                THEN t.amount
                ELSE 0
            END)
        FROM Transaction t
        WHERE t.account.user = :user
        AND t.createdAt >= :startDate
        GROUP BY
            EXTRACT(YEAR FROM t.createdAt),
            EXTRACT(MONTH FROM t.createdAt)
        ORDER BY
            EXTRACT(YEAR FROM t.createdAt),
            EXTRACT(MONTH FROM t.createdAt)
        """)
    List<Object[]> getMonthlyCashFlow(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate
    );

    List<Transaction> findTop10ByAccountUserOrderByCreatedAtDesc(User user);



}