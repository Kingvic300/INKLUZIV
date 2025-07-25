package com.inkluziv.exception;

public class EmailCannotBeBlankException extends RuntimeException {
    public EmailCannotBeBlankException(String message) {
        super(message);
    }
}
