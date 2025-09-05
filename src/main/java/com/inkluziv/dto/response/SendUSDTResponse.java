package com.inkluziv.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendUSDTResponse {
    private String message;
    private String transactionHash;
    private BigDecimal amountNaira;
    private BigDecimal amountUSDT;
    private BigDecimal exchangeRate;
    private String status;
    private String transactionId;
}