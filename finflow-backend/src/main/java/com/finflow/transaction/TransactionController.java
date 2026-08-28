package com.finflow.transaction;

import com.finflow.transaction.dto.DepositRequest;
import com.finflow.transaction.dto.TransactionResponse;
import com.finflow.transaction.dto.TransferRequest;
import com.finflow.transaction.dto.TransferResponse;
import com.finflow.transaction.dto.WithdrawalRequest;
import com.finflow.beneficiary.dto.BeneficiaryTransferRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/{accountId}/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @PathVariable Long accountId,
            Authentication authentication,
            @Valid @RequestBody DepositRequest request) {

        Transaction transaction = transactionService.deposit(
                authentication.getName(),
                accountId,
                request
        );

        TransactionResponse response = toResponse(transaction);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/{accountId}/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @PathVariable Long accountId,
            Authentication authentication,
            @Valid @RequestBody WithdrawalRequest request) {

        Transaction transaction = transactionService.withdraw(
                authentication.getName(),
                accountId,
                request
        );

        TransactionResponse response = toResponse(transaction);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{accountId}/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactionHistory(
            @PathVariable Long accountId,
            Authentication authentication) {

        List<TransactionResponse> transactions = transactionService
                .getTransactionHistory(authentication.getName(), accountId)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/{accountId}/transfer")
    public ResponseEntity<TransferResponse> transfer(
            @PathVariable Long accountId,
            Authentication authentication,
            @Valid @RequestBody TransferRequest request) {

        TransferResponse response = transactionService.transfer(
                authentication.getName(),
                accountId,
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAccount().getId(),
                transaction.getTransactionType(),
                transaction.getCategory(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getReferenceNumber(),
                transaction.getCreatedAt()
        );
    }

    @PostMapping("/{accountId}/transfer/beneficiary")
    public ResponseEntity<TransferResponse> transferToBeneficiary(
            @PathVariable Long accountId,
            Authentication authentication,
            @Valid @RequestBody BeneficiaryTransferRequest request) {

        TransferResponse response = transactionService.transferToBeneficiary(
                authentication.getName(),
                accountId,
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}