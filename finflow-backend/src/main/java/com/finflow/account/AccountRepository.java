package com.finflow.account;

import com.finflow.user.User;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByUser(User user);

    Optional<Account> findByAccountNumber(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);

    Optional<Account> findByIdAndUser(Long id, User user);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT a
            FROM Account a
            WHERE a.id = :accountId
            AND a.user = :user
            """)
    Optional<Account> findByIdAndUserForUpdate(
            @Param("accountId") Long accountId,
            @Param("user") User user
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT a
            FROM Account a
            WHERE a.accountNumber = :accountNumber
            """)
    Optional<Account> findByAccountNumberForUpdate(
            @Param("accountNumber") String accountNumber
    );

    @Query("""
        SELECT COALESCE(SUM(a.balance), 0)
        FROM Account a
        WHERE a.user = :user
        """)
    BigDecimal getTotalBalanceByUser(
            @Param("user") User user
    );
}