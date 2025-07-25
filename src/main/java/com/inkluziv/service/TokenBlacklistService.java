package com.inkluziv.service;

import org.springframework.stereotype.Service;

@Service
public interface TokenBlacklistService {
    void blacklistToken(String token);
    void blacklistAllUserTokens(Long userId);
    boolean isTokenBlacklisted(String token);
}
