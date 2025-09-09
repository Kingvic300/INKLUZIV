package com.inkluziv.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SendUSDTRequest {
    private String recipientAddress;
    private String recipientName;
    private BigDecimal amountNaira;
    private String description;
}