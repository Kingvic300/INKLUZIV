package com.inkluziv.service;

import com.inkluziv.dto.response.OTPResponse;

public interface OTPService {
    OTPResponse sendOtp(String email);

    OTPResponse sendResetPasswordOtp(String email);

    OTPResponse verifyOtp(String email, String otp);

    OTPResponse deleteOtp(String email, String otp);
}
