package com.inkluziv.dto.request;

import com.inkluziv.data.enums.Role;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private Role role;
}
