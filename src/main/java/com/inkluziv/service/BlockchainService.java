package com.inkluziv.service;

import java.math.BigDecimal;

public interface BlockchainService {
    String sendUSDT(String fromAddress, String toAddress, BigDecimal amount, String privateKey);
    BigDecimal getUSDTBalance(String walletAddress);
    boolean isValidAddress(String address);
    String generateWalletAddress();
    boolean verifyTransaction(String transactionHash);
}