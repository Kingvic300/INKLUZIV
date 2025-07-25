package com.inkluziv.dto.response;

import lombok.Data;

@Data
public class ResetPasswordResponse {
    private String message;
    private String email;
}
