package com.finflow.account;

import com.finflow.account.dto.CreateAccountRequest;
import com.finflow.user.User;
import com.finflow.user.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;

@Service
public class AccountService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(
            AccountRepository accountRepository,
            UserRepository userRepository) {

        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public Account createAccount(
            String userEmail,
            CreateAccountRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String accountNumber = generateUniqueAccountNumber();

        Account account = new Account(
                accountNumber,
                request.accountType(),
                BigDecimal.ZERO,
                AccountStatus.ACTIVE,
                user
        );

        return accountRepository.save(account);
    }

    private String generateUniqueAccountNumber() {

        String accountNumber;

        do {
            accountNumber = String.format(
                    "%010d",
                    SECURE_RANDOM.nextLong(10_000_000_000L)
            );
        } while (accountRepository.existsByAccountNumber(accountNumber));

        return accountNumber;
    }

    public List<Account> getAccountsByUser(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return accountRepository.findByUser(user);
    }
}