package com.finflow.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateEmail(
            DuplicateEmailException exception) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }

    @ExceptionHandler(DuplicateBeneficiaryException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateBeneficiary(
            DuplicateBeneficiaryException exception
    ) {
        return buildErrorResponse(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }

    @ExceptionHandler(DuplicateBudgetException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateBudget(
            DuplicateBudgetException exception) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<Map<String, Object>> handleInsufficientFunds(
            InsufficientFundsException exception) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
            ResourceNotFoundException exception) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }

    @ExceptionHandler(InvalidTransferException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidTransfer(
            InvalidTransferException exception) {

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage()
        );
    }

    @ExceptionHandler(InvalidTransactionCategoryException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidTransactionCategory(
            InvalidTransactionCategoryException exception
    ){
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException exception) {

        Map<String, String> fieldErrors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        fieldErrors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        Map<String, Object> body = new LinkedHashMap<>();

        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        body.put("message", "Validation failed");
        body.put("fieldErrors", fieldErrors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(
            HttpStatus status,
            String message) {

        Map<String, Object> body = new LinkedHashMap<>();

        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        return ResponseEntity
                .status(status)
                .body(body);
    }

    @ExceptionHandler(AccountOperationException.class)
    public ResponseEntity<Map<String, Object>> handleAccountOperation(
            AccountOperationException exception) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }
}
