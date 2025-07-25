package com.inkluziv.exception;

public class InvalidEmailRegexException extends RuntimeException {
    public InvalidEmailRegexException(String message) {
        super(message);
    }
}
