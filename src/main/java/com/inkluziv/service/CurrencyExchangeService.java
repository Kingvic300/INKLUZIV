package com.inkluziv.service;

import java.math.BigDecimal;

public interface CurrencyExchangeService {
    BigDecimal getNairaToUSDTRate();
    BigDecimal convertNairaToUSDT(BigDecimal nairaAmount);
    BigDecimal convertUSDTToNaira(BigDecimal usdtAmount);
}