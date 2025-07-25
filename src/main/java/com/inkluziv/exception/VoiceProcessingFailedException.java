package com.inkluziv.exception;

public class VoiceProcessingFailedException extends RuntimeException {
    public VoiceProcessingFailedException(String message) {
        super(message);
    }
}
