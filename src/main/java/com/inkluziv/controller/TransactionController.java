package com.inkluziv.controller;

import com.inkluziv.dto.request.SendUSDTRequest;
import com.inkluziv.dto.response.SendUSDTResponse;
import com.inkluziv.dto.response.TransactionHistoryResponse;
import com.inkluziv.dto.response.WalletBalanceResponse;
import com.inkluziv.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/send-usdt")
    public ResponseEntity<SendUSDTResponse> sendUSDT(@RequestBody SendUSDTRequest request) {
        SendUSDTResponse response = transactionService.sendUSDT(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<TransactionHistoryResponse> getTransactionHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        TransactionHistoryResponse response = transactionService.getTransactionHistory(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/balance")
    public ResponseEntity<WalletBalanceResponse> getWalletBalance() {
        WalletBalanceResponse response = transactionService.getWalletBalance();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-wallet")
    public ResponseEntity<WalletBalanceResponse> createWallet() {
        WalletBalanceResponse response = transactionService.createWallet();
        return ResponseEntity.ok(response);
    }
}