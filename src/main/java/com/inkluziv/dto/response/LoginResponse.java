package com.inkluziv.dto.response;

import com.inkluziv.data.enums.Role;
import com.inkluziv.data.model.User;
import lombok.Data;

@Data
public class LoginResponse {
    private User user;
    private Role role;
    private String userId;
    private String token;
    private String message;
}
