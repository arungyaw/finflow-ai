package com.finflow.account;

import com.finflow.account.dto.AccountResponse;
import com.finflow.account.dto.CreateAccountRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            Authentication authentication,
            @Valid @RequestBody CreateAccountRequest request) {

        Account account = accountService.createAccount(
                authentication.getName(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(account));
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAccounts(
            Authentication authentication) {

        List<AccountResponse> accounts = accountService
                .getAccountsByUser(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(accounts);
    }

    private AccountResponse toResponse(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType(),
                account.getBalance(),
                account.getStatus(),
                account.getCreatedAt()
        );
    }
}