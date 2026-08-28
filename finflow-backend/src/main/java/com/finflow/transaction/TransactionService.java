package com.finflow.transaction;

import com.finflow.account.Account;
import com.finflow.account.AccountRepository;
import com.finflow.account.AccountStatus;

import com.finflow.exception.InsufficientFundsException;
import com.finflow.exception.InvalidTransferException;
import com.finflow.exception.ResourceNotFoundException;
import com.finflow.exception.AccountOperationException;
import com.finflow.exception.InvalidTransactionCategoryException;

import com.finflow.beneficiary.Beneficiary;
import com.finflow.beneficiary.BeneficiaryRepository;
import com.finflow.beneficiary.dto.BeneficiaryTransferRequest;

import com.finflow.transaction.dto.DepositRequest;
import com.finflow.transaction.dto.TransferRequest;
import com.finflow.transaction.dto.TransferResponse;
import com.finflow.transaction.dto.WithdrawalRequest;

import com.finflow.user.User;
import com.finflow.user.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final BeneficiaryRepository beneficiaryRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            AccountRepository accountRepository,
            UserRepository userRepository,
            BeneficiaryRepository beneficiaryRepository) {

        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.beneficiaryRepository = beneficiaryRepository;
    }

    @Transactional
    public Transaction deposit(
            String userEmail,
            Long accountId,
            DepositRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Account account = accountRepository.findByIdAndUser(accountId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));

        account.setBalance(
                account.getBalance().add(request.amount())
        );

        Transaction transaction = new Transaction(
                account,
                TransactionType.DEPOSIT,
                TransactionCategory.INCOME,
                request.amount(),
                request.description(),
                UUID.randomUUID().toString()
        );

        accountRepository.save(account);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction withdraw(
            String userEmail,
            Long accountId,
            WithdrawalRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Account account = accountRepository.findByIdAndUser(accountId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountOperationException(
                    "Account must be active to withdraw funds"
            );
        }

        if (request.category() == TransactionCategory.INCOME ||
                request.category() == TransactionCategory.TRANSFER) {
            throw new InvalidTransactionCategoryException(
                    "Invalid category for withdrawal"
            );
        }

        if (account.getBalance().compareTo(request.amount()) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient account balance"
            );
        }

        account.setBalance(
                account.getBalance().subtract(request.amount())
        );

        Transaction transaction = new Transaction(
                account,
                TransactionType.WITHDRAWAL,
                request.category() != null
                                ? request.category()
                                : TransactionCategory.OTHER,
                request.amount(),
                request.description(),
                UUID.randomUUID().toString()
        );

        accountRepository.save(account);

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionHistory(
            String userEmail,
            Long accountId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Account account = accountRepository.findByIdAndUser(accountId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));

        return transactionRepository
                .findByAccountOrderByCreatedAtDesc(account);
    }

    @Transactional
    public TransferResponse transfer(
            String userEmail,
            Long sourceAccountId,
            TransferRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Account sourceAccount = accountRepository
                .findByIdAndUserForUpdate(sourceAccountId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Source account not found"
                        ));

        Account destinationAccount = accountRepository
                .findByAccountNumberForUpdate(
                        request.destinationAccountNumber()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Destination account not found"
                        ));
        return executeTransfer(
                sourceAccount,
                destinationAccount,
                request.amount(),
                request.description()
        );


    }

    @Transactional
    public TransferResponse transferToBeneficiary(
            String userEmail,
            Long sourceAccountId,
            BeneficiaryTransferRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Beneficiary beneficiary = beneficiaryRepository
                .findByIdAndUser(request.beneficiaryId(), user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Beneficiary not found"));

        Account sourceAccount = accountRepository
                .findByIdAndUserForUpdate(sourceAccountId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Source account not found"));

        Account destinationAccount = accountRepository
                .findByAccountNumberForUpdate(beneficiary.getAccountNumber())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Destination account not found"));


        return executeTransfer(
                sourceAccount,
                destinationAccount,
                request.amount(),
                request.description()
        );
    }

    private TransferResponse executeTransfer(
            Account sourceAccount,
            Account destinationAccount,
            BigDecimal amount,
            String description) {

        if (sourceAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountOperationException(
                    "Source account must be active to transfer funds"
            );
        }

        if (destinationAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountOperationException(
                    "Destination account must be active to receive funds"
            );
        }

        if (sourceAccount.getId().equals(destinationAccount.getId())) {
            throw new InvalidTransferException(
                    "Source and destination accounts must be different"
            );
        }

        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient account balance"
            );
        }

        sourceAccount.setBalance(
                sourceAccount.getBalance().subtract(amount)
        );

        destinationAccount.setBalance(
                destinationAccount.getBalance().add(amount)
        );

        String referenceNumber = UUID.randomUUID().toString();

        Transaction outgoingTransaction = new Transaction(
                sourceAccount,
                TransactionType.TRANSFER_OUT,
                TransactionCategory.TRANSFER,
                amount,
                description,
                referenceNumber
        );

        Transaction incomingTransaction = new Transaction(
                destinationAccount,
                TransactionType.TRANSFER_IN,
                TransactionCategory.TRANSFER,
                amount,
                description,
                referenceNumber
        );

        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        transactionRepository.save(outgoingTransaction);
        transactionRepository.save(incomingTransaction);

        return new TransferResponse(
                referenceNumber,
                sourceAccount.getId(),
                destinationAccount.getId(),
                amount,
                LocalDateTime.now()
        );
    }
}