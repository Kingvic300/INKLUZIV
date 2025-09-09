package com.inkluziv.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CurrencyExchangeServiceImpl implements CurrencyExchangeService {

    private final RestTemplate restTemplate;

    @Value("${currency.exchange.api.url:https://api.exchangerate-api.com/v4/latest/USD}")
    private String exchangeApiUrl;

    // Fallback rate: 1 USD = 1600 NGN, 1 USDT ≈ 1 USD
    private static final BigDecimal FALLBACK_RATE = new BigDecimal("1600");

    @Override
    public BigDecimal getNairaToUSDTRate() {
        try {
            // Try to get live rate from API
            Map<String, Object> response = restTemplate.getForObject(exchangeApiUrl, Map.class);
            if (response != null && response.containsKey("rates")) {
                Map<String, Object> rates = (Map<String, Object>) response.get("rates");
                if (rates.containsKey("NGN")) {
                    Double ngnRate = (Double) rates.get("NGN");
                    return BigDecimal.valueOf(ngnRate).setScale(2, RoundingMode.HALF_UP);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch live exchange rate, using fallback: {}", e.getMessage());
        }

        // Return fallback rate
        return FALLBACK_RATE;
    }

    @Override
    public BigDecimal convertNairaToUSDT(BigDecimal nairaAmount) {
        BigDecimal rate = getNairaToUSDTRate();
        return nairaAmount.divide(rate, 6, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal convertUSDTToNaira(BigDecimal usdtAmount) {
        BigDecimal rate = getNairaToUSDTRate();
        return usdtAmount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }
}