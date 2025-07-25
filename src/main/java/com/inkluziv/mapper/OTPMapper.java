package com.inkluziv.mapper;

import com.inkluziv.dto.response.OTPResponse;

public class OTPMapper {

    public static OTPResponse mapToOTPResponse(String email, String message) {
        OTPResponse response = new OTPResponse();
        response.setEmail(email);
        response.setMessage(message);
        return response;
    }
}
