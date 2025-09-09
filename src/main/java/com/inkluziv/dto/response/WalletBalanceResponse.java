package com.inkluziv.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WalletBalanceResponse {
    private String message;
    private BigDecimal balanceNaira;
    private BigDecimal balanceUSDT;
    private String walletAddress;
    private BigDecimal exchangeRate;
}