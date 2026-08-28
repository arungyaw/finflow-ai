package com.finflow.exception;

public class InvalidTransactionCategoryException extends RuntimeException {

    public InvalidTransactionCategoryException(String message) {
        super(message);
    }
}
