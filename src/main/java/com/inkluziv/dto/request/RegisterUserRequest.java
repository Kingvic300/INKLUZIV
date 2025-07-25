package com.inkluziv.dto.request;

import com.inkluziv.data.enums.Role;
import lombok.Data;

@Data
public class RegisterUserRequest {
    private String email;
    private String otp;
    private Role role;
}
