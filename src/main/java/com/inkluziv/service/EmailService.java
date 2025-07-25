package com.inkluziv.service;

import org.springframework.scheduling.annotation.Async;

public interface EmailService {
    @Async
    void sendEmail(String toEmail, String otp);

    @Async
    void sendResetPasswordEmail(String toEmail, String otp);
}
