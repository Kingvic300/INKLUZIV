package com.inkluziv.service;

import com.inkluziv.dto.request.SendUSDTRequest;
import com.inkluziv.dto.response.SendUSDTResponse;
import com.inkluziv.dto.response.TransactionHistoryResponse;
import com.inkluziv.dto.response.WalletBalanceResponse;

public interface TransactionService {
    SendUSDTResponse sendUSDT(SendUSDTRequest request);
    TransactionHistoryResponse getTransactionHistory(int page, int size);
    WalletBalanceResponse getWalletBalance();
    WalletBalanceResponse createWallet();
}