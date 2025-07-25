package com.inkluziv.exception;

public class VoiceDoesNotMatchException extends RuntimeException {
    public VoiceDoesNotMatchException(String message) {
        super(message);
    }
}
